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
            <svg v-else-if="$auth.user && $auth.user.gender === 2" class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 141 155">
              <path d="M0 0 C1.277 -0.037 2.555 -0.075 3.871 -0.113 C8.168 0.382 10.269 1.555 13.563 4.313 C14.058 5.798 14.058 5.798 14.563 7.313 C15.284 7.416 16.006 7.519 16.75 7.625 C20.806 8.616 23.535 10.047 26.188 13.313 C30.948 23.7 31.007 34.045 31.09 45.281 C31.239 53.405 31.434 59.039 37.25 65.125 C38.013 65.847 38.776 66.569 39.563 67.313 C39.563 67.973 39.563 68.633 39.563 69.313 C38.903 69.313 38.243 69.313 37.563 69.313 C37.16 70.21 37.16 70.21 36.75 71.125 C33.033 77.971 25.517 80.52 18.48 82.797 C16.563 83.313 16.563 83.313 14.563 83.313 C14.563 84.633 14.563 85.953 14.563 87.313 C15.223 87.313 15.883 87.313 16.563 87.313 C16.563 87.973 16.563 88.633 16.563 89.313 C17.078 89.539 17.594 89.766 18.125 90 C20.281 91.161 22.284 92.384 24.313 93.75 C24.926 94.161 25.54 94.572 26.172 94.996 C26.631 95.431 27.09 95.865 27.563 96.313 C27.563 97.303 27.563 98.293 27.563 99.313 C28.369 99.547 29.176 99.782 30.008 100.023 C34.39 101.613 38.347 103.719 42.438 105.938 C43.221 106.358 44.005 106.778 44.813 107.211 C46.731 108.241 48.647 109.276 50.563 110.313 C49.137 114.59 45.963 116.188 42.375 118.625 C41.656 119.114 40.937 119.603 40.197 120.107 C26.716 129.039 13.249 132.719 -2.875 132.625 C-3.883 132.62 -4.89 132.615 -5.929 132.61 C-24.327 132.32 -40.899 124.674 -54.438 112.313 C-53.235 108.706 -52.547 108.534 -49.289 106.832 C-48.449 106.391 -47.608 105.949 -46.742 105.494 C-45.858 105.042 -44.974 104.591 -44.063 104.125 C-43.186 103.662 -42.309 103.198 -41.406 102.721 C-34.841 99.313 -34.841 99.313 -31.438 99.313 C-31.438 97.993 -31.438 96.673 -31.438 95.313 C-29.793 93.934 -29.793 93.934 -27.625 92.75 C-25.393 91.51 -23.603 90.479 -21.801 88.66 C-20.438 87.313 -20.438 87.313 -18.438 87.313 C-18.761 84.783 -18.761 84.783 -20.438 82.313 C-22.522 81.875 -24.61 81.45 -26.711 81.098 C-32.212 79.514 -37.127 76.021 -41.438 72.313 C-42.461 70.375 -42.461 70.375 -42.438 68.313 C-41.258 65.805 -41.258 65.805 -39.563 63.188 C-39.008 62.319 -38.454 61.45 -37.883 60.555 C-37.406 59.815 -36.929 59.075 -36.438 58.313 C-35.032 55.501 -35.292 53.119 -35.262 49.977 C-35.238 48.684 -35.214 47.391 -35.189 46.059 C-35.155 44.014 -35.125 41.97 -35.112 39.925 C-35.038 30.67 -33.959 22.904 -30.438 14.313 C-29.778 14.313 -29.118 14.313 -28.438 14.313 C-28.32 13.417 -28.32 13.417 -28.199 12.504 C-26.462 7.505 -19.587 4.954 -15.188 2.5 C-10.195 0.344 -5.408 0.103 0 0 Z" transform="translate(72.4375,18.6875)"/>
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
      if (data?.totalCount !== undefined) this.dds.not = data.totalCount;
      else if (data?.notifications) this.dds.not = Array.isArray(data.notifications) ? data.notifications.length : 0;
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
      // totalCount mavjud bo'lsa ishlatish (haqiqiy jami son), aks holda list.length
      this.dds.not = payload?.totalCount ?? (Array.isArray(list) ? list.length : 0);

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
        const response = await this.$axios.$get('/notification/me', { falseLoading: true, silent: true });
        if (response?.data) {
          const list = Array.isArray(response.data) ? response.data : [];
          // pagination.total mavjud bo'lsa haqiqiy jami sonni ishlatish
          this.dds.not = response?.pagination?.total ?? list.length;
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
