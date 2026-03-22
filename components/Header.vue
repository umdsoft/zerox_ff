<template>
  <header class="header-main sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-4 lg:py-4 lg:px-6">
    <div class="flex items-center justify-between gap-4">
      <!-- Left: Mobile Menu Toggle & Back -->
      <div class="flex items-center gap-3 lg:hidden">
        <button
          @click="barClick"
          class="w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          v-if="showBackButton"
          @click="$backWithLocale()"
          class="w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-colors"
          aria-label="Go back"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Center: Balance Card (Desktop) -->
      <div class="hidden md:flex flex-1 justify-start pl-4">
        <nuxt-link
          v-if="$auth.loggedIn"
          :to="localePath({ name: 'mobil-hisob' })"
          class="flex items-center gap-3 bg-white py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke-width="2" />
              <path d="M2 10h20" stroke-width="2" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500">{{ $t("navbar.mobile") }}</span>
            <span class="text-sm font-semibold text-gray-900">{{ formattedBalance }}</span>
          </div>
        </nuxt-link>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-2 md:gap-4">
        <!-- Language Selector -->
        <div class="relative" @click.stop="toggleLangDropdown">
          <div class="flex items-center gap-2 py-2 px-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg cursor-pointer transition-colors">
            <img :src="currentLangFlag" :alt="currentLangLabel" class="w-5 h-3.5 rounded-sm object-cover" />
            <span class="text-sm font-semibold text-white hidden sm:inline">{{ currentLangLabel }}</span>
            <svg
              class="w-4 h-4 text-white transition-transform"
              :class="{ 'rotate-180': langDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <transition name="dropdown">
            <div
              v-if="langDropdownOpen"
              class="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden min-w-max z-50"
            >
              <button
                v-for="lang in availableLanguages"
                :key="lang.code"
                @click.stop="changeLanguage(lang.code)"
                class="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50 text-blue-600 font-semibold': $i18n.locale === lang.code }"
              >
                <img :src="lang.flag" :alt="lang.label" class="w-5 h-3.5 rounded-sm object-cover" />
                <span>{{ lang.label }}</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- Notifications -->
        <nuxt-link
          v-if="$auth.loggedIn"
          :to="localePath({ name: 'notification' })"
          class="relative w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-colors"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span
            v-if="dds.not > 0"
            class="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-red-500 rounded-full flex items-center justify-center border-2 border-blue-700"
            style="font-size: 10px; font-weight: 700; color: white; line-height: 1;"
          >
            {{ dds.not > 99 ? '99+' : dds.not }}
          </span>
        </nuxt-link>

        <!-- User Profile -->
        <nuxt-link
          v-if="$auth.loggedIn"
          :to="localePath({ name: 'cabinet' })"
          class="flex items-center gap-3 p-1.5 sm:pr-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-colors"
        >
          <div
            :class="[
              'w-9 h-9 rounded-full flex items-center justify-center overflow-hidden shadow-sm',
              $auth.user && $auth.user.type === 1 ? 'bg-blue-100' : ($auth.user && $auth.user.gender === 2 ? 'bg-pink-100' : 'bg-blue-100')
            ]"
          >
            <!-- Yuridik shaxs -->
            <svg v-if="$auth.user && $auth.user.type === 1" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
            <!-- Ayol -->
            <svg v-else-if="$auth.user && $auth.user.gender === 2" class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <!-- Erkak -->
            <svg v-else class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-sm font-semibold text-white max-w-28 truncate">{{ userName }}</span>
          </div>
        </nuxt-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ZHeader',

  data() {
    return {
      langDropdownOpen: false,
      dds: { amount: 0, not: 0 },
      avatarError: false,
      _subscribed: false,
      _unsubscribe: null,
      _unsubscribeConnect: null,
      _unsubscribeReconnect: null,
    };
  },

  computed: {
    formattedBalance() {
      return this.$formatNumber(this.dds.amount) + ' UZS';
    },

    userName() {
      const user = this.$auth.user;
      if (!user) return '';
      if (user.type === 1) return user.company || '';
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    },

    userAvatar() {
      const img = this.$auth.user?.image;
      if (!img) return null;
      // Agar to'liq URL bo'lsa (http yoki https), qaytarish
      if (img.startsWith('http')) return img;
      // Relative path bo'lsa, backend URL bilan birlashtirish
      const base = this.$config?.backendURL || '';
      return `${base}/${img}`;
    },

    showBackButton() {
      const indexRoutes = ['index___uz', 'index___ru', 'index___kr'];
      return !indexRoutes.includes(this.$route.name);
    },

    currentLangLabel() {
      const locale = this.$i18n.locale;
      if (locale === 'uz') return 'UZ';
      if (locale === 'ru') return 'RU';
      if (locale === 'kr') return 'УЗ';
      return 'UZ';
    },

    currentLangFlag() {
      const locale = this.$i18n.locale;
      if (locale === 'ru') return require('@/assets/img/lang/ru.png');
      return require('@/assets/img/lang/uz.png');
    },

    availableLanguages() {
      return [
        { code: 'uz', label: 'O\'zbekcha', flag: require('@/assets/img/lang/uz.png') },
        { code: 'ru', label: 'Русский', flag: require('@/assets/img/lang/ru.png') },
        { code: 'kr', label: 'Ўзбекча', flag: require('@/assets/img/lang/uz.png') },
      ];
    },
  },

  mounted() {
    // Listen for balance updates from other components
    this._onHeaderBalance = (data) => {
      if (data?.balance !== undefined) this.dds.amount = Number(data.balance) || 0;
      if (data?.notifications) this.dds.not = Array.isArray(data.notifications) ? data.notifications.length : 0;
    };
    this.$root.$on('update-header-balance', this._onHeaderBalance);

    if (this.$auth.loggedIn) {
      // Load cached data first (tez render uchun)
      const b = localStorage.getItem('user_balance');
      if (b) {
        this.dds.amount = Number(b) || 0;
      } else if (this.$auth.user?.balance !== undefined) {
        // Cache bo'sh bo'lsa, $auth.user dan olish (login paytida /user/me dan keladi)
        this.dds.amount = Number(this.$auth.user.balance) || 0;
      }
      const n = localStorage.getItem('user_notifications');
      if (n) try { this.dds.not = JSON.parse(n).length || 0; } catch (_) {}

      // Socket orqali real-time ma'lumot olish
      this.initSocket();

      // API fallback: bildirishnomalar sonini darhol olish
      this._fetchHeaderData();

      // Periodic polling: har 30 sekundda yangi bildirishnomalarni tekshirish
      this.pollingInterval = setInterval(() => {
        if (this.$auth?.loggedIn) this._fetchHeaderData();
      }, 30000);

      // Visibility change: tab ko'rinsa darhol yangilash
      this._onVisibility = () => {
        if (!document.hidden && this.$auth?.loggedIn) this._fetchHeaderData();
      };
      document.addEventListener('visibilitychange', this._onVisibility);
    }

    document.addEventListener('click', this.closeLangDropdown);
  },

  beforeDestroy() {
    this.cleanupSocket();
    this.$root.$off('update-header-balance', this._onHeaderBalance);
    document.removeEventListener('click', this.closeLangDropdown);
    if (this.pollingInterval) { clearInterval(this.pollingInterval); this.pollingInterval = null; }
    if (this._onVisibility) { document.removeEventListener('visibilitychange', this._onVisibility); }
  },

  watch: {
    '$auth.loggedIn'(v) {
      if (v) {
        this.$nextTick(() => this.initSocket());
      } else {
        this.cleanupSocket();
        this.dds.amount = 0;
        this.dds.not = 0;
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
      }
    },

    '$auth.user.id'(n, o) {
      if (n && n !== o) {
        this.$nextTick(() => this.initSocket());
      }
    },
  },

  methods: {
    barClick() {
      this.$store.commit('Media_Menu_Open', { isOpen: true });
    },

    toggleLangDropdown() {
      this.langDropdownOpen = !this.langDropdownOpen;
    },

    closeLangDropdown() {
      this.langDropdownOpen = false;
    },

    changeLanguage(lang) {
      this.$i18n?.setLocaleCookie?.(lang);
      localStorage.setItem('app-language', lang);
      if (typeof this.$i18n?.setLocale === 'function') this.$i18n.setLocale(lang);
      else this.$i18n.locale = lang;
      this.langDropdownOpen = false;
    },

    initSocket() {
      this.cleanupSocket();

      const userId = this.$auth?.user?.id;
      if (!userId) return;

      this._subscribeToSocket();
    },

    _subscribeToSocket() {
      if (this._subscribed) return;

      if (!this.$socketManager?.isInitialized) {
        this._retryTimer = setTimeout(() => this._subscribeToSocket(), 100);
        return;
      }

      this._subscribed = true;

      this._unsubscribe = this.$socketManager.subscribe('recive_notification', this.onNotification);

      this._unsubscribeConnect = this.$socketManager.subscribe('connect', () => this._triggerIdentify());

      this._unsubscribeReconnect = this.$socketManager.subscribe('reconnect', () => this._triggerIdentify());

      if (this.$socketManager.connected) {
        this._triggerIdentify();
      }
    },

    _triggerIdentify() {
      const userId = this.$auth?.user?.id;
      if (!userId) return;

      if (this.$socketManager?.connected) {
        this.$socketManager.emit('register', { id: userId });

        this._identifyTimer = setTimeout(() => {
          if (this.$socketManager?.connected) {
            this.$socketManager.requestNotifications(userId);
          }
        }, 500);
      }
    },

    cleanupSocket() {
      if (this._unsubscribe) {
        this._unsubscribe();
        this._unsubscribe = null;
      }
      if (this._unsubscribeConnect) {
        this._unsubscribeConnect();
        this._unsubscribeConnect = null;
      }
      if (this._unsubscribeReconnect) {
        this._unsubscribeReconnect();
        this._unsubscribeReconnect = null;
      }
      if (this._retryTimer) {
        clearTimeout(this._retryTimer);
        this._retryTimer = null;
      }
      if (this._identifyTimer) {
        clearTimeout(this._identifyTimer);
        this._identifyTimer = null;
      }
      this._subscribed = false;
    },

    onNotification(payload) {
      const list = Array.isArray(payload)
        ? payload
        : (payload?.notification ?? payload?.notifications ?? payload?.data ?? []);

      const amount = payload?.amount?.balance ?? payload?.balance ?? this.dds.amount;

      this.dds.amount = Number(amount) || 0;
      this.dds.not = Array.isArray(list) ? list.length : 0;

      // Cache for next page load
      localStorage.setItem('user_balance', String(this.dds.amount));
      localStorage.setItem('user_notifications', JSON.stringify(Array.isArray(list) ? list : []));

      // Emit to other components (NavbarLogged, etc.)
      this.$root.$emit('update-header-balance', {
        balance: this.dds.amount,
        notifications: list,
      });
    },

    async _fetchHeaderData() {
      try {
        const response = await this.$axios.$get('/notification/me?page=1&limit=50', { falseLoading: true, silent: true });
        if (response?.data) {
          const list = Array.isArray(response.data) ? response.data : [];
          this.dds.not = list.length;
          localStorage.setItem('user_notifications', JSON.stringify(list));

          // Balance ham payload ichida bo'lsa
          const balance = response?.amount?.balance ?? response?.balance;
          if (balance !== undefined) {
            this.dds.amount = Number(balance) || 0;
            localStorage.setItem('user_balance', String(this.dds.amount));
          }

          this.$root.$emit('update-header-balance', {
            balance: this.dds.amount,
            notifications: list,
          });
        }
      } catch (_) {
        // Silent fail - socket orqali keladi
      }
    },

    handleImageError() {
      this.avatarError = true;
    },
  },
};
</script>

<style>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Header main styles */
.header-main {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(to right, #2563eb, #1e40af);
  padding: 12px 16px;
}

@media (min-width: 1024px) {
  .header-main {
    padding: 16px 24px;
  }
}
</style>
