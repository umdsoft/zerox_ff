<template>
  <div class="app-wrapper">
    <!-- Loading Bar -->
    <LoadingBar />

    <!-- Modals -->
    <act-modal />

    <!-- Clock Mismatch Banner -->
    <transition name="slide-down">
      <div v-if="clockMismatch" class="clock-banner">
        <div class="clock-banner__content">
          <p class="clock-banner__text">{{ $t('a1.a103') }}</p>
          <button @click="clockMismatch = false" class="clock-banner__close">X</button>
        </div>
      </div>
    </transition>

    <!-- ============================================ -->
    <!-- LOGGED IN: Dashboard Layout                 -->
    <!-- ============================================ -->
    <div v-if="$auth.loggedIn" class="dashboard-layout">
      <!-- Sidebar (NavbarLogged handles its own positioning) -->
      <NavbarLogged />

      <!-- Main Area (Header + Content) -->
      <div class="main-area">
        <!-- Header -->
        <header class="main-header">
          <Header :notification="message" :key="$store.state.renderIndex" />
        </header>

        <!-- Page Content -->
        <main class="main-content">
          <Nuxt />
        </main>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- NOT LOGGED IN: Landing Page                 -->
    <!-- ============================================ -->
    <div v-else class="landing-wrapper">
      <Nuxt />
    </div>

    <!-- Modal Overlay -->
    <div
      @click="isModalActive"
      :class="{ active: isModalInfo }"
      class="modal-overlay"
    />
  </div>
</template>

<script>
// Lazy loaded components
const Notification = () => import("../components/Notification.vue");
const ActModal = () => import("../components/ActModal.vue");

