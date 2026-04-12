<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.pageTitle }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.pageSubtitle }}</p>
      </div>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="inline-flex items-center px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          {{ texts.shartnomaTuzish }}
        </nuxt-link>
        <nuxt-link :to="localePath({ name: 'qarz-daftari-kiritish' })" class="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          {{ texts.daftarigaKiritish }}
        </nuxt-link>
      </div>
    </div>

    <!-- Ogohlantirish -->
    <div v-if="showWarning" class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <p class="flex-1 text-sm text-amber-800 leading-relaxed">{{ texts.warning }}</p>
        <button @click="showWarning = false" class="text-xs text-amber-600 hover:text-amber-800 font-semibold whitespace-nowrap ml-4 px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors">{{ texts.understood }}</button>
      </div>
    </div>

    <!-- Statistik kartalar: 4 ta -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ texts.berilganQarz }}</p>
          <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
          </div>
        </div>
        <p class="text-xl font-bold text-gray-900">{{ formatMoney(totalBerilganUzs) }}</p>
        <p class="text-xs text-gray-400 mt-1">UZS</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-300">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ texts.berilganQarz }}</p>
          <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <span class="text-xs font-bold text-blue-600">$</span>
          </div>
        </div>
        <p class="text-xl font-bold text-gray-900">{{ formatMoney(totalBerilganUsd) }}</p>
        <p class="text-xs text-gray-400 mt-1">USD</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ texts.olinganQarz }}</p>
          <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
          </div>
        </div>
        <p class="text-xl font-bold text-gray-900">{{ formatMoney(totalOlinganUzs) }}</p>
        <p class="text-xs text-gray-400 mt-1">UZS</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-300">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ texts.olinganQarz }}</p>
          <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <span class="text-xs font-bold text-green-600">$</span>
          </div>
        </div>
        <p class="text-xl font-bold text-gray-900">{{ formatMoney(totalOlinganUsd) }}</p>
        <p class="text-xs text-gray-400 mt-1">USD</p>
      </div>
    </div>

    <!-- Diagrammalar: Berilgan va Olingan -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Berilgan qarz -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-base font-semibold text-gray-900">{{ texts.berilganQarz }}</h3>
          <p class="text-xs text-gray-500 mt-0.5">{{ texts.chartDesc }}</p>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-center mb-6">
            <QarzDaftariDashboardChart :shartnoma="dashboard.berilgan_qarz?.shartnoma" :daftari="dashboard.berilgan_qarz?.daftari" :size="170" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 rounded-lg p-3.5">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <p class="text-xs font-medium text-gray-600">{{ texts.shartnomaLabel }}</p>
              </div>
              <p class="text-base font-bold text-gray-900">{{ formatMoney(dashboard.berilgan_qarz?.shartnoma?.uzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-700 mt-0.5">{{ formatMoney(dashboard.berilgan_qarz?.shartnoma?.usd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </div>
            <div class="bg-green-50 rounded-lg p-3.5">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                <p class="text-xs font-medium text-gray-600">{{ texts.daftariLabel }}</p>
              </div>
              <p class="text-base font-bold text-gray-900">{{ formatMoney(dashboard.berilgan_qarz?.daftari?.uzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-700 mt-0.5">{{ formatMoney(dashboard.berilgan_qarz?.daftari?.usd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Olingan qarz -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-base font-semibold text-gray-900">{{ texts.olinganQarz }}</h3>
          <p class="text-xs text-gray-500 mt-0.5">{{ texts.chartDesc }}</p>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-center mb-6">
            <QarzDaftariDashboardChart :shartnoma="dashboard.olingan_qarz?.shartnoma" :daftari="dashboard.olingan_qarz?.daftari" :size="170" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 rounded-lg p-3.5">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <p class="text-xs font-medium text-gray-600">{{ texts.shartnomaLabel }}</p>
              </div>
              <p class="text-base font-bold text-gray-900">{{ formatMoney(dashboard.olingan_qarz?.shartnoma?.uzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-700 mt-0.5">{{ formatMoney(dashboard.olingan_qarz?.shartnoma?.usd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </div>
            <div class="bg-green-50 rounded-lg p-3.5">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                <p class="text-xs font-medium text-gray-600">{{ texts.daftariLabel }}</p>
              </div>
              <p class="text-base font-bold text-gray-900">{{ formatMoney(dashboard.olingan_qarz?.daftari?.uzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-700 mt-0.5">{{ formatMoney(dashboard.olingan_qarz?.daftari?.usd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      showWarning: true,
      dashboard: {
        berilgan_qarz: { shartnoma: { uzs: 0, usd: 0 }, daftari: { uzs: 0, usd: 0 } },
        olingan_qarz: { shartnoma: { uzs: 0, usd: 0 }, daftari: { uzs: 0, usd: 0 } },
      },
    };
  },
  computed: {
    totalBerilganUzs() {
      return (this.dashboard.berilgan_qarz?.shartnoma?.uzs || 0) + (this.dashboard.berilgan_qarz?.daftari?.uzs || 0);
    },
    totalBerilganUsd() {
      return (this.dashboard.berilgan_qarz?.shartnoma?.usd || 0) + (this.dashboard.berilgan_qarz?.daftari?.usd || 0);
    },
    totalOlinganUzs() {
      return (this.dashboard.olingan_qarz?.shartnoma?.uzs || 0) + (this.dashboard.olingan_qarz?.daftari?.uzs || 0);
    },
    totalOlinganUsd() {
      return (this.dashboard.olingan_qarz?.shartnoma?.usd || 0) + (this.dashboard.olingan_qarz?.daftari?.usd || 0);
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          pageTitle: "Qarz daftari",
          pageSubtitle: "Qarz oldi-berdi munosabatlaringizni boshqaring",
          warning: "Qarz oldi-berdi munosabatlaringizni qarz daftariga kiritish orqali qarzlaringizni elektron boshqarish imkoniga ega bo'lasiz. Biroq qarz daftariga kiritilgan qarzlar bo'yicha shartnoma rasmiylashtirilmaydi. Shu sababli siz ushbu qaydlar asosida sudga yoki vakolatli organga murojaat qila olmaysiz.",
          understood: "Tushundim",
          berilganQarz: "Berilgan qarz",
          olinganQarz: "Olingan qarz",
          shartnomaTuzish: "Qarz shartnomasi tuzish",
          daftarigaKiritish: "Qarz daftariga kiritish",
          chartDesc: "Shartnoma va daftari nisbati",
          shartnomaLabel: "Qarz shartnomasi",
          daftariLabel: "Qarz daftari",
        },
        ru: {
          pageTitle: "Книга долгов",
          pageSubtitle: "Управляйте долговыми отношениями",
          warning: "Внося долговые отношения в книгу долгов, вы получаете возможность электронного управления долгами. Однако по записям в книге долгов договор не оформляется. Поэтому вы не можете обращаться в суд или уполномоченные органы на основании этих записей.",
          understood: "Понятно",
          berilganQarz: "Выданные долги",
          olinganQarz: "Полученные долги",
          shartnomaTuzish: "Оформить договор",
          daftarigaKiritish: "Внести в книгу долгов",
          chartDesc: "Соотношение договоров и книги долгов",
          shartnomaLabel: "По договору",
          daftariLabel: "По книге долгов",
        },
        kr: {
          pageTitle: "Қарз дафтари",
          pageSubtitle: "Қарз олди-берди муносабатларингизни бошқаринг",
          warning: "Қарз олди-берди муносабатларингизни қарз дафтарига киритиш орқали қарзларингизни электрон бошқариш имконига эга бўласиз. Бироқ қарз дафтарига киритилган қарзлар бўйича шартнома расмийлаштирилмайди.",
          understood: "Тушундим",
          berilganQarz: "Берилган қарз",
          olinganQarz: "Олинган қарз",
          shartnomaTuzish: "Қарз шартномаси тузиш",
          daftarigaKiritish: "Қарз дафтарига киритиш",
          chartDesc: "Шартнома ва дафтари нисбати",
          shartnomaLabel: "Қарз шартномаси",
          daftariLabel: "Қарз дафтари",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    await this.loadDashboard();
  },
  methods: {
    formatMoney(n) {
      if (!n) return '0';
      return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    async loadDashboard() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/dashboard', { silent: true });
        if (res?.success) this.dashboard = { ...this.dashboard, ...res.data };
      } catch (_) {}
    },
  },
};
</script>
