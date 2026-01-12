<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-white">{{ $t("home.notification") }}</h1>
              <p class="text-blue-100 text-sm mt-0.5">{{ $t("notification.subtitle") || "Barcha bildirishnomalaringiz" }}</p>
            </div>
          </div>
          <div v-if="notifications.length > 0" class="hidden sm:flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-xl">
            <span class="text-white font-semibold text-lg">{{ notifications.length }}</span>
            <span class="text-blue-100 text-sm">{{ $t("notification.new") || "yangi" }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-600">{{ $t("notification.all") || "Barchasi" }}: <strong>{{ notifications.length }}</strong></span>
            </div>
          </div>
          <button
            v-if="notifications.length > 0"
            @click="refreshNotifications"
            class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t("notification.refresh") || "Yangilash" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-if="notifications.length > 0" class="space-y-4">
      <transition-group name="notification-list" tag="div" class="space-y-4">
        <notification
          v-for="item in notifications"
          :key="item.id || item._id"
          :getNotifications="getNotifications"
          :item="item"
          class="notification-item"
        />
      </transition-group>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-8 lg:p-12 text-center">
      <div class="max-w-sm mx-auto">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t("notification.empty_title") || "Bildirishnomalar yo'q" }}</h3>
        <p class="text-gray-500 text-sm mb-6">{{ $t("notification.empty_desc") || "Hozircha sizga hech qanday bildirishnoma kelmagan. Yangi bildirishnomalar bu yerda ko'rinadi." }}</p>
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t("notification.go_home") || "Bosh sahifaga" }}
        </nuxt-link>
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
    isRefreshing: false,

    // ichki
    _retryTimer: null,
    _retryDelay: 300,      // backoff start (ms)
    _lastUserId: null,
    _subscribed: false,
    _lastSig: '',

    // cnt refresh
    _cntDebounce: null,
    _cntInFlight: false,

    // lokal socket fallback (agar root/socket bo'lmasa)
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

    getNotifications() { return this.notifications },

    async refreshNotifications() {
      if (this.isRefreshing) return
      this.isRefreshing = true
      try {
        this._emitAsk()
        await new Promise(resolve => setTimeout(resolve, 1000))
      } finally {
        this.isRefreshing = false
      }
    }
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
/* Notification list animations */
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s ease;
}

.notification-list-enter,
.notification-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.notification-list-move {
  transition: transform 0.3s ease;
}

.notification-item {
  transition: all 0.2s ease;
}

.notification-item:hover {
  transform: translateY(-2px);
}

/* Refresh button animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
