<template>
  <div>
    <!-- Dashboard for logged users -->
    <div class="pb-8">
      <!-- Modals -->
      <IdenMessage v-if="idenNotification" @removeIdenModal="removeIdenModal" />
      <contractModal v-if="contractM" @removeContractModal="removeContractModal" @closeContractModal="closeContractModal" />
      <PassportExpiredMessage v-if="passportExpiredModal" @close="passportExpiredModal = false" />

      <!-- Welcome Banner -->
      <div class="mt-2">
        <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
          <!-- Background Pattern -->
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
              <div class="mt-5 lg:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5">
                <button
                  @click="giveMoney"
                  class="flex items-center justify-center px-8 py-4 bg-white text-blue-700 rounded-2xl text-lg font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <IconGiveMoney :width="28" :height="28" class="mr-3" />
                  {{ $t('home.give') }}
                </button>
                <button
                  @click="takeMoney"
                  class="flex items-center justify-center px-8 py-4 bg-green-500 text-white rounded-2xl text-lg font-bold hover:bg-green-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <IconTakeMoney :width="28" :height="28" class="mr-3" />
                  {{ $t('home.take') }}
                </button>
              </div>
            </div>

            <!-- Quick Stats in Banner -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold">{{ dall || 0 }}</p>
                <p class="text-blue-200 text-sm">{{ texts.totalDebitor }}</p>
              </div>
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold">{{ call || 0 }}</p>
                <p class="text-blue-200 text-sm">{{ texts.totalCreditor }}</p>
              </div>
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold text-green-300">{{ activeContracts }}</p>
                <p class="text-blue-200 text-sm">{{ texts.activeContracts }}</p>
              </div>
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold text-yellow-300">{{ expiredCount }}</p>
                <p class="text-blue-200 text-sm">{{ texts.expiredContracts }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Charts Section -->
      <div class="mt-6 lg:mt-8">
        <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.contractsOverview }}</h2>
        <!-- Desktop: Two columns -->
        <div class="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Debitor Chart -->
          <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ $t('home.contracts') }}</h3>
              </div>
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
              </div>
            </div>
            <div v-if="isChart" class="flex justify-center">
              <client-only>
                <apexchart
                  v-if="dall != 0"
                  type="pie"
                  width="380"
                  :options="chartOptions"
                  :series="seriesd"
                  :key="chartKeyD"
                />
              </client-only>
              <div v-if="$auth.user.is_active == 0 || dall == 0" class="flex flex-col items-center justify-center py-8">
                <IconPiePlaceholder :width="160" :height="160" />
                <p class="text-gray-400 mt-4 text-sm">{{ texts.noData }}</p>
              </div>
            </div>
          </div>

          <!-- Kreditor Chart -->
          <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ $t('home.contracts1') }}</h3>
              </div>
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
              </div>
            </div>
            <div v-if="isChart" class="flex justify-center">
              <client-only>
                <apexchart
                  v-if="call != 0"
                  type="pie"
                  width="380"
                  :options="chartOptions2"
                  :series="seriesc"
                  :key="chartKeyC"
                />
              </client-only>
              <div v-if="$auth.user.is_active == 0 || call == 0" class="flex flex-col items-center justify-center py-8">
                <IconPiePlaceholder :width="160" :height="160" />
                <p class="text-gray-400 mt-4 text-sm">{{ texts.noData }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Carousel -->
        <div class="md:hidden">
          <div
            ref="carousel"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 space-x-4"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <!-- Slide 1: Debitor -->
            <section ref="slide0" class="flex-shrink-0 snap-center" style="min-width: 88%">
              <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-bold text-gray-900">{{ $t('home.contracts') }}</h3>
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                    </svg>
                  </div>
                </div>
                <div v-if="isChart" class="flex justify-center">
                  <client-only>
                    <apexchart
                      v-if="dall != 0"
                      type="pie"
                      width="100%"
                      :options="chartOptionsMobileRightDeb"
                      :series="seriesd"
                      :key="`m-${chartKeyD}`"
                    />
                  </client-only>
                  <div v-if="$auth.user.is_active == 0 || dall == 0" class="flex flex-col items-center justify-center py-6">
                    <IconPiePlaceholder :width="140" :height="140" />
                    <p class="text-gray-400 mt-3 text-sm">{{ texts.noData }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Slide 2: Kreditor -->
            <section ref="slide1" class="flex-shrink-0 snap-center" style="min-width: 88%">
              <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-bold text-gray-900">{{ $t('home.contracts1') }}</h3>
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                    </svg>
                  </div>
                </div>
                <div v-if="isChart" class="flex justify-center">
                  <client-only>
                    <apexchart
                      v-if="call != 0"
                      type="pie"
                      width="100%"
                      :options="chartOptionsMobileRightCred"
                      :series="seriesc"
                      :key="`m-${chartKeyC}`"
                    />
                  </client-only>
                  <div v-if="$auth.user.is_active == 0 || call == 0" class="flex flex-col items-center justify-center py-6">
                    <IconPiePlaceholder :width="140" :height="140" />
                    <p class="text-gray-400 mt-3 text-sm">{{ texts.noData }}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Carousel Dots -->
          <div class="mt-4 flex items-center justify-center space-x-2">
            <button
              v-for="i in 2"
              :key="`dot-${i}`"
              class="h-2 w-2 rounded-full transition-all duration-300"
              :class="activeSlide === (i - 1) ? 'bg-blue-600 w-6' : 'bg-gray-300'"
              @click="goTo(i - 1)"
              aria-label="slide dot"
            />
          </div>
        </div>
      </div>

      <!-- Main Stats Cards -->
      <DashboardStats
        :texts="texts"
        :debitor-uzs="debitorUzs"
        :debitor-usd="debitorUsd"
        :creditor-uzs="creditorUzs"
        :creditor-usd="creditorUsd"
        :expired-debitor-uzs="expiredDebitorUzs"
        :expired-debitor-usd="expiredDebitorUsd"
        :expired-creditor-uzs="expiredCreditorUzs"
        :expired-creditor-usd="expiredCreditorUsd"
      />

      <!-- Near Expiration Tables -->
      <DashboardNearExpiration
        :near-debitor="nearDebitor"
        :near-creditor="nearCreditor"
        :empty-text="texts.noUpcomingDebts"
      />

      <!-- Reports Section -->
      <DashboardReports :texts="texts" />
    </div>
  </div>
</template>

<script>
// Icons - lightweight, keep sync
import IconPiePlaceholder from '@/components/icons/IconPiePlaceholder.vue'
import IconGiveMoney from '@/components/icons/IconGiveMoney.vue'
import IconTakeMoney from '@/components/icons/IconTakeMoney.vue'

// Dashboard child components
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardNearExpiration from '@/components/dashboard/DashboardNearExpiration.vue'
import DashboardReports from '@/components/dashboard/DashboardReports.vue'

// Heavy components - lazy load with prefetch
const NewsCard = () => import(/* webpackChunkName: "news-card" */ "@/components/NewsCard.vue");
const LoginCard = () => import(/* webpackChunkName: "login-card" */ "@/components/LoginCard.vue");
const Notification = () => import(/* webpackChunkName: "notification" */ "@/components/Notification.vue");
const IdenMessage = () => import(/* webpackChunkName: "iden-message", webpackPrefetch: true */ "@/components/IdenMessage.vue");
const ContractModal = () => import(/* webpackChunkName: "contract-modal", webpackPrefetch: true */ "@/components/contractModal.vue");
const PassportExpiredMessage = () => import(/* webpackChunkName: "passport-expired" */ "@/components/PassportExpiredMessage.vue");

export default {
  name: 'ContractDashboardPage',
  middleware: 'auth',

  props: {
    /**
     * Parent komponentdan kelgan update funksiyalari
     * @type {Object}
     */
    forceUpdateFuncs: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    NewsCard,
    LoginCard,
    Notification,
    IdenMessage,
    ContractModal,
    PassportExpiredMessage,
    IconPiePlaceholder,
    IconGiveMoney,
    IconTakeMoney,
    DashboardStats,
    DashboardNearExpiration,
    DashboardReports
  },
  data() {
    return {
      idenNotification: false,
      contractM: false,
      passportExpiredModal: false,
      socket: null,
      isChart: false,
      seriesd: [],
      seriesc: [],
      chartOptions: {
        chart: {
          type: "pie",
          width: 380,
          height: 300,
          toolbar: { show: false },
          animations: { enabled: false },
          redrawOnWindowResize: false,
          redrawOnParentResize: false,
        },
        dataLabels: { enabled: false },
        labels: [],
        legend: { position: "right", horizontalAlign: "center", offsetY: 30 },
        plotOptions: { pie: { expandOnClick: false } },
      },
      chartOptions2: {
        chart: {
          type: "pie",
          width: 380,
          height: 300,
          toolbar: { show: false },
          animations: { enabled: false },
          redrawOnWindowResize: false,
          redrawOnParentResize: false,
        },
        dataLabels: { enabled: false },
        labels: [],
        legend: { position: "right", horizontalAlign: "center", offsetY: 30 },
        plotOptions: { pie: { expandOnClick: false } },
      },
      activeSlide: 0,
      chartOptionsMobileRight: null,
      chartOptions2MobileRight: null,
      _ioCharts: null,
      chartOptionsMobileRightDeb: null,
      chartOptionsMobileRightCred: null,
      debitorUsd: null,
      debitorUzs: null,
      creditorUsd: null,
      creditorUzs: null,
      expiredDebitorUsd: null,
      expiredDebitorUzs: null,
      expiredCreditorUsd: null,
      expiredCreditorUzs: null,
      nearCreditor: [],
      nearDebitor: [],
      dall: 0,
      call: 0,
      lastSigD: "",
      lastSigC: "",
      chartKeyD: 0,
      chartKeyC: 0,
    };
  },

  computed: {
    isLoggedIn() { return !!this.$auth?.loggedIn; },
    userId() { return this.$auth?.user?.id || null; },
    isPassportExpired() {
      const d = this.$auth?.user?.expiry_date;
      return !!d && new Date(d) < new Date();
    },
    activeContracts() {
      return (this.seriesd[0] || 0) + (this.seriesc[0] || 0);
    },
    expiredCount() {
      let count = 0;
      if (this.expiredDebitorUzs || this.expiredDebitorUsd) count++;
      if (this.expiredCreditorUzs || this.expiredCreditorUsd) count++;
      return count;
    },
    texts() {
      return {
        welcome: this.$t('cd_texts.welcome'),
        welcomeDesc: this.$t('cd_texts.welcome_desc'),
        newContract: this.$t('cd_texts.new_contract'),
        totalDebitor: this.$t('cd_texts.total_debitor'),
        totalCreditor: this.$t('cd_texts.total_creditor'),
        activeContracts: this.$t('cd_texts.active_contracts'),
        expiredContracts: this.$t('cd_texts.expired_contracts'),
        financialSummary: this.$t('cd_texts.financial_summary'),
        receivable: this.$t('cd_texts.receivable'),
        payable: this.$t('cd_texts.payable'),
        overdue: this.$t('cd_texts.overdue'),
        contractsOverview: this.$t('cd_texts.contracts_overview'),
        debitorContracts: this.$t('cd_texts.debitor_contracts'),
        creditorContracts: this.$t('cd_texts.creditor_contracts'),
        noData: this.$t('cd_texts.no_data'),
        upcomingPayments: this.$t('cd_texts.upcoming_payments'),
        noUpcomingDebts: this.$t('cd_texts.no_upcoming_debts'),
        goHome: this.$t('cd_texts.go_home'),
        reports: this.$t('cd_texts.reports'),
        viewDebitorReport: this.$t('cd_texts.view_debitor_report'),
        viewCreditorReport: this.$t('cd_texts.view_creditor_report'),
        giveDesc: this.$t('cd_texts.give_desc'),
        takeDesc: this.$t('cd_texts.take_desc'),
      };
    },
  },

  watch: {
    isLoggedIn(v) {
      if (v) { this.resetForNewUser(); this.safeInit(); }
      else { this.cleanupAll(); }
    },
    userId() {
      if (this.isLoggedIn) { this.resetForNewUser(); this.safeInit(); }
    },
  },

  created() {
    const t = (k) => (this.$te && this.$te(k)) ? this.$t(k) : k;

    const translatedLabels = (labels, fallback = []) => {
      const base = (labels && labels.length) ? labels : fallback;
      return base.map(l => t(l));
    };

    const makeLegendFormatter = (labelMapArr) => {
      return (seriesName, opts) => {
        const idx = opts.seriesIndex;
        const name = labelMapArr[idx] || seriesName;
        const val = opts.w?.globals?.series?.[idx];
        return `${name}: ${val != null ? val : ''}`;
      };
    };

    const makeMobileRight = (opts = {}, fallbackLabels = []) => {
      const clone = JSON.parse(JSON.stringify(opts || {}));
      const labelsT = translatedLabels(opts.labels, fallbackLabels);
      clone.labels = labelsT;

      clone.legend = Object.assign({}, clone.legend, {
        position: 'right',
        horizontalAlign: 'left',
        offsetY: -8,
        offsetX: 6,
        floating: false,
        itemMargin: { horizontal: 8, vertical: 4 },
        markers: Object.assign({}, clone?.legend?.markers, { width: 8, height: 8, radius: 12 }),
        formatter: makeLegendFormatter(labelsT),
      });

      clone.chart = Object.assign({}, clone.chart, {
        width: '100%',
        height: 240,
        offsetX: -12,
      });

      clone.plotOptions = Object.assign({}, clone.plotOptions, {
        pie: Object.assign({}, (clone.plotOptions && clone.plotOptions.pie) || {}, {
          offsetY: 6,
          expandOnClick: false,
        })
      });

      return clone;
    };

    const commonFallback = [
      this.$t("home.jarayon") || 'Jarayonda',
      this.$t('home.Completeds') || 'Tugallangan',
      this.$t('home.Rejected') || 'Rad etildi'
    ];

    this.chartOptionsMobileRightDeb = makeMobileRight(this.chartOptions, commonFallback);
    this.chartOptionsMobileRightCred = makeMobileRight(this.chartOptions2, commonFallback);
  },

  mounted() {
    this.$nuxt.$emit("forceUpdateParent");
    if (this.isLoggedIn) {
      if (this.isPassportExpired) this.passportExpiredModal = true;
      this.safeInit();
    }
    if (!process.client) return

    this.$nextTick(() => {
      const container = this.$refs.carousel
      if (!container || !(container instanceof Element)) return

      const rawSlides = [this.$refs.slide0, this.$refs.slide1]
      const slides = rawSlides.filter(el => el && el instanceof Element)
      if (!slides.length) return

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = slides.indexOf(e.target)
            if (idx !== -1) this.activeSlide = idx
          }
        })
      }, { root: container, threshold: 0.6 })

      slides.forEach(el => io.observe(el))
      this._ioCharts = io
    })
  },

  beforeDestroy() {
    this.cleanupAll();
    if (this._ioCharts) {
      try { this._ioCharts.disconnect() } catch (e) { }
      this._ioCharts = null
    }
  },

  methods: {
    goTo(i) {
      const container = this.$refs.carousel
      const targets = [this.$refs.slide0, this.$refs.slide1].filter(el => el && el instanceof Element)
      const target = targets[i]
      if (!container || !target) return
      container.scrollTo({ left: target.offsetLeft - container.offsetLeft, behavior: 'smooth' })
      this.activeSlide = i
    },

    async safeInit() {
      try {
        await this.trySocketConnect();
        await this.loadChartData();
      } catch (e) {
        // Silent initialization error
      }
    },

    resetForNewUser() {
      this.isChart = false;
      this.seriesd = [];
      this.seriesc = [];
      this.nearCreditor = [];
      this.nearDebitor = [];
      this.debitorUsd = this.debitorUzs = null;
      this.creditorUsd = this.creditorUzs = null;
      this.expiredDebitorUsd = this.expiredDebitorUzs = null;
      this.expiredCreditorUsd = this.expiredCreditorUzs = null;
      this.dall = 0; this.call = 0;
      this.lastSigD = ""; this.lastSigC = "";
    },

    cleanupAll() {
      if (this.socket) {
        try { this.socket.close && this.socket.close(); } catch (_) { }
      }
      this.socket = null;
      this.isChart = false;
    },

    async trySocketConnect() {
      if (!this.isLoggedIn || !this.userId) return;

      // socketManager orqali ulanish (dinamik URL bilan)
      if (this.$socketManager) {
        this.socket = this.$socketManager.getSocket();

        // Agar socket ulangan bo'lsa, notification so'rash
        if (this.$socketManager.connected) {
          this.$socketManager.emit("notification", { userId: this.userId });
          // Socket connected, requesting notifications
        } else {
          // Socket ulanishini kutish
          this.$socketManager.subscribe('connect', () => {
            this.$socketManager.emit("notification", { userId: this.userId });
            // Socket connected (delayed), requesting notifications
          });
        }
      } else {
        // Fallback: $nuxtSocket ishlatish
        if (this.socket) {
          try { this.socket.close && this.socket.close(); } catch (_) { }
          this.socket = null;
        }

        this.socket = this.$nuxtSocket({
          name: "home",
          channel: "/",
          secure: true,
          default: false,
          query: { uid: this.userId },
        });

        this.socket.emit("notification", { userId: this.userId }, () => { });
      }

      if (this.$auth.user.is_active === 1 && this.$auth.user.is_contract === 0) {
        this.$router.push(this.localePath({ name: "universal_contract" }));
      }
    },

    _sig(j, t) {
      return [
        t, j.chart?.jarayon | 0, j.chart?.tugallangan | 0, j.chart?.rad | 0, j.chart?.all | 0,
        (j.five?.length || 0), (j.expired?.length || 0), (j.data?.length || 0)
      ].join("-");
    },

    async loadChartData() {
      try {
        const headers = { "Cache-Control": "no-cache" };
        const [deb, cre] = await Promise.all([
          this.$axios.$get("/home/my?type=debitor", { headers }),
          this.$axios.$get("/home/my?type=creditor", { headers }),
        ]);

        const pack = d => ({
          five: d?.data?.five || [],
          chart: {
            jarayon: d?.data?.chart?.jarayon || 0,
            tugallangan: d?.data?.chart?.tugallangan || 0,
            rad: d?.data?.chart?.rad || 0,
            all: d?.data?.chart?.all || 0,
          },
          data: d?.data?.data || [],
          expired: d?.data?.expired || [],
        });

        const debitor = pack(deb);
        const creditor = pack(cre);

        const sigD = this._sig(debitor, "d");
        const sigC = this._sig(creditor, "c");
        const sameD = sigD === this.lastSigD;
        const sameC = sigC === this.lastSigC;

        if (!sameD) {
          const sD = [debitor.chart.jarayon, debitor.chart.tugallangan, debitor.chart.rad];
          this.seriesd.splice(0, this.seriesd.length, ...sD);

          const newLabelsD = [
            `${this.$t("home.jarayon")}: ${sD[0]}`,
            `${this.$t("home.Completeds")}: ${sD[1]}`,
            `${this.$t("home.Rejected")}: ${sD[2]}`,
          ];
          if (String(this.chartOptions.labels) !== String(newLabelsD)) {
            this.chartOptions.labels = newLabelsD;
          }

          this.nearDebitor = debitor.five;
          this.dall = debitor.chart.all;
          this.debitorUsd = debitor.data.find(i => i.currency === "USD") || null;
          this.debitorUzs = debitor.data.find(i => i.currency === "UZS") || null;
          this.expiredDebitorUsd = debitor.expired.find(i => i.currency === "USD") || null;
          this.expiredDebitorUzs = debitor.expired.find(i => i.currency === "UZS") || null;
          this.lastSigD = sigD;
        }

        if (!sameC) {
          const sC = [creditor.chart.jarayon, creditor.chart.tugallangan, creditor.chart.rad];
          this.seriesc.splice(0, this.seriesc.length, ...sC);

          const newLabelsC = [
            `${this.$t("home.jarayon")}: ${sC[0]}`,
            `${this.$t("home.Completeds")}: ${sC[1]}`,
            `${this.$t("home.Rejected")}: ${sC[2]}`,
          ];
          if (String(this.chartOptions2.labels) !== String(newLabelsC)) {
            this.chartOptions2.labels = newLabelsC;
          }

          this.nearCreditor = creditor.five;
          this.call = creditor.chart.all;
          this.creditorUsd = creditor.data.find(i => i.currency === "USD") || null;
          this.creditorUzs = creditor.data.find(i => i.currency === "UZS") || null;
          this.expiredCreditorUsd = creditor.expired.find(i => i.currency === "USD") || null;
          this.expiredCreditorUzs = creditor.expired.find(i => i.currency === "UZS") || null;
          this.lastSigC = sigC;
        }

        this.isChart = true;
        this.$nextTick(() => this.refreshCharts());
      } catch (e) {
        if (e?.response?.status !== 429) {
          this.$toast?.error(this.$t("a1.a42"));
        }
      }
    },

    refreshCharts() {
      try {
        if (this.$refs.debitorChart) {
          this.$refs.debitorChart.updateSeries(this.seriesd, true);
          this.$refs.debitorChart.updateOptions({ labels: this.chartOptions.labels }, false, true);
        }
        if (this.$refs.creditorChart) {
          this.$refs.creditorChart.updateSeries(this.seriesc, true);
          this.$refs.creditorChart.updateOptions({ labels: this.chartOptions2.labels }, false, true);
        }
      } catch (_) { }
    },

    removeIdenModal() { clearTimeout(this.timeoutFunc); this.idenNotification = false; },
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
      if (this.isPassportExpired) {
        this.showPassportExpiredToast();
        this.passportExpiredModal = true;
        return;
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: "auth-login" }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: "search", query: { type: "debitor" } }));
    },

    takeMoney() {
      if (this.isPassportExpired) {
        this.showPassportExpiredToast();
        this.passportExpiredModal = true;
        return;
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: "auth-login" }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: "search", query: { type: "creditor" } }));
    },
  },
};
</script>

<style scoped>
/* Hide scrollbar for carousel */
div[ref="carousel"]::-webkit-scrollbar {
  display: none;
}
</style>
