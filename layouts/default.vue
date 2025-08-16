<template>
  <div class="layout mb-6">
    <div @click="isModalActive" :class="{ active: isModalInfo }" class="ModalArea"></div>
    <LoadingBar />

    <Bg-blue :key="bgKey" />
    <!-- <Esp-modal v-if="EspModal" @getEspData="getEspData" @closeEspModal="closeEspModal" :espData="keys" /> -->
    <act-modal />

    <div class="my-bg">

      <div class="lg:container lg:px-0 px-2 relative mx-auto my-30 bg-[#F7FAFC]">
        <!-- ⏰ KOMP–SERVER SANA MOS EMAS BANNERI -->
        <div v-if="clockMismatch" class="fixed top-0 left-0 right-0 z-[9999] mb-4">
          <div
            class="bg-red-600 text-white py-2 px-4 text-sm md:text-base flex items-center justify-between overflow-hidden">

            <!-- Harakatlanadigan matn -->
            <div class="relative w-full overflow-hidden">
              <p class="animate-marquee whitespace-nowrap">
                {{ $t('a1.a103') }}
              </p>
            </div>

            <!-- Yopish tugmasi -->
            <button @click="clockMismatch = false" class="ml-4 underline shrink-0">X</button>
          </div>
        </div>

        <div class="media-p">
          <!-- <NotificationModal :item="message" @reject="reject" @affirm="affirm"/> -->

          <div class="pt-10 navbar-mobil">
            <div :class="isOpen ? ' fixed open-nav' : 'fixed'" class="!block !md:flex">
              <NavbarLogged v-if="$auth.loggedIn" />
              <Navbar v-else @showModal="showLoginModal" />
              <br />
              <div v-if="!$auth.loggedIn" class="flex justify-center rounded-xl bg-white p-5 h-full mb-2">
                <div class="w-10/12 max-w-md">
                  <!-- ANDROID -->
                  <div class="flex items-center">
                    <Vqr :text="qrUrlAndroid" :logo="logo" qrcodeColor="#2D62B6" backgroundColor="#ffffffff" :size="140"
                      :logoSize="24" :margin="10" :ratio="1" level="M" class="shrink-0" />
                    <a href="https://play.google.com/store/apps/details?id=com.zeroxuz" target="_blank"
                      aria-label="Google Play’dan yuklab oling" class="inline-block">
                      <img src="@/assets/img/googlePlayBtn.svg" alt="" class="h-12 w-auto" style="margin-top:-25px;" />
                    </a>
                  </div>

                  <!-- iOS -->
                  <div class="flex items-center">
                    <Vqr :text="qrUrlIOS" :logo="logo" qrcodeColor="#2D62B6" backgroundColor="#ffffffff" :size="140"
                      :logoSize="24" :margin="10" :ratio="1" level="M" class="shrink-0" />
                    <a href="https://apps.apple.com/uz/app/zerox/id6446497826" target="_blank"
                      aria-label="App Store’dan yuklab oling" class="inline-block">
                      <img src="@/assets/img/appstoreBtn.svg" alt="" class="h-12 w-auto" style="margin-top:-25px;" />
                    </a>
                  </div>
                </div>
              </div>
              <!--  <NewsComponentNew /> -->
            </div>
          </div>

          <div class="absolute myclass left-105">
            <Header class="mb-10" :notification="message" :key="$store.state.renderIndex" />

            <!-- 🔥 Index hech qachon cache bo‘lmasin; qolgan sahifalar keep-alive -->
            <Nuxt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  startApi,
  getAllCertificates,
  preLoadKey,
  postLoadKey,
} from "@/services/eimzo/index";
import Notification from "../components/Notification.vue";
import NotificationModal from "../components/NotificationModal.vue";
import ActModal from "../components/ActModal.vue";
import Vqr from "v-qr";
import dateformat from "dateformat";
import NewsComponentNew from "../components/NewsComponentNew.vue";

