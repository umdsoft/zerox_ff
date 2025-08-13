<template>
  <div class="notification px-2 lg:px-4 py-4 rounded-lg bg-white w-full">
    <ul class="flex justify-center list-none border-b-0 pl-0 mb-2 mt-1" id="tabs-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button @click="tab = 0" style="position: relative" :class="tab === 0 ? 'bg-blue-500 text-white ' : ''"
          class="nav-link py-2 block rounded leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 my-1 focus:border-transparent active"
          id="tabs-home-tab" data-bs-toggle="pill" data-bs-target="#tabs-home" role="tab" aria-controls="tabs-home"
          aria-selected="true">
          {{ $t("home.notification") }}
          <p v-if="notifications.length" class="noti_count">
            {{ notifications.length }}
          </p>
        </button>
      </li>
      <!-- <li class="nav-item" role="presentation">
        <button @click="tab = 1" :class="tab === 1 ? 'bg-blue-500 text-white ' : ''"
          class="nav-link ml-4 rounded py-2 block leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 my-1 focus:border-transparent"
          id="tabs-profile-tab" data-bs-toggle="pill" data-bs-target="#tabs-profile" role="tab"
          aria-controls="tabs-profile" aria-selected="false">
          {{ $t("home.news") }}
        </button>
      </li> -->
    </ul>

    <div v-if="tab == 0">
      <div v-if="notifications.length > 0">
        <notification v-for="item in notifications" :key="item.id" :getNotifications="getNotifications" :item="item" />
      </div>
      <div class="flex justify-center" v-else>{{ $t("empty") }}</div>
    </div>

    <div v-if="tab === 1">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <news-component v-for="item in news" :key="item.id" :getNews="news" :item="item" />
      </div>
    </div>
  </div>
</template>
<script>
import Notification from '@/components/Notification.vue'
import NewsComponent from '@/components/NewsComponent.vue'

