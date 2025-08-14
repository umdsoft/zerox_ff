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

    // ichki holatlar
    _retryTimer: null,
    _retryDelay: 300,          // exponential backoff boshlang'ich ms
    _lastUserId: null,
    _subscribed: false,
    _pendingFrame: 0,          // rAF batching
    _lastHash: ''              // diff guard
  }),

  created() {
    // local cache'dan tezkor render ⚡
    try {
      const b = localStorage.getItem('user_balance')
      if (b != null) this.balance = +b || 0
      const n = JSON.parse(localStorage.getItem('user_notifications') || '[]')
      if (Array.isArray(n)) this.notifications = n
    } catch (_) {}
  },

  mounted() {
    this.ensureSocketForCurrentUser()
    this.trySubscribeWithBackoff()
    this.checkContractRedirect()
  },

  activated() {
    this.ensureSocketForCurrentUser()
    const s = this._sock()
    if (s?.connected) this._subscribeOnce()
    else this.trySubscribeWithBackoff()
  },

  deactivated() {
    this._teardown()
    this._clearBackoff()
  },

  beforeDestroy() {
    this._teardown()
    this._clearBackoff()
  },

  methods: {
    // --- UTIL ---
    _sock() { return this.$root?.socket || this.$socket || null },

    _clearBackoff() {
      if (this._retryTimer) clearTimeout(this._retryTimer)
      this._retryTimer = null
      this._retryDelay = 300
    },

    trySubscribeWithBackoff() {
      this._clearBackoff()
      const tick = () => {
        const s = this._sock()
        if (s?.connected) {
          this._clearBackoff()
          this._subscribeOnce()
        } else {
          this._retryTimer = setTimeout(tick, this._retryDelay)
          // backoff: 0.3s → 0.6s → 1.2s … max 5s
          this._retryDelay = Math.min(this._retryDelay * 2, 5000)
        }
      }
      tick()
    },

    // --- AUTH / USER / SOCKET ---
    ensureSocketForCurrentUser() {
      const uid = this.$auth?.user?.id
      if (!uid || uid === this._lastUserId) return
      this._lastUserId = uid

      const s = this._sock()
      if (!s) return

      // auth header/token (Bearer’siz)
      const raw = this.$auth?.strategy?.token?.get?.() || ''
      const token = raw.replace(/^Bearer\s+/i, '')
      if (token) s.auth = { token }

      // query ga user id ni qo‘shamiz (ko‘p backendlarda kerak bo‘ladi)
      try { s.io.opts.query = { ...(s.io?.opts?.query || {}), id: uid } } catch (_) {}

      // qayta ulash
      if (s.connected) s.disconnect()
      const onConnect = () => { s.off?.('connect', onConnect); this._subscribed = false; this._subscribeOnce() }
      s.on('connect', onConnect)
      s.connect()
    },

    _subscribeOnce() {
      const s = this._sock()
      if (!s || this._subscribed) return

      this._teardown()

      // server → client
      s.on('recive_notification', this._onNotification)

      // life-cycle
      const ask = this._emitAsk
      s.on('connect', ask)
      s.on('reconnect', ask)

      // birinchi so‘rov
      ask()
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
      if (s?.connected && id) s.emit('send_notification', { id })
    },

    // --- STATE UPDATE ---
    _hash(payload) {
      // tez va arzon hash: length + bir nechta id/ts birikmasi
      const list = Array.isArray(payload) ? payload
        : (payload?.notification ?? payload?.notifications ?? [])
      const len = Array.isArray(list) ? list.length : 0
      const head = len ? (list[0]?.id || list[0]?.created_at || '') : ''
      const tail = len > 1 ? (list[len - 1]?.id || list[len - 1]?.created_at || '') : ''
      const bal  = payload?.amount?.balance ?? payload?.balance ?? ''
      return `${len}|${head}|${tail}|${bal}`
    },

    _onNotification(payload) {
      // diff guard — bir xil bo‘lsa UI ni bezovta qilmaymiz
      const sig = this._hash(payload)
      if (sig === this._lastHash) return
      this._lastHash = sig

      // rAF bilan batching — DOM/reaktiv yangilanishlarni jamlaymiz
      if (this._pendingFrame) cancelAnimationFrame(this._pendingFrame)
      this._pendingFrame = requestAnimationFrame(() => {
        this._pendingFrame = 0

        const list = Array.isArray(payload)
          ? payload
          : (payload?.notification ?? payload?.notifications ?? [])

        this.notifications = Array.isArray(list) ? list : []
        const newBal = payload?.amount?.balance ?? payload?.balance
        if (typeof newBal === 'number') this.balance = newBal

        // headerga signal
        this.$root.$emit('update-header-balance', {
          balance: this.balance,
          notifications: this.notifications
        })

        // localStorage — faqat o‘zgarganda yozamiz
        try {
          const prevB = localStorage.getItem('user_balance')
          const bStr = String(this.balance)
          if (prevB !== bStr) localStorage.setItem('user_balance', bStr)

          const prevN = localStorage.getItem('user_notifications')
          const nStr = JSON.stringify(this.notifications)
          if (prevN !== nStr) localStorage.setItem('user_notifications', nStr)
        } catch (_) {}
      })
    },

    // --- OTHER ---
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
          this.ensureSocketForCurrentUser()
          this.trySubscribeWithBackoff()
        })
      } else {
        this._teardown()
        this._clearBackoff()
      }
    },
    '$auth.user.id'(n, o) {
      if (n && n !== o) {
        this.$nextTick(() => {
          this.ensureSocketForCurrentUser()
          this.trySubscribeWithBackoff()
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