export default {
  components: {
    Notification,
    ActModal,
  },

  data() {
    return {
      EspModal: false,
      keys: null,
      result: null,
      selectedKey: null,
      timeOut: null,
      message: [],
      messageAct: [],
      bgKey: 0,
      userData: null,
      _nuxtForceHandler: null,
      clockMismatch: false,
      serverDateStr: "",
      clientDateStr: "",
      chartKey: 0,
    };
  },

  created() {
    this._nuxtForceHandler = () => this.getNotificationsSafe();
    if (this.$auth.loggedIn) {
      this.$nuxt.$on("forceUpdateParent", this._nuxtForceHandler);
    }
  },

  async mounted() {
    await this.checkDateDrift();
    if (this.$auth.loggedIn) {
      await this.getNotificationsSafe();
    }
  },

  beforeDestroy() {
    if (this._nuxtForceHandler) {
      try { this.$nuxt.$off("forceUpdateParent", this._nuxtForceHandler); } catch (_) { }
      this._nuxtForceHandler = null;
    }
  },

  watch: {
    "$auth.loggedIn"(v) {
      if (this._nuxtForceHandler) {
        try { this.$nuxt.$off("forceUpdateParent", this._nuxtForceHandler); } catch (_) { }
      }
      if (v) {
        this.$nuxt.$on("forceUpdateParent", this._nuxtForceHandler);
        this.getNotificationsSafe();
      } else {
        this.message = [];
      }
    },
  },

  computed: {
    isIndex() {
      const n = this.$route.name || '';
      return n === 'index' || n.startsWith('index___') || this.$route.path === '/';
    },
    isOpen() { return this.$store.state.isMobileMenuOpen },
    isModalInfo() { return this.$store.getters.isModalInfo },
    keepAliveExclude() {
      return [/^index($|___)/];
    }
  },

  methods: {
    pad2(n) { return String(n).padStart(2, '0'); },

    formatDDMMYYYY(d) {
      const dd = this.pad2(d.getDate());
      const mm = this.pad2(d.getMonth() + 1);
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    },

    parseServerDateDDMMYYYY(str) {
      if (!str) return null;
      const datePart = str.split(',')[0].trim();
      const [dd, mm, yyyy] = datePart.split('/').map(v => parseInt(v, 10));
      if (!dd || !mm || !yyyy) return null;
      return { str: `${this.pad2(dd)}/${this.pad2(mm)}/${yyyy}` };
    },

    async checkDateDrift() {
      try {
        if (process.server) return;

        let body = null;
        try {
          body = await this.$axios.$get('https://app.zerox.uz/api/v1/dashboard/get-time');
        } catch (_) {
          body = null;
        }

        if (!body || (!body.data && typeof body !== 'string')) {
          const resp = await this.$axios.$get('https://app.zerox.uz/api/v1/dashboard/get-time');
          body = resp && resp.data ? resp.data : null;
        }

        const raw = typeof body === 'string' ? body : (body && body.data);
        if (!raw) return;

        const serverStr = this.parseServerDateDDMMYYYY(raw);
        if (!serverStr) return;

        const clientStr = this.formatDDMMYYYY(new Date());

        this.serverDateStr = serverStr.str;
        this.clientDateStr = clientStr;
        this.clockMismatch = (clientStr.trim() !== serverStr.str.trim());
      } catch (e) {
        // Silent fail - date check is not critical
      }
    },

    showLoginModal() {
      // kerak bo'lsa keyin modal mantiqini qo'shasiz
    },

    isModalActive() {
      this.$store.dispatch("IsActiveModal");
    },

    closeMenu() {
      this.$store.commit("Media_Menu_Close", false);
    },

    /**
     * Foydalanuvchi ma'lumotlarini olish
     * Xavfsizlik uchun tashqi API (ipapi.co) o'rniga backend'dan olamiz
     */
    async getMyInfo() {
      // IP va geo ma'lumotlar backend tomonidan olinishi kerak
      // Bu funksiya endi ishlatilmaydi - backend /user/me endpointida qaytaradi
      this.userData = null;
    },

    async getNotificationsSafe() {
      if (!this.$auth.loggedIn) return;
      try {
        const res = await this.$axios.get("/notification/me");
        if (res?.status === 200) {
          this.message = res?.data?.data || [];
        }
      } catch (e) {
        if (e?.response?.status === 401) {
          this.message = [];
        }
        // Silent fail for other errors
      }
    },

    async reject(id) {
      try {
        const response = await this.$axios.put(`/notification/success/${id}`, { status: 2 });
        if (response.status === 200) {
          this.$toast.success("Shartnoma bekor qilindi");
          await this.getNotificationsSafe();
        }
      } catch (e) {
        this.$toast.error(this.$t('errors.operationFailed') || 'Operation failed');
      }
    },

    async affirm(id) {
      try {
        const response = await this.$axios.put(`/notification/success/${id}`, { status: 1 });
        if (response.status === 200) {
          this.$toast.success("Shartnoma tasdiqlandi");
          await this.getNotificationsSafe();
        }
      } catch (e) {
        this.$toast.error(this.$t('errors.operationFailed') || 'Operation failed');
      }
    },
  },
};
</script>

<style>
/* ============================================
   Dashboard Layout - Professional Structure
   ============================================ */

/* Root wrapper */
.app-wrapper {
  min-height: 100vh;
  background-color: #EDF2F7;
}

/* Dashboard layout container */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* Main area - Content beside sidebar */
.main-area {
  flex: 1;
  margin-left: 320px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: calc(100% - 320px);
}

/* Header wrapper - Header component handles sticky */
.main-header {
  flex-shrink: 0;
}

/* Main content - Scrollable area */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #EDF2F7;
}

/* Landing wrapper for non-logged users */
.landing-wrapper {
  min-height: 100vh;
}

/* ============================================
   Clock Banner
   ============================================ */
.clock-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: white;
  padding: 10px 20px;
}

.clock-banner__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1330px;
  margin: 0 auto;
}

.clock-banner__text {
  font-size: 14px;
  font-weight: 500;
}

.clock-banner__close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.clock-banner__close:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ============================================
   Banner Animation
   ============================================ */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* ============================================
   Modal Overlay
   ============================================ */
.modal-overlay {
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  z-index: 111;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transition-duration: 0.3s;
  background: rgba(0, 0, 0, 0.15);
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* ============================================
   Responsive - Mobile (< 1024px / lg breakpoint)
   ============================================ */
@media (max-width: 1023px) {
  .main-area {
    margin-left: 0;
    width: 100%;
  }

  .main-content {
    padding: 15px;
  }
}
</style>