export default {
  middleware: 'auth',
  components: { Notification, NewsComponent },

  data: () => ({
    notifications: [],
    news: [],
    tab: 0,
    balance: 0,

    // ichki texnik holatlar
    _sockInterval: null,   // retry interval ID
    _lastUserId: null,     // oxirgi kuzatilgan user id
    _subscribed: false     // bir martalik subscribe flag
  }),

  mounted() {
    this.ensureSocketForCurrentUser()
    this.setupSocketWithRetry()
    this.checkContractRedirect()

    const storedBalance = localStorage.getItem('user_balance')
    if (storedBalance) this.balance = parseFloat(storedBalance)
  },

  activated() {
    this.ensureSocketForCurrentUser()
    const s = this.getSocket()
    if (s?.connected) this.subscribeOnce()
    else this.setupSocketWithRetry()
  },

  deactivated() {
    this.teardownListeners()
    this.clearRetry()
  },

  beforeDestroy() {
    this.teardownListeners()
    this.clearRetry()
  },

  methods: {
    /** Root yoki nuxt-socket-io dan instansni olish */
    getSocket() {
      return this.$root?.socket || this.$socket || null
    },

    /** Intervalni tozalash */
    clearRetry() {
      if (this._sockInterval) {
        clearInterval(this._sockInterval)
        this._sockInterval = null
      }
    },

    /**
     * Socket tayyor bo‘lguncha 300ms da tekshirib turish.
     * Tayyor bo‘lsa subscribeOnce() chaqiriladi.
     */
    setupSocketWithRetry() {
      this.clearRetry()
      this._sockInterval = setInterval(() => {
        const s = this.getSocket()
        if (s?.connected) {
          this.clearRetry()
          this.subscribeOnce()
        }
      }, 300)
    },

    /**
     * 👥 User almashganda socket.auth va socket.io.opts.query.id ni yangilab,
     * disconnect → connect qilamiz. Connect bo‘lgach darhol subscribe bo‘lamiz.
     */
    ensureSocketForCurrentUser() {
      const userId = this.$auth?.user?.id || null
      if (!userId) return
      if (this._lastUserId === userId) return
      this._lastUserId = userId

      const s = this.getSocket()
      if (!s) return

      // Nuxt Auth dan token (Bearer’siz)
      const raw = this.$auth?.strategy?.token?.get?.() || ''
      const token = raw.replace(/^Bearer\s+/i, '')
      if (token) s.auth = { token }

      // 🔁 Ko‘p backendlar query.id bilan identifikatsiya qiladi — shuni ham yangilaymiz
      try {
        s.io.opts.query = { ...(s.io?.opts?.query || {}), id: userId }
      } catch (_) {}

      // eski sessiyani uzib, yangisini ulaymiz
      if (s.connected) s.disconnect()

      // Connect bo‘lgach darhol subscribe bo‘lish uchun bir martalik listener
      const onConnectOnce = () => {
        s.off?.('connect', onConnectOnce)
        this._subscribed = false
        this.subscribeOnce()
      }
      s.on('connect', onConnectOnce)

      s.connect()
    },

    /**
     * Bir martalik subscribe — ghost listenerlar bo‘lmasligi uchun _subscribed flag bilan
     */
    subscribeOnce() {
      const s = this.getSocket()
      if (!s || this._subscribed) return

      // avval eski listenerlarni tozalaymiz
      this.teardownListeners()

      // asosiy notificatsiya event
      s.on('recive_notification', this.handleNotification)

      // connect/reconnect paytida ham birinchi ma’lumotni so‘raymiz
      s.on('connect', this.emitNotificationRequest)
      s.on('reconnect', this.emitNotificationRequest)

      // birinchi marta ma’lumot so‘rash
      this.emitNotificationRequest()

      this._subscribed = true
    },

    /** hamma listenerlarni olib tashlash */
    teardownListeners() {
      const s = this.getSocket()
      if (!s) return
      s.off?.('recive_notification', this.handleNotification)
      s.off?.('connect', this.emitNotificationRequest)
      s.off?.('reconnect', this.emitNotificationRequest)
      this._subscribed = false
    },

    /** Backend’dan bildirishnomalarni so‘rash */
    emitNotificationRequest() {
      const s = this.getSocket()
      const id = this.$auth?.user?.id
      if (s?.connected && id) {
        // ID ni albatta yuboramiz (backend talab qilsa)
        // xohlasangiz tokenni ham qo‘shib yuborishingiz mumkin:
        // const raw = this.$auth?.strategy?.token?.get?.() || ''
        // const token = raw.replace(/^Bearer\s+/i, '')
        // s.emit('send_notification', { id, token })
        s.emit('send_notification', { id })
      }
    },

    /** Kelayotgan payloadni xavfsiz parse qilib, UI ni yangilash */
    handleNotification(payload) {
      // 3 xil variantni qo‘llab-quvvatlaymiz
      const list = Array.isArray(payload)
        ? payload
        : (payload?.notification ?? payload?.notifications ?? [])

      this.notifications = Array.isArray(list) ? list : []
      this.balance = payload?.amount?.balance ?? payload?.balance ?? this.balance

      // headerni yangilash (agar tinglayotgan bo‘lsa)
      this.$root.$emit('update-header-balance', {
        balance: this.balance,
        notifications: this.notifications
      })

      // localStorage sinxronizatsiya
      localStorage.setItem('user_balance', String(this.balance))
      localStorage.setItem('user_notifications', JSON.stringify(this.notifications))
    },

    /** Foydalanuvchi kontrakt holatiga ko‘ra redirect */
    checkContractRedirect() {
      const u = this.$auth?.user || {}
      if (u.is_active === 1 && u.is_contract === 0) {
        this.$router.push(this.localePath({ name: 'universal_contract' }))
      }
    },

    /** Tashqi komponentga kerak bo‘lsa */
    getNotifications() {
      return this.notifications
    }
  },

  watch: {
    /** Login/Logout bo‘lsa — qayta autentifikatsiya + subscribe */
    '$auth.loggedIn'(v) {
      if (v) {
        this.$nextTick(() => {
          this.ensureSocketForCurrentUser()
          this.setupSocketWithRetry()
        })
      } else {
        this.teardownListeners()
        this.clearRetry()
      }
    },

    /** Faqat user id o‘zgarsa ham (logout→login other user) */
    '$auth.user.id'(n, o) {
      if (n && n !== o) {
        this.$nextTick(() => {
          this.ensureSocketForCurrentUser()
          this.setupSocketWithRetry()
        })
      }
    }
  }
}
</script>




<style lang="css" scoped>
.noti_count {
  font-size: 12px;
  min-width: 15px;
  min-height: 15px;
  display: flex;
  color: white;
  position: absolute;
  font-weight: 600;
  top: 3px;
  right: 5px;
  align-items: center;
  justify-content: center;
  background: red;
  border-radius: 50%;
}
</style>
