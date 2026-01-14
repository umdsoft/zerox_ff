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

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm p-8 text-center">
      <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-500">{{ $t("notification.loading") || "Yuklanmoqda..." }}</p>
    </div>

    <!-- Notifications List -->
    <div v-else-if="notifications.length > 0" class="space-y-4">
      <transition-group name="notification-list" tag="div" class="space-y-4">
        <notification
          v-for="item in notifications"
          :key="item.id || item._id"
          :getNotifications="handleRefresh"
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

export default {
  middleware: 'auth',
  components: { Notification },

  data() {
    return {
      balance: 0,
      notifications: [],
      isRefreshing: false,
      isLoading: true,
      _unsubscribeNotification: null,
      _unsubscribeConnect: null,
      _unsubscribeReconnect: null,
      _unsubscribeRegistered: null,
      _retryTimer: null,
      _subscribed: false,
    }
  },

  created() {
    // local cache'dan tez render
    try {
      const b = localStorage.getItem('user_balance')
      if (b != null) this.balance = +b || 0
      const n = JSON.parse(localStorage.getItem('user_notifications') || '[]')
      if (Array.isArray(n) && n.length > 0) {
        this.notifications = n
        this.isLoading = false
      }
    } catch (_) {}
  },

  mounted() {
    // Faqat socket orqali real-time olish (API ishlatmaymiz!)
    this._initSocket()
  },

  activated() {
    // Sahifa qayta ochilganda socket orqali so'rov
    this._initSocket()
  },

  beforeDestroy() {
    this._cleanup()
  },

  methods: {
    /* ---------- SOCKET ---------- */
    _initSocket() {
      this._cleanup()

      const userId = this.$auth?.user?.id
      if (!userId) {
        this.isLoading = false
        return
      }

      this._subscribeToSocket()
    },

    _subscribeToSocket() {
      if (this._subscribed) return

      // socketManager tayyor bo'lguncha kutish
      if (!this.$socketManager?.isInitialized) {
        this._retryTimer = setTimeout(() => this._subscribeToSocket(), 100)
        return
      }

      this._subscribed = true

      // Notification eventga subscribe
      this._unsubscribeNotification = this.$socketManager.subscribe(
        'recive_notification',
        (payload) => this._handleNotification(payload)
      )

      // Connect eventga subscribe
      this._unsubscribeConnect = this.$socketManager.subscribe(
        'connect',
        () => this._triggerRequest()
      )

      // Reconnect eventga ham subscribe
      this._unsubscribeReconnect = this.$socketManager.subscribe(
        'reconnect',
        () => this._triggerRequest()
      )

      // Registered eventga subscribe (backend register bo'lganda notification yuboradi)
      this._unsubscribeRegistered = this.$socketManager.subscribe(
        'registered',
        () => {
          if (this.isLoading) {
            setTimeout(() => this._requestNotifications(), 200)
          }
        }
      )

      // Agar socket allaqachon ulangan bo'lsa
      if (this.$socketManager.connected) {
        this._triggerRequest()
      }

      // Fallback: 2 sekund ichida ma'lumot kelmasa
      setTimeout(() => {
        if (this.isLoading && this.notifications.length === 0) {
          this._requestNotifications()
        }
      }, 2000)
    },

    _triggerRequest() {
      const userId = this.$auth?.user?.id
      if (!userId) return

      if (this.$socketManager?.connected) {
        this.$socketManager.emit('register', { id: userId })

        setTimeout(() => {
          if (this.$socketManager?.connected && this.isLoading) {
            this.$socketManager.requestNotifications(userId)
          }
        }, 500)
      }
    },

    _cleanup() {
      if (this._unsubscribeNotification) {
        this._unsubscribeNotification()
        this._unsubscribeNotification = null
      }
      if (this._unsubscribeConnect) {
        this._unsubscribeConnect()
        this._unsubscribeConnect = null
      }
      if (this._unsubscribeReconnect) {
        this._unsubscribeReconnect()
        this._unsubscribeReconnect = null
      }
      if (this._unsubscribeRegistered) {
        this._unsubscribeRegistered()
        this._unsubscribeRegistered = null
      }
      if (this._retryTimer) {
        clearTimeout(this._retryTimer)
        this._retryTimer = null
      }
      this._subscribed = false
    },

    _requestNotifications() {
      const userId = this.$auth?.user?.id
      if (!userId) return

      if (this.$socketManager?.connected) {
        this.$socketManager.requestNotifications(userId)
      }
    },

    _handleNotification(payload) {
      try {
        const { notifications, balance } = this._normalizePayload(payload)

        this.notifications = notifications

        if (typeof balance === 'number') {
          this.balance = balance
        }

        this.isLoading = false
        this.isRefreshing = false

        try {
          localStorage.setItem('user_balance', String(this.balance))
          localStorage.setItem('user_notifications', JSON.stringify(this.notifications))
        } catch (_) {}

        this.$root?.$emit?.('update-header-balance', {
          balance: this.balance,
          notifications: this.notifications
        })
      } catch (e) {
        this.isLoading = false
      }
    },

    _normalizePayload(payload) {
      if (Array.isArray(payload)) {
        return { notifications: payload, balance: undefined }
      }

      const p = payload || {}

      // Turli formatlarni qo'llab-quvvatlash
      let notifications = []
      if (Array.isArray(p.notification)) {
        notifications = p.notification
      } else if (Array.isArray(p.notifications)) {
        notifications = p.notifications
      } else if (Array.isArray(p.data?.notifications)) {
        notifications = p.data.notifications
      } else if (Array.isArray(p.data)) {
        notifications = p.data
      }

      // Balance
      let balance = undefined
      if (p.amount && typeof p.amount.balance === 'number') {
        balance = p.amount.balance
      } else if (typeof p.balance === 'number') {
        balance = p.balance
      }

      return { notifications, balance }
    },

    /* ---------- PUBLIC ---------- */
    handleRefresh() {
      // Socket orqali yangilash (API emas!)
      this._requestNotifications()
      return this.notifications
    },

    refreshNotifications() {
      if (this.isRefreshing) return
      this.isRefreshing = true

      // Faqat socket orqali yangilash
      this._requestNotifications()

      // 2 sekunddan keyin refreshing ni o'chirish (socket javobidan keyin avtomatik o'chadi)
      setTimeout(() => {
        this.isRefreshing = false
      }, 2000)
    }
  },

  watch: {
    '$auth.loggedIn'(v) {
      if (v) {
        this.$nextTick(() => {
          // Faqat socket orqali (API emas!)
          this._initSocket()
        })
      } else {
        this._cleanup()
        this.balance = 0
        this.notifications = []
      }
    },
    '$auth.user.id'(n, o) {
      if (n && n !== o) {
        this.$nextTick(() => {
          // Faqat socket orqali (API emas!)
          this._initSocket()
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
