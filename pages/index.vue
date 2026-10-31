<template>
  <div>
    <!-- Landing Page for non-logged users -->
    <LandingPage v-if="!$auth.loggedIn" />

    <!-- Unified Analytics Dashboard (barcha login bo'lgan userlar uchun) -->
    <div v-else class="pb-8">
      <!-- Identifikatsiyadan o'tmagan foydalanuvchilar uchun banner (to'sqinlik emas) -->
      <div v-if="$auth.user && $auth.user.is_active !== 1" class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-5 flex flex-col md:flex-row md:items-center gap-3">
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900">{{ idenTexts.title }}</p>
          <p class="text-xs text-gray-600 mt-0.5">{{ idenTexts.shortMessage }}</p>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <a href="https://play.google.com/store/apps/details?id=com.zeroxuz" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors">
            <svg class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
            Google Play
          </a>
          <a href="https://apps.apple.com/uz/app/zerox/id6446497826" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors">
            <svg class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            App Store
          </a>
        </div>
      </div>

      <!-- Modals -->
      <IdenMessage v-if="idenNotification" @removeIdenModal="removeIdenModal" />
      <!-- 03.10: oferta oynasi endi layouts/default.vue da (yagona $oferta) — tasdiqlangach amal davom etadi -->
      <PassportExpiredMessage v-if="passportExpiredModal" @close="passportExpiredModal = false" />

    <IndexWelcomeHeader :texts="texts" :analytics="analytics" :health-status-text="healthStatusText" />
      <!-- Loading State — aylana ichida faqat ZeroX belgisi (3 tayoqcha), yozuvsiz -->
      <div v-if="loading" class="mt-8 flex justify-center">
        <div class="zx-loader">
          <span class="zx-loader-ring"></span>
          <img src="@/assets/img/logo-mark.svg" alt="ZeroX" class="zx-loader-mark" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="mt-8">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-sm text-red-700 font-medium mb-3">{{ texts.loadErrorMsg }}</p>
          <button class="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors" @click="loadAnalytics">
            {{ texts.retry }}
          </button>
        </div>
      </div>

      <template v-else>
    <IndexRatioOverview
      :overview-cards="overviewCards"
      :format-full="formatFull"
      :daftari-usd-rate="daftariUsdRate"
      :ratio-texts="ratioTexts"
      :format-short="formatShort"
    />
    <IndexModuleCards
      :texts="texts"
      :format-short="formatShort"
      :contract-debitor-uzs="contractDebitorUzs"
      :contract-debitor-usd="contractDebitorUsd"
      :contract-creditor-uzs="contractCreditorUzs"
      :contract-creditor-usd="contractCreditorUsd"
      :daftari-berilgan-uzs="daftariBerilganUzs"
      :daftari-berilgan-usd="daftariBerilganUsd"
      :daftari-olingan-uzs="daftariOlinganUzs"
      :daftari-olingan-usd="daftariOlinganUsd"
      :ratio-texts="ratioTexts"
      :personal-lent-uzs="personalLentUzs"
      :personal-lent-usd="personalLentUsd"
      :personal-borrowed-uzs="personalBorrowedUzs"
      :personal-borrowed-usd="personalBorrowedUsd"
      :debt-plan-line="debtPlanLine"
    />

      </template>
    </div>

    <!-- Footer — faqat shaxsiy kabinet bosh sahifasida (public sahifada
         LandingPage o'z footerini ko'rsatadi). Kontent maydoni padding'ini
         manfiy margin bilan qoplab, to'liq kenglikda chiqadi. -->
    <div v-if="$auth.loggedIn" class="zx-home-footer">
      <AppFooter />
    </div>
  </div>
</template>

<script>
import IndexWelcomeHeader from '~/components/home/IndexWelcomeHeader.vue';
import IndexRatioOverview from '~/components/home/IndexRatioOverview.vue';
import IndexModuleCards from '~/components/home/IndexModuleCards.vue';
import { getDashboard } from '@/api/qarzDaftari';
import { formatNumber } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
import { swrPeek, swrPut } from '@/utils/swrCache'; // SS-PERF (2026-10-01): qayta kirishda aylanasiz
import AppFooter from '@/components/AppFooter.vue'
import { getAnalytics } from '@/api/home';

