<template>
  <aside
    class="fixed lg:fixed inset-y-0 left-0 flex-shrink-0 transform transition-transform duration-300 ease-in-out z-50"
    style="width: 350px;"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Mobile overlay -->
    <div
      v-if="isMobile && isOpen"
      class="fixed inset-0 lg:hidden bg-black bg-opacity-50 backdrop-blur-sm z-40"
      @click="closeSidebar"
    />

    <!-- Sidebar content -->
    <div class="relative h-full bg-white flex flex-col shadow-lg z-50">
      <!-- Header with logo -->
      <div class="flex items-center justify-center px-4 py-5">
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="flex items-center justify-center"
          @click.native="closeSidebar"
        >
          <img
            v-if="$i18n.locale == 'ru'"
            src="@/assets/img/logo_ru.svg"
            alt="ZeroX"
            class="h-24 w-auto"
          />
          <img
            v-else-if="$i18n.locale == 'kr'"
            src="@/assets/img/logo_kr.svg"
            alt="ZeroX"
            class="h-24 w-auto"
          />
          <img
            v-else
            src="@/assets/img/logo.svg"
            alt="ZeroX"
            class="h-24 w-auto"
          />
        </nuxt-link>

        <!-- Mobile close button -->
        <button
          v-if="isMobile"
          type="button"
          class="absolute top-4 right-3 lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          @click="closeSidebar"
          aria-label="Close menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Balance card (mobile only) -->
      <nuxt-link
        v-if="$auth.loggedIn"
        :to="localePath({ name: 'mobil-hisob' })"
        class="flex md:hidden items-center justify-between mx-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        @click.native="closeSidebar"
      >
        <div class="flex flex-col">
          <span class="text-xs uppercase tracking-wide font-semibold text-blue-100">{{ $t('navbar.mobile') }}</span>
          <span class="text-base font-semibold mt-0.5">{{ formattedBalance }} UZS</span>
        </div>
        <div class="w-9 h-9 rounded-full flex items-center justify-center bg-white bg-opacity-20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </nuxt-link>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <!-- Home -->
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:bg-gray-50"
          @click.native="closeSidebar"
        >
          <span class="nav-icon w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
          <span class="text-sm">{{ $t("menu.home") }}</span>
        </nuxt-link>

        <!-- QR Code -->
        <nuxt-link
          :to="localePath({ name: 'qr-code' })"
          class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:bg-gray-50"
          @click.native="closeSidebar"
        >
          <span class="nav-icon w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </span>
          <span class="text-sm">{{ $t("menu.qr") }}</span>
        </nuxt-link>

        <!-- Instructions -->
        <nuxt-link
          :to="localePath({ name: 'instruction' })"
          class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:bg-gray-50"
          @click.native="closeSidebar"
        >
          <span class="nav-icon w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span class="text-sm">{{ $t("menu.foy") }}</span>
        </nuxt-link>

        <!-- Telegram Support -->
        <a
          href="https://t.me/zeroxuz_bot"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:bg-gray-50"
          @click="closeSidebar"
        >
          <span class="nav-icon w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.33.015.097.034.318.019.49z" />
            </svg>
          </span>
          <span class="text-sm">{{ $t("home.chatt") }}</span>
          <svg class="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        <!-- Pricing -->
        <nuxt-link
          :to="localePath({ name: 'price' })"
          class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:bg-gray-50"
          @click.native="closeSidebar"
        >
          <span class="nav-icon w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          <span class="text-sm">{{ $t("menu.tarif") }}</span>
        </nuxt-link>
      </nav>

      <!-- App download section (when not logged in) -->
      <div v-if="!$auth.loggedIn" class="p-4 mt-auto">
        <p class="text-sm text-gray-500 text-center mb-3">{{ $t('qr.scan_text') }}</p>
        <div class="flex flex-col gap-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.zeroxuz"
            target="_blank"
            rel="noopener noreferrer"
            class="block"
          >
            <img src="@/assets/img/googlePlayBtn.svg" alt="Google Play" class="w-full h-auto object-contain" style="max-height: 48px" />
          </a>
          <a
            href="https://apps.apple.com/uz/app/zerox/id6446497826"
            target="_blank"
            rel="noopener noreferrer"
            class="block"
          >
            <img src="@/assets/img/appstoreBtn.svg" alt="App Store" class="w-full h-auto object-contain" style="max-height: 48px" />
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'NavbarLogged',
  data() {
    return {
      balance: 0,
      isMobile: false,
    };
  },
  computed: {
    isOpen() {
      return this.$store.state.isMobileMenuOpen;
    },
    formattedBalance() {
      return this.formatBalance(this.balance);
    },
  },
  mounted() {
    if (process.client) {
      this.checkMobile();
      window.addEventListener('resize', this.checkMobile);
      this.restoreBalance();
      this.$root?.$on?.('update-header-balance', this.handleBalanceUpdate);
    }
  },
  beforeDestroy() {
    if (process.client) {
      window.removeEventListener('resize', this.checkMobile);
      this.$root?.$off?.('update-header-balance', this.handleBalanceUpdate);
    }
  },
  watch: {
    '$auth.loggedIn'(value) {
      if (!value) {
        this.balance = 0;
      } else if (process.client) {
        this.restoreBalance();
      }
    },
  },
  methods: {
    closeSidebar() {
      this.$store.commit('Media_Menu_Close', false);
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 1024;
    },
    restoreBalance() {
      if (!process.client) return;
      const stored = window.localStorage.getItem('user_balance');
      this.balance = stored ? Number(stored) || 0 : 0;
    },
    handleBalanceUpdate(payload) {
      if (!payload) return;

      let amount = null;
      if (payload.balance !== undefined) {
        amount = payload.balance;
      } else if (payload.amount?.balance !== undefined) {
        amount = payload.amount.balance;
      } else if (typeof payload.amount === 'number') {
        amount = payload.amount;
      } else if (typeof payload === 'number') {
        amount = payload;
      }

      if (amount !== null && amount !== undefined) {
        this.balance = Number(amount) || 0;
        if (process.client) {
          window.localStorage.setItem('user_balance', String(this.balance));
        }
      }
    },
    formatBalance(value) {
      const number = Number(value) || 0;
      return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
  },
};
</script>

<style scoped>
.nav-item.nuxt-link-exact-active {
  @apply bg-blue-50 text-blue-700;
}

.nav-item.nuxt-link-exact-active .nav-icon {
  @apply bg-blue-600 text-white;
}
</style>
