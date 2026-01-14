<template>
  <aside
    class="sidebar-aside"
    :class="{ 'sidebar-open': isOpen }"
  >
    <!-- Mobile overlay -->
    <div
      v-if="isMobile && isOpen"
      class="sidebar-overlay"
      @click="closeSidebar"
    />

    <!-- Sidebar content -->
    <div class="sidebar-content">
      <!-- Header with logo -->
      <div class="sidebar-header">
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="logo-link"
          @click.native="closeSidebar"
        >
          <img
            v-if="$i18n.locale == 'ru'"
            src="@/assets/img/logo_ru.svg"
            alt="ZeroX"
            class="logo-img"
          />
          <img
            v-else-if="$i18n.locale == 'kr'"
            src="@/assets/img/logo_kr.svg"
            alt="ZeroX"
            class="logo-img"
          />
          <img
            v-else
            src="@/assets/img/logo.svg"
            alt="ZeroX"
            class="logo-img"
          />
        </nuxt-link>

        <!-- Mobile close button -->
        <button
          v-if="isMobile"
          type="button"
          class="close-btn"
          @click="closeSidebar"
          aria-label="Close menu"
        >
          <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Balance card (mobile only) -->
      <nuxt-link
        v-if="$auth.loggedIn && isMobile"
        :to="localePath({ name: 'mobil-hisob' })"
        class="balance-card"
        @click.native="closeSidebar"
      >
        <div class="balance-info">
          <span class="balance-label">{{ $t('navbar.mobile') }}</span>
          <span class="balance-amount">{{ formattedBalance }} UZS</span>
        </div>
        <div class="balance-icon">
          <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </nuxt-link>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <!-- Home -->
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="nav-item"
          @click.native="closeSidebar"
        >
          <span class="nav-icon nav-icon-blue">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
          <span class="nav-text">{{ $t("menu.home") }}</span>
        </nuxt-link>

        <!-- QR Code -->
        <nuxt-link
          :to="localePath({ name: 'qr-code' })"
          class="nav-item"
          @click.native="closeSidebar"
        >
          <span class="nav-icon nav-icon-green">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </span>
          <span class="nav-text">{{ $t("menu.qr") }}</span>
        </nuxt-link>

        <!-- Instructions -->
        <nuxt-link
          :to="localePath({ name: 'instruction' })"
          class="nav-item"
          @click.native="closeSidebar"
        >
          <span class="nav-icon nav-icon-purple">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span class="nav-text">{{ $t("menu.foy") }}</span>
        </nuxt-link>

        <!-- Telegram Support -->
        <a
          href="https://t.me/zeroxuz_bot"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-item"
          @click="closeSidebar"
        >
          <span class="nav-icon nav-icon-sky">
            <svg style="width: 16px; height: 16px;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.33.015.097.034.318.019.49z" />
            </svg>
          </span>
          <span class="nav-text">{{ $t("home.chatt") }}</span>
          <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        <!-- Pricing -->
        <nuxt-link
          :to="localePath({ name: 'price' })"
          class="nav-item"
          @click.native="closeSidebar"
        >
          <span class="nav-icon nav-icon-amber">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          <span class="nav-text">{{ $t("menu.tarif") }}</span>
        </nuxt-link>
      </nav>

      <!-- App download section (when not logged in) -->
      <div v-if="!$auth.loggedIn" class="app-download">
        <p class="download-text">{{ $t('qr.scan_text') }}</p>
        <div class="download-buttons">
          <a
            href="https://play.google.com/store/apps/details?id=com.zeroxuz"
            target="_blank"
            rel="noopener noreferrer"
            class="download-link"
          >
            <img src="@/assets/img/googlePlayBtn.svg" alt="Google Play" class="download-img" />
          </a>
          <a
            href="https://apps.apple.com/uz/app/zerox/id6446497826"
            target="_blank"
            rel="noopener noreferrer"
            class="download-link"
          >
            <img src="@/assets/img/appstoreBtn.svg" alt="App Store" class="download-img" />
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

<style>
/* ============================================
   NavbarLogged Component Styles
   ============================================ */

/* ============================================
   Sidebar Container
   ============================================ */
.sidebar-aside {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 320px;
  z-index: 60;
  flex-shrink: 0;
}

/* Desktop: Sidebar har doim ko'rinadi */
@media (min-width: 1024px) {
  .sidebar-aside {
    transform: translateX(0);
  }
}

/* Mobile: Sidebar yashirin va animatsiya bilan ochiladi */
@media (max-width: 1023px) {
  .sidebar-aside {
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .sidebar-aside.sidebar-open {
    transform: translateX(0);
  }
}

/* ============================================
   Sidebar Content
   ============================================ */
.sidebar-content {
  position: relative;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  overflow-y: auto;
}

/* ============================================
   Mobile Overlay
   ============================================ */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 40;
}

@media (min-width: 1024px) {
  .sidebar-overlay {
    display: none;
  }
}

/* ============================================
   Header with Logo
   ============================================ */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  position: relative;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  height: 96px;
  width: auto;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 12px;
  padding: 8px;
  border-radius: 8px;
  color: #9CA3AF;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #F3F4F6;
  color: #4B5563;
}

/* ============================================
   Balance Card (Mobile)
   ============================================ */
.balance-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px 16px;
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(to right, #2563EB, #1D4ED8);
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.balance-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .balance-card {
    display: none;
  }
}

.balance-info {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  color: #BFDBFE;
}

.balance-amount {
  font-size: 16px;
  font-weight: 600;
  margin-top: 2px;
}

.balance-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
}

/* ============================================
   Navigation
   ============================================ */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  color: #4B5563;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #F9FAFB;
}

.nav-item.nuxt-link-exact-active {
  background-color: #EBF8FF;
  color: #2B6CB0;
}

.nav-item.nuxt-link-exact-active .nav-icon {
  background-color: #3182CE !important;
  color: #ffffff !important;
}

.nav-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon-blue {
  background-color: #EBF8FF;
  color: #3182CE;
}

.nav-icon-green {
  background-color: #F0FFF4;
  color: #38A169;
}

.nav-icon-purple {
  background-color: #FAF5FF;
  color: #805AD5;
}

.nav-icon-sky {
  background-color: #E0F2FE;
  color: #0EA5E9;
}

.nav-icon-amber {
  background-color: #FFFBEB;
  color: #D97706;
}

.nav-text {
  font-size: 14px;
}

.external-icon {
  width: 14px;
  height: 14px;
  color: #9CA3AF;
  margin-left: auto;
  flex-shrink: 0;
}

/* ============================================
   App Download Section
   ============================================ */
.app-download {
  padding: 16px;
  margin-top: auto;
}

.download-text {
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  margin-bottom: 12px;
}

.download-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.download-link {
  display: block;
}

.download-img {
  width: 100%;
  height: auto;
  max-height: 48px;
  object-fit: contain;
}
</style>