// Nuxt auto-import: IdenMessage, ContractModal
const LandingPage = () => import(/* webpackChunkName: "landing-page", webpackPreload: true */ "@/components/LandingPage.vue");
// Nuxt auto-import: PassportExpiredMessage

import indexHomeViewMixin from '~/mixins/indexHomeViewMixin.js';
// SS-AUDIT (2026-09-25): ishlatilmagan komponent ro'yxati/importi olib tashlandi (IconGiveMoney)
export default {
  name: 'UnifiedDashboard',

  components: { IndexWelcomeHeader, IndexRatioOverview, IndexModuleCards,
    // IdenMessage, ContractModal, PassportExpiredMessage — Nuxt auto-import
    LandingPage,
    AppFooter,
  },
  mixins: [indexHomeViewMixin],
  auth: false,

  data() {
    return {
      idenNotification: false,
      passportExpiredModal: false,
      loading: true,
      loadError: false,
      mainDrill: null, // null | 'olingan' | 'berilgan'
      daftariUsdRate: 0, // "Umumiy ko'rinish" chartlari uchun (Task 6a)
      // Qarz shartnomasi (contracts) + Qarz daftari (qarz_daftari) data
      combinedStats: {
        berilgan: {
          shartnoma: { uzs: 0, usd: 0 },
          daftari: { uzs: 0, usd: 0 },
        },
        olingan: {
          shartnoma: { uzs: 0, usd: 0 },
          daftari: { uzs: 0, usd: 0 },
        },
      },
      analytics: {
        health: { score: 0, status: 'good' },
        contracts: { debitor: {}, creditor: {} },
        debts: {},
        finance: {},
        alerts: [],
      },
    };
  },


  watch: {
    isLoggedIn(v) {
      if (v) {this.loadAnalytics();}
    },
    userId() {
      if (this.isLoggedIn) {this.loadAnalytics();}
    },
  },

  mounted() {
    this.$nuxt.$emit("forceUpdateParent");
    // XODIM sessiyasi owner-only bosh sahifa analitikasiga (/home/analytics) kira
    // olmaydi (403). Uni to'g'ridan qarz-daftariga yo'naltiramiz — "Ma'lumotlarni
    // yuklashda xatolik" toast'ining oldini oladi (Bug 11).
    if (this.isLoggedIn && this.$auth && this.$auth.user && this.$auth.user.is_xodim) {
      this.$router.replace(this.localePath({ name: 'qarz-daftari' }));
      return;
    }
    if (this.isLoggedIn) {
      // passportExpiredModal faqat tugma bosilganda ochiladi
      this.loadAnalytics();
      this.loadDaftariStats();
    }
  },

  methods: {
    toggleMainDrill(section) {
      this.mainDrill = this.mainDrill === section ? null : section;
    },

    /**
     * "Jami berilgan/olingan qarz" kartasini yig'ish: 3 manba (shartnoma, daftari,
     * shaxsiy qarz) uchun UZS/USD qiymatlar, kurs bo'yicha jami va foiz ulushlar.
     * Yangi obyektlar qaytariladi — kiruvchi ma'lumot o'zgartirilmaydi.
     */
    buildOverviewCard(cfg) {
      const rate = Number(this.daftariUsdRate) || 0;
      const norm = (src) => {
        const uzs = Number((src && src.uzs) || 0);
        const usd = Number((src && src.usd) || 0);
        return { uzs, usd, totalUzs: Math.round(uzs + (rate > 0 ? usd * rate : 0)) };
      };

      // (splitLabel OLIB TASHLANDI — SS14-2: sarlavha endi BIR QATORDA.)

      const raw = [
        Object.assign(
          { key: 'shartnoma', label: this.ratioTexts.shartnoma, dotClass: 'bg-blue-500', segClass: 'zx-seg-shartnoma', cardClass: 'zx-card-shartnoma' },
          norm(cfg.shartnoma)
        ),
        Object.assign(
          { key: 'daftari', label: this.ratioTexts.daftari, dotClass: 'bg-green-500', segClass: 'zx-seg-daftari', cardClass: 'zx-card-daftari' },
          norm(cfg.daftari)
        ),
        Object.assign(
          { key: 'shaxsiy', label: this.ratioTexts.shaxsiy, dotClass: 'bg-amber-500', segClass: 'zx-seg-shaxsiy', cardClass: 'zx-card-shaxsiy' },
          norm(cfg.shaxsiy)
        ),
      ];

      const totalUzs = raw.reduce((sum, p) => sum + p.totalUzs, 0);
      const totalUsd = raw.reduce((sum, p) => sum + p.usd, 0);

      // Oxirgi bo'lak 100 dan ayirib olinadi — 3 ta Math.round yig'indisi 100% dan
      // oshib ketmasligi (bar "sinmasligi") uchun.
      let used = 0;
      const lastIndex = raw.length - 1;
      const parts = raw.map((p, i) => {
        let pct = 0;
        if (totalUzs > 0 && p.totalUzs > 0) {
          pct = i === lastIndex ? Math.max(100 - used, 0) : Math.round((p.totalUzs / totalUzs) * 100);
        }
        used += pct;
        return Object.assign({}, p, { pct });
      });

      return {
        key: cfg.key,
        title: cfg.title,
        iconBg: cfg.iconBg,
        iconColor: cfg.iconColor,
        iconPath: cfg.iconPath,
        parts,
        totalUzs,
        totalUsd,
      };
    },

    // Shartnoma qoldiq summasini valyuta bo'yicha ajratib olish (debitor/creditor)
    _contractCurrencySum(side, cur) {
      const arr = this.analytics.contracts?.[side]?.data || [];
      const f = arr.find(i => String(i.currency || '').toUpperCase() === cur);
      return f ? Number(f.residual_amount) || 0 : 0;
    },

    async loadAnalytics() {
      // XODIM /home/analytics ga kira olmaydi (403) — bu sahifa ular uchun emas.
      if (this.$auth && this.$auth.user && this.$auth.user.is_xodim) { this.loading = false; return; }
      // SS-PERF (2026-10-01): stale-while-revalidate — oxirgi natija darhol (aylanasiz),
      // yangisi fonda so'raladi. Kesh bo'lmasa — avvalgidek sahifa ichidagi yuklash belgisi.
      const cached = swrPeek(this.$auth, '/home/analytics');
      if (cached) {
        this.analytics = cached;
        this.loadError = false;
        this.loading = false;
      }
      try {
        if (!cached) {
          this.loading = true;
          this.loadError = false;
        }
        const res = await getAnalytics(this.$axios, cached ? { background: true, silent: true } : {});
        if (res?.success) {
          this.analytics = res.data;
          swrPut(this.$auth, '/home/analytics', res.data);
        }
      } catch (error) {
        console.error('[Dashboard] Analytics load error:', error);
        if (!cached) {this.loadError = true;}
      } finally {
        this.loading = false;
      }
    },

    applyDaftariStats(data) {
      this.daftariUsdRate = data.usd_rate || 0;
      this.combinedStats = {
        berilgan: {
          shartnoma: data.berilgan_qarz?.shartnoma || { uzs: 0, usd: 0 },
          daftari: data.berilgan_qarz?.daftari || { uzs: 0, usd: 0 },
        },
        olingan: {
          shartnoma: data.olingan_qarz?.shartnoma || { uzs: 0, usd: 0 },
          daftari: data.olingan_qarz?.daftari || { uzs: 0, usd: 0 },
        },
      };
    },

    async loadDaftariStats() {
      // Qarz daftari endpoint qarz shartnomasi (contracts) + qarz daftari (qarz_daftari) ikkala manbani qaytaradi
      const cached = swrPeek(this.$auth, '/qarz-daftari/dashboard'); // SS-PERF (2026-10-01)
      if (cached) {this.applyDaftariStats(cached);}
      try {
        const res = await getDashboard(this.$axios, { silent: true, background: !!cached });
        if (res?.success && res.data) {
          this.applyDaftariStats(res.data);
          swrPut(this.$auth, '/qarz-daftari/dashboard', res.data);
        }
      } catch (_) {}
    },

    formatMoney: formatNumber, // SS-AUDIT (2026-09-25): utils/helpers

    // To'liq summa — ming ajratgich PROBEL (toLocaleString ba'zi brauzerlarda vergul beradi)
    formatFull(value) {
      return Number(value || 0).toLocaleString('uz-UZ').replace(/,/g, ' ');
    },

    formatShort(value) {
      if (!value) {return '0';}
      const num = Number(value);
      if (num >= 1000000000) {return (num / 1000000000).toFixed(1) + 'B';}
      if (num >= 1000000) {return (num / 1000000).toFixed(1) + 'M';}
      if (num >= 1000) {return Math.round(num / 1000) + 'K';}
      return this.$formatNumber ? this.$formatNumber(num) : num.toLocaleString('uz-UZ').replace(/,/g,' ');
    },

    alertClass(type) {
      const map = { danger: 'bg-red-50 border-red-200', warning: 'bg-amber-50 border-amber-200', info: 'bg-blue-50 border-blue-200' };
      return map[type] || 'bg-gray-50 border-gray-200';
    },
    alertIconClass(type) {
      const map = { danger: 'bg-red-100 text-red-600', warning: 'bg-amber-100 text-amber-600', info: 'bg-blue-100 text-blue-600' };
      return map[type] || 'bg-gray-100';
    },
    alertLinkClass(type) {
      const map = { danger: 'text-red-600', warning: 'text-amber-600', info: 'text-blue-600' };
      return map[type] || 'text-gray-600';
    },
    getAlertTitle(alert) {
      return this.texts[`alert_${alert.code}`] || alert.code;
    },
    getAlertLink(alert) {
      const links = {
        // Muddati oz qolgan — bosh sahifa/dashboard emas, faqat filtrlangan ro'yxat sahifasi
        expiring_debitor: { name: 'near-expiration-type', params: { type: 'debitor' } },
        expiring_creditor: { name: 'near-expiration-type', params: { type: 'creditor' } },
        expired_debitor: { name: 'expired-type', params: { type: 'debitor' } },
        expired_creditor: { name: 'expired-type', params: { type: 'creditor' } },
        overdue_debts: { name: 'finance-debts' },
        budget_exceeded: { name: 'finance-budget' },
        budget_warning: { name: 'finance-budget' },
        upcoming_payments: { name: 'finance-debts' },
      };
      return links[alert.code] || { name: 'index' };
    },

    removeIdenModal() { this.idenNotification = false; },

    showPassportExpiredToast() {
      const msgs = {
        uz: "Hurmatli foydalanuvchi, ID karta (pasport) muddati o'tganligi sababli Siz tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to'liq foydalanish uchun quyidagi havola orqali mobil ilovani yuklab oling va qayta identifikatsiyadan o'ting.",
        ru: "Уважаемый пользователь, Вы не можете использовать основные функции системы, потому что срок действия вашей ID-карты (паспорта) истек. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите повторную идентификацию, чтобы в полной мере использовать систему.",
        kr: "Ҳурматли фойдаланувчи, ID карта (паспорт) муддати ўтганлиги сабабли Сиз тизимнинг асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва қайта идентификациядан ўтинг.",
        en: "Dear user, you cannot use the main functions of the system because your ID card (passport) has expired. Please download the mobile app via the link below and complete re-identification to use the system fully.", // SS-DEV (2026-09-26): en/kaa
        kaa: "Húrmetli paydalanıwshı, ID karta (pasport) múddeti ótkenligi sebepli Siz sistemanıń tiykarǵı funkciyalarınan paydalana almaysız. Iltimas, sistemadan tolıq paydalanıw ushın tómendegi silteme arqalı mobil qosımshanı júklep alıń hám qayta identifikaciyadan ótiń.",
      };
      this.$toast.error(msgs[this.$i18n?.locale] || msgs.uz);
    },

    giveMoney() {
      if (this.isPassportExpired) { this.passportExpiredModal = true; return; }
      if (!this.isLoggedIn) {return this.$router.push(this.localePath({ name: 'auth-login' }));}
      if (this.$auth.user.is_active != 1) {return (this.idenNotification = true);}
      // 03.10: oferta tasdiqlanmagan — oyna ochiladi, tasdiqlangach shu amal o'zi davom etadi
      if (this.$oferta && !this.$oferta.require(() => this.giveMoney())) {return;}
      this.$router.push(this.localePath({ name: 'search', query: { type: 'debitor' } }));
    },

    takeMoney() {
      if (this.isPassportExpired) { this.passportExpiredModal = true; return; }
      if (!this.isLoggedIn) {return this.$router.push(this.localePath({ name: 'auth-login' }));}
      if (this.$auth.user.is_active != 1) {return (this.idenNotification = true);}
      if (this.$oferta && !this.$oferta.require(() => this.takeMoney())) {return;}
      this.$router.push(this.localePath({ name: 'search', query: { type: 'creditor' } }));
    },
  },
};
</script>

<style scoped src="../assets/page-styles/index/IndexPage.css"></style>
