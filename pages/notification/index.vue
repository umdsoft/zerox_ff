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
    // UI
    tab: 0,
    balance: 0,
    notifications: [],
    news: [],

    // ichki
    _retryTimer: null,
    _retryDelay: 300,      // backoff start (ms)
    _lastUserId: null,
    _subscribed: false,
    _lastSig: '',

    // cnt refresh
    _cntDebounce: null,
    _cntInFlight: false,

    // lokal socket fallback (agar root/socket bo‘lmasa)
    _localSocket: null
  }),

  created() {
    // local cache’dan tez render
    try {
      const b = localStorage.getItem('user_balance')
      if (b != null) this.balance = +b || 0
      const n = JSON.parse(localStorage.getItem('user_notifications') || '[]')
      if (Array.isArray(n)) this.notifications = n
    } catch (_) {}
  },

  mounted() {
    this._ensureForUser()
    this._connectWithBackoff()
  },

  activated() {
    // keep-alive’dan qaytganda ham tekshiramiz
    this._ensureForUser()
    const s = this._sock()
    if (s?.connected) this._subscribeOnce()
    else this._connectWithBackoff()
  },

  deactivated() {
    // listenerlar qolsin (keep-alive), faqat reconnect timerini o‘chirib turamiz
    this._clearBackoff()
  },

  beforeDestroy() {
    this._teardown()
    this._clearBackoff()
    if (this._cntDebounce) clearTimeout(this._cntDebounce)
    // lokal soketni yopamiz (globalga tegmaymiz)
    try { this._localSocket?.close?.() } catch (_) {}
    this._localSocket = null
  },

  methods: {
    /* ---------- SOCKET UTILS ---------- */
    _sock() {
      // 1) root.socket (agar siz layout’da saqlasangiz)
      if (this.$root && this.$root.socket) return this.$root.socket
      // 2) nuxt-socket-io standart alias
      if (this.$socket) return this.$socket
      // 3) fallback: shu komponent o‘zi ochadi
      if (!this._localSocket && this.$nuxtSocket) {
        this._localSocket = this.$nuxtSocket({
          name: 'home',
          channel: '/',
          secure: true,
          default: false
        })
      }
      return this._localSocket
    },

    _clearBackoff() {
      if (this._retryTimer) clearTimeout(this._retryTimer)
      this._retryTimer = null
      this._retryDelay = 300
    },

    _connectWithBackoff() {
      this._clearBackoff()
      const tick = () => {
        const s = this._sock()
        if (s?.connected) {
          this._clearBackoff()
          this._subscribeOnce()
        } else {
          try { s?.connect?.() } catch (_) {}
          this._retryTimer = setTimeout(tick, this._retryDelay)
          this._retryDelay = Math.min(this._retryDelay * 2, 5000)
        }
      }
      tick()
    },

    _ensureForUser() {
      const uid = this.$auth?.user?.id
      if (!uid || uid === this._lastUserId) return
      this._lastUserId = uid

      const s = this._sock()
      if (!s) return

      // token (Bearer’siz) — ayrim backendlar shuni auth’da kutadi
      const raw = this.$auth?.strategy?.token?.get?.() || ''
      const token = raw.replace(/^Bearer\s+/i, '')
      if (token) s.auth = { token }

      // query.id ko‘p backendlarda kerak bo‘ladi
      try { s.io && (s.io.opts.query = { ...(s.io?.opts?.query || {}), id: uid }) } catch (_) {}

      // qayta ulash ketma-ketligi
      if (s.connected) s.disconnect()
      const onConnect = () => { s.off?.('connect', onConnect); this._subscribed = false; this._subscribeOnce() }
      s.on('connect', onConnect)
      s.connect()
    },

    _subscribeOnce() {
      const s = this._sock()
      if (!s || this._subscribed) return

      // avval eski listenerlarni tozalaymiz
      this._teardown()

      // 🔔 backend event nomi AYNAN shu: "recive_notification"
      s.on('recive_notification', this._onNotification)

      // ulanish holatlarida darhol so‘rash
      s.on('connect', this._emitAsk)
      s.on('reconnect', this._emitAsk)

      // birinchi so‘rov
      this._emitAsk()
      this._subscribed = true
    },

    _teardown() {
      const s = this._sock()
      if (!s) return
      s.off?.('recive_notification', this._onNotification)
      s.off?.('connect', this._emitAsk)
      s.off?.('reconnect', this._emitAsk)
      this._subscribed = false
    },

    _emitAsk() {
      const s = this._sock()
      const id = this.$auth?.user?.id
      if (s?.connected && id) {
        // server sizda shuni kutadi:
        s.emit('send_notification', { id })
      }
    },

    /* ---------- PAYLOAD / STATE ---------- */
    _normalizePayload(payload) {
      // turli formatlarni qo‘llab-quvvatlaymiz
      if (Array.isArray(payload)) {
        return { notifications: payload, balance: undefined }
      }
      const p = payload || {}
      const notifications = p.notification || p.notifications || p.data?.notifications || []
      const balance = (p.amount && typeof p.amount.balance === 'number')
        ? p.amount.balance
        : (typeof p.balance === 'number' ? p.balance : undefined)
      return { notifications: Array.isArray(notifications) ? notifications : [], balance }
    },

    _signature({ notifications, balance }) {
      // sodda lekin yetarli: length + birinchi/oxirgi id + balance
      const len = notifications.length
      const head = len ? (notifications[0]?.id || notifications[0]?.created_at || '') : ''
      const tail = len ? (notifications[len - 1]?.id || notifications[len - 1]?.created_at || '') : ''
      return `${len}|${head}|${tail}|${balance ?? ''}`
    },

    _onNotification(payload) {
      // xatolar oqimni to‘xtatmasin
      try {
        const { notifications, balance } = this._normalizePayload(payload)
        const sig = this._signature({ notifications, balance })
        if (sig === this._lastSig) return
        this._lastSig = sig

        const prevLen = this.notifications.length
        const prevBal = this.balance

        this.notifications = notifications
        if (typeof balance === 'number') this.balance = balance

        // headerga (agar kerak bo‘lsa)
        this.$root?.$emit?.('update-header-balance', {
          balance: this.balance,
          notifications: this.notifications
        })

        // local cache-ni faqat o‘zgarganda yozamiz
        try {
          const bStr = String(this.balance)
          if (localStorage.getItem('user_balance') !== bStr) {
            localStorage.setItem('user_balance', bStr)
          }
          const nStr = JSON.stringify(this.notifications)
          if (localStorage.getItem('user_notifications') !== nStr) {
            localStorage.setItem('user_notifications', nStr)
          }
        } catch (_) {}

        // 🔁 cnt ni yangilash — faqat haqiqatda o‘zgarsa
        if (this.balance !== prevBal || this.notifications.length !== prevLen) {
          this._scheduleCntRefresh()
        }
      } catch (e) {
        // console.error(e)
      }
    },

    /* ---------- CNT SYNC (/user/me) ---------- */
    _scheduleCntRefresh() {
      if (this._cntDebounce) clearTimeout(this._cntDebounce)
      this._cntDebounce = setTimeout(this._refreshAuthUserCnt, 200)
    },

    async _refreshAuthUserCnt() {
      if (!this.$auth?.loggedIn || this._cntInFlight) return
      this._cntInFlight = true
      try {
        const { data } = await this.$axios.get('/user/me', {
          headers: { 'Cache-Control': 'no-cache' },
          params: { t: Date.now() } // cache-bypass
        })
        const fresh = data?.data || data
        if (fresh && typeof fresh === 'object') {
          // faqat cnt o‘zgarganda setUser qilib, qolgan maydonlarni ham yangilaymiz
          if ((this.$auth.user?.cnt ?? null) !== (fresh.cnt ?? null)) {
            this.$auth.setUser(fresh)
            this.$nuxt.$emit('auth-user-updated', { cnt: fresh.cnt })
          }
        }
      } catch (_) {
        // jim
      } finally {
        this._cntInFlight = false
      }
    },

    /* ---------- OTHER ---------- */
    checkContractRedirect() {
      const u = this.$auth?.user || {}
      if (u.is_active === 1 && u.is_contract === 0) {
        this.$router.push(this.localePath({ name: 'universal_contract' }))
      }
    },

    getNotifications() { return this.notifications }
  },

  watch: {
    '$auth.loggedIn'(v) {
      if (v) {
        this.$nextTick(() => {
          this._ensureForUser()
          this._connectWithBackoff()
          this._scheduleCntRefresh()
        })
      } else {
        this._teardown()
        this._clearBackoff()
      }
    },
    '$auth.user.id'(n, o) {
      if (n && n !== o) {
        this.$nextTick(() => {
          this._ensureForUser()
          this._connectWithBackoff()
          this._scheduleCntRefresh()
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