export default {
  components: { Notification, NotificationModal, ActModal, Vqr, NewsComponentNew },

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
      qrUrlIOS: "",
      qrUrlAndroid: "",
      logo: "",
      // ichki
      _nuxtForceHandler: null,
      clockMismatch: false,
      serverDateStr: "",
      clientDateStr: "",
      chartKey: 0,
    };
  },

  created() {
    this.qrUrlAndroid = `https://play.google.com/store/apps/details?id=com.zeroxuz`;
    this.qrUrlIOS = `https://apps.apple.com/uz/app/zerox/id6446497826`;
    this.logo =
      "data:image/png;base64,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"; // qisqartirildi

    // forceUpdateParent eventini faqat login bo'lganda tinglaymiz
    this._nuxtForceHandler = () => this.getNotificationsSafe();
    if (this.$auth.loggedIn) {
      this.$nuxt.$on("forceUpdateParent", this._nuxtForceHandler);
    }
  },

  async mounted() {
    await this.checkDateDrift(); // axios varianti
    if (this.$auth.loggedIn) {
      await this.getNotificationsSafe();
    }
  },

  beforeDestroy() {
    // event listenerni tozalash
    if (this._nuxtForceHandler) {
      try { this.$nuxt.$off("forceUpdateParent", this._nuxtForceHandler); } catch (_) { }
      this._nuxtForceHandler = null;
    }
  },

  watch: {
    // Login/Logout holati o'zgarsa
    "$auth.loggedIn"(v) {
      if (this._nuxtForceHandler) {
        try { this.$nuxt.$off("forceUpdateParent", this._nuxtForceHandler); } catch (_) { }
      }
      if (v) {
        this.$nuxt.$on("forceUpdateParent", this._nuxtForceHandler);
        this.getNotificationsSafe();
      } else {
        this.message = []; // logout bo'lsa ro'yxatni tozalaymiz
      }
    },
  },
  computed: {
    isIndex() {
      const n = this.$route.name || '';
      return n === 'index' || n.startsWith('index___') || this.$route.path === '/';
    },
    isOpen() { return this.$store.state.isOpen },
    isModalInfo() { return this.$store.getters.isModalInfo },

    // KeepAlive exclude ro'yxati: index va barcha lokalizatsiyalangan versiyalari
    keepAliveExclude() {
      // ['index', /^index(___.*)?$/] ham bo'ladi, lekin regex barchasini qoplaydi
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
      const datePart = str.split(',')[0].trim(); // "17/08/2025"
      const [dd, mm, yyyy] = datePart.split('/').map(v => parseInt(v, 10));
      if (!dd || !mm || !yyyy) return null;
      return { str: `${this.pad2(dd)}/${this.pad2(mm)}/${yyyy}` };
    },

    async checkDateDrift() {
      try {
        if (process.server) return;

        // 1) Birinchi urinish: relative (nuxt-axios baseURL orqali)
        let body = null;
        try {
          body = await this.$axios.$get('https://app.zerox.uz/api/v1/dashboard/get-time');
        } catch (_) {
          body = null;
        }

        // 2) Agar yuqorisi bo'lmasa yoki ichida data yo'lsa — absolut URL
        if (!body || (!body.data && typeof body !== 'string')) {
          const resp = await this.$axios.$get('https://app.zerox.uz/api/v1/dashboard/get-time');
          body = resp && resp.data ? resp.data : null; // {success, data}
          console.log('serverTime:', resp)
        }


        // 3) Raw matnni normalizatsiya qilish
        //   - $get string qaytarishi mumkin -> "17/08/2025, 14:09:14"
        //   - yoki {success:true, data:"17/08/2025, 14:09:14"}
        const raw = typeof body === 'string' ? body : (body && body.data);
        if (!raw) return;

        const serverStr = this.parseServerDateDDMMYYYY(raw);
        if (!serverStr) return;

        const clientStr = this.formatDDMMYYYY(new Date());

        // Debug (bir martalik tekshiruv uchun foydali):
        // console.log('[date-check] client:', clientStr, 'server:', serverStr.str);

        this.serverDateStr = serverStr.str;
        this.clientDateStr = clientStr;
        this.clockMismatch = (clientStr.trim() !== serverStr.str.trim());
        console.log('[date-check] client:', clientStr, 'server:', serverStr.str);
      } catch (e) {
        console.error('checkDateDrift axios error:', e);
      }
    },
    // Navbar @showModal uchun no-op (ogohlantirishni yo'qotadi)
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

    async getMyInfo() {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data) this.userData = data;
      } catch (e) {
        console.error(e);
      }
    },

    // 🔐 Faqat loggedIn bo'lsa chaqiriladi, 401 bo'lsa jim o'tadi
    async getNotificationsSafe() {
      if (!this.$auth.loggedIn) return;
      try {
        const res = await this.$axios.get("/notification/me");
        if (res?.status === 200) {
          this.message = res?.data?.data || [];
        }
      } catch (e) {
        if (e?.response?.status !== 401) {
          console.error(e);
        } else {
          this.message = [];
        }
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
        console.error(e);
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
        console.error(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  display: inline-block;
  animation: marquee 12s linear infinite;
}

.qr-container {
  @apply w-full max-w-xs mx-auto;
}

.qr-image {
  @apply w-full h-auto object-contain;
}

::-webkit-scrollbar {
  height: 12px;
  width: 12px;
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: #393812;
  -webkit-border-radius: 1ex;
  -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, .75);
}

::-webkit-scrollbar-corner {
  background: #000;
}

@media (max-width: 1024px) {
  .overlay {
    position: fixed;
    overflow-y: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 9;
  }

  .layout {
    .media-p {
      padding: 0 !important;
    }

    .navbar-mobil {
      .fixed {
        position: fixed;
        overflow: hidden;
        top: 0;
        transform: translateX(-500px);
        left: 0;
        min-height: 100vh;
        background: white;
        padding: 0 !important;
        border-radius: 0 !important;
        z-index: 10;
        transition: .5s;
        width: 42%;
      }

      .open-nav {
        transform: translateX(0) !important;
        transition: .5s;
      }
    }

    .myclass {
      width: unset;
      position: unset;
      left: 0px;
    }
  }
}

@media (max-width: 768px) {
  .x-box {
    background-color: #3182CE;
    color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .overlay {
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 9;
  }

  .layout {
    .media-p {
      padding: 0 !important;
    }

    .navbar-mobil {
      .fixed {
        position: fixed;
        display: block;
        justify-content: center;
        top: 0;
        transform: translateX(-800px);
        left: 0;
        background: white;
        overflow: hidden;
        min-height: 100vh;
        padding: 0 !important;
        border-radius: 0 !important;
        z-index: 10;
        transition: .5s;
        width: 100%;
      }

      .open-nav {
        transform: translateX(0px) !important;
        transition: .5s;
      }
    }

    .myclass {
      width: unset;
      position: unset;
      left: 0px;
    }
  }
}

.my-bg {
  background: #f7fafc;
}

.myclass {
  width: calc(100% - 400px);
  left: 390px;
}

.ModalArea {
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  z-index: 111;
  width: 100%;
  height: 100vh;
  position: absolute;
  transition-duration: .3s;
  background: rgba(0, 0, 0, .15);
}

.ModalArea.active {
  opacity: 1;
  visibility: visible;
}
</style>
