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
      <contractModal v-if="contractM" @removeContractModal="removeContractModal" @closeContractModal="closeContractModal" />
      <PassportExpiredMessage v-if="passportExpiredModal" @close="passportExpiredModal = false" />

      <!-- SECTION 1: Welcome Header + Health Score -->
      <div class="mt-2">
        <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 class="text-2xl lg:text-3xl font-bold mb-2">
                  {{ texts.welcome }}, {{ $auth.user ? $auth.user.first_name : '' }}!
                </h1>
                <p class="text-blue-100 text-sm lg:text-base max-w-xl">
                  {{ texts.welcomeDesc }}
                </p>
              </div>
              <!-- Health Score -->
              <div class="mt-4 lg:mt-0 flex items-center gap-4">
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl px-5 py-3 text-center flex-1">
                  <p class="text-3xl lg:text-4xl font-bold text-white">
                    {{ analytics.health?.score ?? '-' }}
                  </p>
                  <p class="text-blue-100 text-xs mt-1">{{ texts.healthScore }}</p>
                </div>
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl px-5 py-3 text-center">
                  <p class="text-lg font-semibold text-white">{{ healthStatusText }}</p>
                  <p class="text-blue-100 text-xs mt-1">{{ texts.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <button @click="loadAnalytics" class="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            {{ texts.retry }}
          </button>
        </div>
      </div>

      <template v-else>
        <!-- Umumiy ko'rinish (shartnoma va daftari nisbati) — sarlavhasiz.
             "Asosiy ko'rsatkichlar" (2 card + drill-down) va "Umumiy ko'rinish"
             sarlavhasi foydalanuvchi so'roviga ko'ra olib tashlandi. -->
        <div class="mt-6 lg:mt-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Berilgan / Olingan qarz — 3 manba nisbati:
                 Qarz shartnomasi + Qarz daftari + Shaxsiy qarz -->
            <div
              v-for="card in overviewCards"
              :key="card.key"
              class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-center justify-between mb-5">
                <div>
                  <!-- SS1-1 (2026-09-20): "Shartnoma va daftari nisbati" tagsarlavhasi OLIB TASHLANDI. -->
                  <h3 class="text-lg font-bold text-gray-900">{{ card.title }}</h3>
                </div>
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="card.iconBg">
                  <svg class="w-5 h-5" :class="card.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.iconPath" />
                  </svg>
                </div>
              </div>

              <!-- Jami (UZS hisobida; USD kurs bo'yicha qo'shilgan) + ulushlar -->
              <div class="flex items-end justify-between mb-4">
                <div>
                  <!-- SS14-1 (2026-09-21): "Jami" tagsarlavhasi OLIB TASHLANDI —
                       katta raqamning o'zi allaqachon tushunarli. -->
                  <p class="text-2xl font-bold text-gray-900">{{ formatFull(card.totalUzs) }}</p>
                  <!-- SS-DEV (2026-09-23): kurs qatori USD qarz bo'lmasa ham ko'rsatiladi —
                       aks holda ikki kartaning balandligi farq qilib, diagramma
                       tepaga "sakrab" chiqardi. Kurs butun so'mgacha yaxlitlanadi
                       (11 839.59 -> 11 840; formatFull kasrni "839 59" qilib buzardi). -->
                  <p v-if="daftariUsdRate > 0" class="text-xs text-gray-400 mt-0.5">
                    {{ ratioTexts.usdRateLabel }}: 1 USD = {{ formatFull(Math.round(daftariUsdRate)) }} UZS
                  </p>
                </div>
                <div class="flex items-center gap-3 text-xs pb-1">
                  <span v-for="part in card.parts" :key="part.key" class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-sm inline-block" :class="part.dotClass"></span>
                    <span class="text-gray-600 font-medium">{{ part.pct }}%</span>
                  </span>
                </div>
              </div>

              <!-- Gorizontal stacked bar (3 bo'lak) -->
              <div class="zx-ratio-track">
                <div
                  v-for="part in card.parts"
                  :key="part.key"
                  class="zx-ratio-seg"
                  :class="part.segClass"
                  :style="{ width: part.pct + '%' }"
                  :title="part.label + ': ' + part.pct + '%'"
                >
                  <span v-if="part.pct >= 15" class="zx-ratio-pct">{{ part.pct }}%</span>
                </div>
                <div v-if="card.totalUzs === 0" class="zx-ratio-empty">
                  <span>{{ ratioTexts.noData }}</span>
                </div>
              </div>

              <!-- 3 ta kichik katak — UZS va USD alohida -->
              <div class="grid grid-cols-3 gap-2 mt-4">
                <div v-for="part in card.parts" :key="part.key" class="zx-ratio-card" :class="part.cardClass">
                  <!-- SS14-2 (2026-09-21): sarlavha BIR QATORDA sig'ishi kerak ("shartnomasi"
                       pastki qatorga TUSHMASIN). 2-qatorli yechim (2026-09-20) bekor qilindi.
                       Uchala sarlavha bir xil o'lchamda qolishi uchun shrift va harflar
                       orasi zx-ratio-label da siqilgan; o'ralish butunlay taqiqlangan. -->
                  <p class="zx-ratio-label text-gray-500 font-medium mb-2" :title="part.label">{{ part.label }}</p>
                  <!-- SS1-2: summalar K / M / B shaklida qisqartiriladi -->
                  <p class="text-sm font-bold text-gray-900 leading-tight">
                    {{ formatShort(part.uzs) }} <span class="text-xs font-normal text-gray-400">UZS</span>
                  </p>
                  <p class="text-xs font-semibold text-gray-700 mt-0.5 leading-tight">
                    {{ formatShort(part.usd) }} <span class="text-xs font-normal text-gray-400">USD</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: Module Overview Cards -->
        <div class="mt-6 lg:mt-8">
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.modulesOverview }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <!-- Qarz Shartnomasi -->
            <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="block group">
              <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 class="text-base font-bold text-gray-900">{{ texts.contractModule }}</h3>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Debitor/Kreditor: shartnoma SONI emas, qoldiq SUMMA (UZS/USD alohida) -->
                  <div class="bg-green-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-green-700">{{ formatShort(contractDebitorUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
                    <p class="text-sm font-bold text-green-700">{{ formatShort(contractDebitorUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
                    <p class="text-xs text-gray-500">{{ texts.lent }}</p>
                  </div>
                  <div class="bg-red-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-red-700">{{ formatShort(contractCreditorUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
                    <p class="text-sm font-bold text-red-700">{{ formatShort(contractCreditorUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
                    <p class="text-xs text-gray-500">{{ texts.borrowed }}</p>
                  </div>
                </div>
              </div>
            </nuxt-link>

            <!-- Qarz Daftari -->
            <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="block group">
              <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 class="text-base font-bold text-gray-900">{{ texts.debtModule }}</h3>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Qarz daftari: berilgan BIRINCHI, olingan IKKINCHI — combinedStats (/qarz-daftari/dashboard) dan -->
                  <div class="bg-green-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-green-700">{{ formatShort(daftariBerilganUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
                    <p class="text-sm font-bold text-green-700">{{ formatShort(daftariBerilganUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
                    <p class="text-xs text-gray-500">{{ texts.lent }}</p>
                  </div>
                  <div class="bg-red-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-red-700">{{ formatShort(daftariOlinganUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
                    <p class="text-sm font-bold text-red-700">{{ formatShort(daftariOlinganUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
                    <p class="text-xs text-gray-500">{{ texts.borrowed }}</p>
                  </div>
                </div>
              </div>
            </nuxt-link>

            <!-- Shaxsiy qarz -->
            <nuxt-link :to="localePath({ name: 'finance-debts' })" class="block group">
              <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <h3 class="text-base font-bold text-gray-900">Shaxsiy qarz</h3>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Berilgan/Olingan shaxsiy qarz: UZS katta + USD kichik -->
                  <div class="bg-green-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-green-700">{{ formatShort(personalLentUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
                    <p class="text-sm font-bold text-green-700">{{ formatShort(personalLentUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
                    <p class="text-xs text-gray-500">{{ texts.lent }}</p>
                  </div>
                  <div class="bg-red-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-red-700">{{ formatShort(personalBorrowedUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
                    <p class="text-sm font-bold text-red-700">{{ formatShort(personalBorrowedUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
                    <p class="text-xs text-gray-500">{{ texts.borrowed }}</p>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>

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
import { formatNumber } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
import AppFooter from '@/components/AppFooter.vue'

// Nuxt auto-import: IdenMessage, ContractModal
const LandingPage = () => import(/* webpackChunkName: "landing-page", webpackPreload: true */ "@/components/LandingPage.vue");
// Nuxt auto-import: PassportExpiredMessage

// SS-AUDIT (2026-09-25): ishlatilmagan komponent ro'yxati/importi olib tashlandi (IconGiveMoney)
export default {
  name: 'UnifiedDashboard',
  auth: false,

  components: {
    // IdenMessage, ContractModal, PassportExpiredMessage — Nuxt auto-import
    LandingPage,
    AppFooter,
  },

  data() {
    return {
      idenNotification: false,
      contractM: false,
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

  computed: {
    isLoggedIn() { return !!this.$auth?.loggedIn; },
    userId() { return this.$auth?.user?.id || null; },
    isPassportExpired() {
      const d = this.$auth?.user?.expiry_date;
      return !!d && new Date(d) < new Date();
    },

    contractActiveCount() {
      return (this.analytics.contracts?.debitor?.chart?.jarayon || 0) +
             (this.analytics.contracts?.creditor?.chart?.jarayon || 0);
    },
    debitorChartAll() {
      return this.analytics.contracts?.debitor?.chart?.all || 0;
    },
    creditorChartAll() {
      return this.analytics.contracts?.creditor?.chart?.all || 0;
    },
    debitorUzsAmount() {
      const data = this.analytics.contracts?.debitor?.data || [];
      const found = data.find(i => i.currency === 'UZS');
      return found ? found.residual_amount : 0;
    },

    // Qarz shartnomasi moduli kartasi — debitor/kreditor qoldiq SUMMA (valyuta bo'yicha)
    // Manba: /home/analytics → contracts.debitor.data / contracts.creditor.data (valyuta bo'yicha guruhlangan)
    contractDebitorUzs() { return this._contractCurrencySum('debitor', 'UZS'); },
    contractDebitorUsd() { return this._contractCurrencySum('debitor', 'USD'); },
    contractCreditorUzs() { return this._contractCurrencySum('creditor', 'UZS'); },
    contractCreditorUsd() { return this._contractCurrencySum('creditor', 'USD'); },

    // Qarz daftari moduli kartasi uchun — FAQAT qarz daftari (shartnoma EMAS)
    daftariOlinganUzs() { return Number(this.combinedStats.olingan?.daftari?.uzs) || 0; },
    daftariOlinganUsd() { return Number(this.combinedStats.olingan?.daftari?.usd) || 0; },
    daftariBerilganUzs() { return Number(this.combinedStats.berilgan?.daftari?.uzs) || 0; },
    daftariBerilganUsd() { return Number(this.combinedStats.berilgan?.daftari?.usd) || 0; },

    // Jami olingan qarz (shartnoma + daftari) UZS
    combinedBorrowedUzs() {
      return (Number(this.combinedStats.olingan?.shartnoma?.uzs) || 0)
           + (Number(this.combinedStats.olingan?.daftari?.uzs) || 0);
    },
    combinedBorrowedUsd() {
      return (Number(this.combinedStats.olingan?.shartnoma?.usd) || 0)
           + (Number(this.combinedStats.olingan?.daftari?.usd) || 0);
    },
    // Jami berilgan qarz (shartnoma + daftari)
    combinedLentUzs() {
      return (Number(this.combinedStats.berilgan?.shartnoma?.uzs) || 0)
           + (Number(this.combinedStats.berilgan?.daftari?.uzs) || 0);
    },
    combinedLentUsd() {
      return (Number(this.combinedStats.berilgan?.shartnoma?.usd) || 0)
           + (Number(this.combinedStats.berilgan?.daftari?.usd) || 0);
    },

    idenTexts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Identifikatsiyadan o'ting", shortMessage: "Tizimning barcha imkoniyatlaridan to'liq foydalanish uchun mobil ilova orqali identifikatsiyadan o'ting.", message: "Hurmatli foydalanuvchi, siz identifikatsiyadan o'tmaganligingiz sababli tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to'liq foydalanish uchun quyidagi havola orqali mobil ilovani yuklab oling va identifikatsiyadan o'ting." },
        ru: { title: "Пройдите идентификацию", shortMessage: "Чтобы использовать все возможности системы, пройдите идентификацию через мобильное приложение.", message: "Уважаемый пользователь, вы не можете использовать основные функции системы, потому что не прошли идентификацию. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите идентификацию, чтобы в полной мере использовать систему." },
        kr: { title: "Идентификациядан ўтинг", shortMessage: "Тизимнинг барча имкониятларидан тўлиқ фойдаланиш учун мобил илова орқали идентификациядан ўтинг.", message: "Ҳурматли фойдаланувчи, сиз идентификациядан ўтмаганлигингиз сабабли тизимнинг асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва идентификациядан ўтинг." },
      };
      return t[l] || t.uz;
    },
    healthScoreColor() {
      const s = this.analytics.health?.score || 0;
      if (s >= 85) return 'text-green-300';
      if (s >= 70) return 'text-yellow-300';
      if (s >= 50) return 'text-orange-300';
      return 'text-red-300';
    },
    healthStatusText() {
      const status = this.analytics.health?.status || 'good';
      const map = {
        excellent: this.texts.healthExcellent,
        good: this.texts.healthGood,
        fair: this.texts.healthFair,
        poor: this.texts.healthPoor,
      };
      return map[status] || status;
    },
    budgetBarColor() {
      const pct = this.analytics.finance?.budget?.percentage || 0;
      if (pct > 100) return 'bg-red-500';
      if (pct > 80) return 'bg-yellow-500';
      return 'bg-green-500';
    },

    // Shaxsiy qarz (Shaxsiy moliya > Qarzlar) — UZS/USD alohida.
    // Manba: /home/analytics → debts { lent_uzs, lent_usd, borrowed_uzs, borrowed_usd }
    personalLentUzs() { return Number(this.analytics.debts?.lent_uzs) || 0; },
    personalLentUsd() { return Number(this.analytics.debts?.lent_usd) || 0; },
    personalBorrowedUzs() { return Number(this.analytics.debts?.borrowed_uzs) || 0; },
    personalBorrowedUsd() { return Number(this.analytics.debts?.borrowed_usd) || 0; },

    // "Jami berilgan / Jami olingan qarz" kartalari — 3 manba nisbati:
    // Qarz shartnomasi + Qarz daftari (/qarz-daftari/dashboard) va Shaxsiy qarz
    // (/home/analytics). Jami summa va progress bar uchalasini hisobga oladi.
    overviewCards() {
      return [
        this.buildOverviewCard({
          key: 'berilgan',
          title: this.texts.totalLent,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          iconPath: 'M5 10l7-7m0 0l7 7m-7-7v18',
          shartnoma: this.combinedStats.berilgan?.shartnoma,
          daftari: this.combinedStats.berilgan?.daftari,
          shaxsiy: { uzs: this.personalLentUzs, usd: this.personalLentUsd },
        }),
        this.buildOverviewCard({
          key: 'olingan',
          title: this.texts.totalBorrowed,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          iconPath: 'M19 14l-7 7m0 0l-7-7m7 7V3',
          shartnoma: this.combinedStats.olingan?.shartnoma,
          daftari: this.combinedStats.olingan?.daftari,
          shaxsiy: { uzs: this.personalBorrowedUzs, usd: this.personalBorrowedUsd },
        }),
      ];
    },

    // Nisbat kartasi matnlari. "Shaxsiy qarz" — yangi manba, o'zbekcha hardcode.
    ratioTexts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { totalLabel: 'Jami', shartnoma: 'Qarz shartnomasi', daftari: 'Qarz daftari', noData: "Ma'lumot yo'q", usdRateLabel: 'Markaziy bank kursi' },
        ru: { totalLabel: 'Всего', shartnoma: 'По договору', daftari: 'По книге', noData: 'Нет данных', usdRateLabel: 'Курс ЦБ' },
        kr: { totalLabel: 'Жами', shartnoma: 'Қарз шартномаси', daftari: 'Қарз дафтари', noData: "Маълумот йўқ", usdRateLabel: 'Марказий банк курси' },
      };
      return Object.assign({ shaxsiy: 'Shaxsiy qarz' }, t[l] || t.uz);
    },

    texts() {
      return {
        welcome: this.$t('home_texts.welcome'),
        welcomeDesc: this.$t('home_texts.welcome_desc'),
        healthScore: this.$t('home_texts.health_score'),
        status: this.$t('home_texts.status'),
        healthExcellent: this.$t('home_texts.health_excellent'),
        healthGood: this.$t('home_texts.health_good'),
        healthFair: this.$t('home_texts.health_fair'),
        healthPoor: this.$t('home_texts.health_poor'),
        keyMetrics: this.$t('home_texts.key_metrics'),
        activeContracts: this.$t('home_texts.active_contracts'),
        receivableUzs: this.$t('home_texts.receivable_uzs'),
        totalBorrowed: this.$t('home_texts.total_borrowed'),
        totalLent: this.$t('home_texts.total_lent'),
        monthlyExpense: this.$t('home_texts.monthly_expense'),
        goalsProgress: this.$t('home_texts.goals_progress'),
        modulesOverview: this.$t('home_texts.modules_overview'),
        contractModule: this.$t('home_texts.contract_module'),
        debtModule: this.$t('home_texts.debt_module'),
        financeModule: this.$t('home_texts.finance_module'),
        debitorContracts: this.$t('home_texts.debitor_contracts'),
        creditorContracts: this.$t('home_texts.creditor_contracts'),
        borrowed: this.$t('home_texts.borrowed'),
        lent: this.$t('home_texts.lent'),
        overdueDebts: this.$t('home_texts.overdue_debts'),
        budget: this.$t('home_texts.budget'),
        expenses: this.$t('home_texts.expenses'),
        // home_texts'да "income" kaliti yo'q — mahalliylashtirilgan inline map (bySourceLabel uslubida)
        income: ({ uz: 'Daromad', kr: 'Даромад', ru: 'Доход', en: 'Income', kaa: 'Kiris' }[this.$i18n?.locale] || 'Daromad'),
        activeGoals: this.$t('home_texts.active_goals'),
        alertsTitle: this.$t('home_texts.alerts_title'),
        alertCount: this.$t('home_texts.alert_count'),
        view: this.$t('home_texts.view'),
        quickActions: this.$t('home_texts.quick_actions'),
        addExpense: this.$t('home_texts.add_expense'),
        addDebt: this.$t('home_texts.add_debt'),
        alert_expiring_debitor: this.$t('home_texts.alert_expiring_debitor'),
        alert_expiring_creditor: this.$t('home_texts.alert_expiring_creditor'),
        alert_expired_debitor: this.$t('home_texts.alert_expired_debitor'),
        alert_expired_creditor: this.$t('home_texts.alert_expired_creditor'),
        alert_overdue_debts: this.$t('home_texts.alert_overdue_debts'),
        alert_budget_exceeded: this.$t('home_texts.alert_budget_exceeded'),
        alert_budget_warning: this.$t('home_texts.alert_budget_warning'),
        alert_upcoming_payments: this.$t('home_texts.alert_upcoming_payments'),
        loadErrorMsg: this.$t('home_texts.load_error_msg'),
        retry: this.$t('home_texts.retry'),
        bySource: this.bySourceLabel,
        viewSection: this.viewSectionLabel,
      };
    },

    bySourceLabel() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "manbalar bo'yicha", ru: 'по источникам', kr: "манбалар бўйича" }[l] || "manbalar bo'yicha";
    },
    viewSectionLabel() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "Bo'limga o'tish", ru: 'Перейти в раздел', kr: "Бўлимга ўтиш" }[l] || "Bo'limga o'tish";
    },
    // "Umumiy ko'rinish" (shartnoma va daftari nisbati) — qarz-daftaridan ko'chirildi (Task 6a)
    overviewTitle() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "Umumiy ko'rinish", ru: 'Обзор', kr: "Умумий кўриниш" }[l] || "Umumiy ko'rinish";
    },
    // (overviewDesc OLIB TASHLANDI — SS1-1: tagsarlavha endi ko'rsatilmaydi.)
  },

  watch: {
    isLoggedIn(v) {
      if (v) this.loadAnalytics();
    },
    userId() {
      if (this.isLoggedIn) this.loadAnalytics();
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
      try {
        this.loading = true;
        this.loadError = false;
        const res = await this.$axios.$get('/home/analytics');
        if (res?.success) {
          this.analytics = res.data;
        }
      } catch (error) {
        console.error('[Dashboard] Analytics load error:', error);
        this.loadError = true;
      } finally {
        this.loading = false;
      }
    },

    async loadDaftariStats() {
      // Qarz daftari endpoint qarz shartnomasi (contracts) + qarz daftari (qarz_daftari) ikkala manbani qaytaradi
      try {
        const res = await this.$axios.$get('/qarz-daftari/dashboard', { silent: true });
        if (res?.success && res.data) {
          this.daftariUsdRate = res.data.usd_rate || 0;
          this.combinedStats = {
            berilgan: {
              shartnoma: res.data.berilgan_qarz?.shartnoma || { uzs: 0, usd: 0 },
              daftari: res.data.berilgan_qarz?.daftari || { uzs: 0, usd: 0 },
            },
            olingan: {
              shartnoma: res.data.olingan_qarz?.shartnoma || { uzs: 0, usd: 0 },
              daftari: res.data.olingan_qarz?.daftari || { uzs: 0, usd: 0 },
            },
          };
        }
      } catch (_) {}
    },

    formatMoney: formatNumber, // SS-AUDIT (2026-09-25): utils/helpers

    // To'liq summa — ming ajratgich PROBEL (toLocaleString ba'zi brauzerlarda vergul beradi)
    formatFull(value) {
      return Number(value || 0).toLocaleString('uz-UZ').replace(/,/g, ' ');
    },

    formatShort(value) {
      if (!value) return '0';
      const num = Number(value);
      if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return Math.round(num / 1000) + 'K';
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
    removeContractModal() { this.contractM = false; if (process.client) window.location.reload(); },
    closeContractModal() { this.contractM = false; },

    showPassportExpiredToast() {
      const msgs = {
        uz: "Hurmatli foydalanuvchi, ID karta (pasport) muddati o'tganligi sababli Siz tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to'liq foydalanish uchun quyidagi havola orqali mobil ilovani yuklab oling va qayta identifikatsiyadan o'ting.",
        ru: "Уважаемый пользователь, Вы не можете использовать основные функции системы, потому что срок действия вашей ID-карты (паспорта) истек. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите повторную идентификацию, чтобы в полной мере использовать систему.",
        kr: "Ҳурматли фойдаланувчи, ID карта (паспорт) муддати ўтганлиги сабабли Сиз тизимнинг асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва қайта идентификациядан ўтинг.",
      };
      this.$toast.error(msgs[this.$i18n?.locale] || msgs.uz);
    },

    giveMoney() {
      if (this.isPassportExpired) { this.passportExpiredModal = true; return; }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: 'auth-login' }));
      if (this.$auth.user.is_active != 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: 'search', query: { type: 'debitor' } }));
    },

    takeMoney() {
      if (this.isPassportExpired) { this.passportExpiredModal = true; return; }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: 'auth-login' }));
      if (this.$auth.user.is_active != 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: 'search', query: { type: 'creditor' } }));
    },
  },
};
</script>

<style scoped>
/* ============================================
   "Jami berilgan/olingan qarz" — 3 manba nisbati
   (Qarz shartnomasi / Qarz daftari / Shaxsiy qarz)
   ============================================ */
.zx-ratio-track {
  display: flex;
  width: 100%;
  height: 32px;
  background-color: #F3F4F6;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.zx-ratio-seg {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.4s ease;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.zx-seg-shartnoma {
  background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
}

.zx-seg-daftari {
  background: linear-gradient(90deg, #22C55E 0%, #16A34A 100%);
}

.zx-seg-shaxsiy {
  background: linear-gradient(90deg, #F59E0B 0%, #D97706 100%);
}

.zx-ratio-pct {
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 0 6px;
}

.zx-ratio-empty {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F3F4F6;
  color: #9CA3AF;
  font-size: 13px;
  font-weight: 500;
}

/* SS14-2: nisbat katagi sarlavhasi — BIR QATOR, o'ralmaydi.
   Tailwind v2 (JIT o'chiq) da `text-[11px]` INERT bo'lgani uchun CSS bilan. */
.zx-ratio-label {
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.2px;
  min-width: 0;
}

.zx-ratio-card {
  /* SS14-2: yon padding 10px -> 8px — sarlavha bir qatorga sig'ishi uchun. */
  padding: 10px 8px;
  border-radius: 10px;
  background-color: #F9FAFB;
  border: 1px solid #F3F4F6;
  min-width: 0;
}

.zx-card-shartnoma {
  background-color: #EFF6FF;
  border-color: #DBEAFE;
}

.zx-card-daftari {
  background-color: #F0FDF4;
  border-color: #DCFCE7;
}

.zx-card-shaxsiy {
  background-color: #FFFBEB;
  border-color: #FEF3C7;
}

/* ============================================
   Bosh sahifa footeri — layouts/default.vue dagi
   .main-content padding'ini (20px / mobil 15px) qoplab,
   to'liq kenglikda chiqadi.
   ============================================ */
.zx-home-footer {
  margin-left: -20px;
  margin-right: -20px;
  margin-bottom: -20px;
}

@media (max-width: 1023px) {
  .zx-home-footer {
    margin-left: -15px;
    margin-right: -15px;
    margin-bottom: -15px;
  }
}

/* Yuklash aylanasi — halqa ZeroX belgisi (3 tayoqcha) atrofida aylanadi, ichida yozuv yo'q */
.zx-loader {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zx-loader-ring {
  position: absolute;
  inset: 0;
  border: 4px solid rgba(49, 130, 206, 0.15);
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: zx-spin 0.9s linear infinite;
}
.zx-loader-mark {
  width: 34px;
  height: 34px;
  object-fit: contain;
}
@keyframes zx-spin {
  to { transform: rotate(360deg); }
}

.fade-slide-enter-active {
  transition: all 0.3s ease;
}
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
