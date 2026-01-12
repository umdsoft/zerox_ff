<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Bar -->
    <LoadingBar />

    <!-- Modals -->
    <act-modal />

    <!-- Clock Mismatch Banner -->
    <transition name="slide-down">
      <div v-if="clockMismatch" class="fixed top-0 left-0 right-0 z-50">
        <div class="bg-red-600 text-white py-2 px-4 text-sm md:text-base flex items-center justify-between shadow-lg">
          <div class="relative w-full overflow-hidden">
            <p class="animate-marquee whitespace-nowrap">
              {{ $t('a1.a103') }}
            </p>
          </div>
          <button @click="clockMismatch = false" class="ml-4 underline shrink-0">X</button>
        </div>
      </div>
    </transition>

    <!-- Spacer for clock banner -->
    <div v-if="clockMismatch" class="h-10"></div>

    <!-- LOGGED IN USER: Dashboard Layout -->
    <div v-if="$auth.loggedIn" class="flex">
      <!-- Sidebar -->
      <NavbarLogged />

      <!-- Main Content Area -->
      <div class="flex-1 min-h-screen lg:ml-[350px] transition-[margin] duration-300">
        <!-- Header -->
        <Header :notification="message" :key="$store.state.renderIndex" />

        <!-- Page Content -->
        <main class="px-4 lg:px-6 py-6">
          <Nuxt />
        </main>
      </div>
    </div>

    <!-- NOT LOGGED IN: Landing Page -->
    <div v-else>
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
import dateformat from "dateformat";

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

    dateFormat(date) {
      return dateformat(date, "dd.mm.yyyy");
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

<style scoped>
/* Banner animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Marquee animation */
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.animate-marquee {
  animation: marquee 12s linear infinite;
  display: inline-block;
}

/* Modal overlay */
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
</style>
