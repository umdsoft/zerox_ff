<template>
  <div class="pb-8">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ texts.title }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ texts.subtitle }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="exportDebts" class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Excel
          </button>
          <button @click="exportPdf" class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-xl transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Umumiy statistika -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="stat in summaryCards" :key="stat.label" class="bg-white rounded-xl shadow-sm p-5">
        <div class="text-sm text-gray-500 mb-1">{{ stat.label }}</div>
        <div class="text-2xl font-bold" :class="stat.color">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Grafiklar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Oylik trend -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="font-semibold text-gray-900 mb-4">{{ texts.monthlyTrend }}</h3>
        <div v-if="analytics.monthly_trend?.length" class="space-y-2">
          <div v-for="m in analytics.monthly_trend" :key="m.month" class="flex items-center gap-3">
            <span class="text-xs text-gray-500 w-16">{{ m.month }}</span>
            <div class="flex-1 flex gap-1 h-6">
              <div class="bg-blue-500 rounded-sm h-full transition-all" :style="{ width: barWidth(m.lent, maxMonthly) + '%' }" :title="texts.lent + ': ' + formatMoney(m.lent)"></div>
              <div class="bg-orange-400 rounded-sm h-full transition-all" :style="{ width: barWidth(m.borrowed, maxMonthly) + '%' }" :title="texts.borrowed + ': ' + formatMoney(m.borrowed)"></div>
            </div>
            <span class="text-xs text-gray-400 w-8">{{ m.count }}</span>
          </div>
          <div class="flex gap-4 mt-3 text-xs">
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-blue-500"></span>{{ texts.lent }}</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-orange-400"></span>{{ texts.borrowed }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400 text-center py-8">{{ texts.noData }}</p>
      </div>

      <!-- Holat taqsimoti -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="font-semibold text-gray-900 mb-4">{{ texts.statusDist }}</h3>
        <div v-if="analytics.status_distribution?.length" class="space-y-4">
          <div v-for="s in analytics.status_distribution" :key="s.status" class="flex items-center gap-3">
            <span :class="[
              'w-3 h-3 rounded-full',
              s.status === 'active' ? 'bg-blue-500' : s.status === 'completed' ? 'bg-green-500' : s.status === 'overdue' ? 'bg-red-500' : 'bg-gray-400'
            ]"></span>
            <span class="text-sm text-gray-700 flex-1">{{ statusLabel(s.status) }}</span>
            <span class="text-sm font-semibold text-gray-900">{{ s.count }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400 text-center py-8">{{ texts.noData }}</p>
      </div>
    </div>

    <!-- Top qarzdorlar -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="font-semibold text-gray-900 mb-4">{{ texts.topDebtors }}</h3>
      <div v-if="analytics.top_debtors?.length" class="space-y-3">
        <div v-for="(d, i) in analytics.top_debtors" :key="i" class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
          <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" :class="i < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'">{{ i + 1 }}</span>
          <span class="flex-1 font-medium text-gray-900">{{ d.name }}</span>
          <span class="text-sm text-gray-500">{{ formatMoney(d.total_amount) }} UZS</span>
          <span :class="['text-sm font-semibold', d.rating >= 70 ? 'text-green-600' : d.rating >= 50 ? 'text-yellow-600' : 'text-red-600']">{{ d.rating }}</span>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 text-center py-8">{{ texts.noData }}</p>
    </div>

    <!-- To'lovlar trendi -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="font-semibold text-gray-900 mb-4">{{ texts.paymentTrend }}</h3>
      <div v-if="analytics.payment_trend?.length" class="space-y-2">
        <div v-for="p in analytics.payment_trend" :key="p.month" class="flex items-center gap-3">
          <span class="text-xs text-gray-500 w-16">{{ p.month }}</span>
          <div class="flex-1 h-5">
            <div class="bg-green-500 rounded-sm h-full transition-all" :style="{ width: barWidth(p.total_paid, maxPayment) + '%' }"></div>
          </div>
          <span class="text-xs text-gray-600 w-24 text-right">{{ formatMoney(p.total_paid) }}</span>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 text-center py-8">{{ texts.noData }}</p>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',

  data() {
    return {
      analytics: {},
      report: {},
      loading: true,
    };
  },

  computed: {
    maxMonthly() {
      if (!this.analytics.monthly_trend?.length) return 1;
      return Math.max(...this.analytics.monthly_trend.map(m => Math.max(parseFloat(m.lent) || 0, parseFloat(m.borrowed) || 0)), 1);
    },
    maxPayment() {
      if (!this.analytics.payment_trend?.length) return 1;
      return Math.max(...this.analytics.payment_trend.map(p => parseFloat(p.total_paid) || 0), 1);
    },
    summaryCards() {
      const s = this.report?.summary || {};
      return [
        { label: this.texts.totalLent, value: this.formatMoney(s.total_lent || 0), color: 'text-blue-600' },
        { label: this.texts.totalBorrowed, value: this.formatMoney(s.total_borrowed || 0), color: 'text-orange-600' },
        { label: this.texts.remaining, value: this.formatMoney(s.total_remaining || 0), color: 'text-red-600' },
        { label: this.texts.overdue, value: s.overdue_count || 0, color: s.overdue_count > 0 ? 'text-red-600' : 'text-green-600' },
      ];
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: 'Qarz analitikasi', subtitle: 'Qarzlar bo\'yicha batafsil statistika va grafiklar', monthlyTrend: 'Oylik qarz dinamikasi', statusDist: 'Holat bo\'yicha taqsimot', topDebtors: 'Top qarzdorlar', paymentTrend: 'To\'lovlar dinamikasi', lent: 'Berilgan', borrowed: 'Olingan', noData: 'Ma\'lumot yo\'q', totalLent: 'Jami berilgan', totalBorrowed: 'Jami olingan', remaining: 'Qoldiq qarz', overdue: 'Muddati o\'tgan', active: 'Faol', completed: 'Tugallangan', cancelled: 'Bekor qilingan' },
        ru: { title: 'Аналитика долгов', subtitle: 'Подробная статистика и графики по долгам', monthlyTrend: 'Динамика по месяцам', statusDist: 'Распределение по статусу', topDebtors: 'Топ должников', paymentTrend: 'Динамика платежей', lent: 'Выдано', borrowed: 'Получено', noData: 'Нет данных', totalLent: 'Всего выдано', totalBorrowed: 'Всего получено', remaining: 'Остаток долга', overdue: 'Просрочено', active: 'Активный', completed: 'Завершён', cancelled: 'Отменён' },
        kr: { title: 'Қарз аналитикаси', subtitle: 'Қарзлар бўйича батафсил статистика ва графиклар', monthlyTrend: 'Ойлик қарз динамикаси', statusDist: 'Ҳолат бўйича тақсимот', topDebtors: 'Топ қарздорлар', paymentTrend: 'Тўловлар динамикаси', lent: 'Берилган', borrowed: 'Олинган', noData: 'Маълумот йўқ', totalLent: 'Жами берилган', totalBorrowed: 'Жами олинган', remaining: 'Қолдиқ қарз', overdue: 'Муддати ўтган', active: 'Фаол', completed: 'Тугалланган', cancelled: 'Бекор қилинган' },
      };
      return t[l] || t.uz;
    },
  },

  async mounted() {
    await Promise.all([this.loadAnalytics(), this.loadReport()]);
    this.loading = false;
  },

  methods: {
    formatMoney(n) { return n ? Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    barWidth(val, max) { return Math.max(2, Math.round((parseFloat(val) || 0) / max * 100)); },
    statusLabel(s) {
      const map = { active: this.texts.active, completed: this.texts.completed, overdue: this.texts.overdue, cancelled: this.texts.cancelled };
      return map[s] || s;
    },

    async loadAnalytics() {
      try {
        const res = await this.$axios.$get('/finance/export/debt-analytics', { silent: true });
        if (res?.success) this.analytics = res.data;
      } catch (_) {}
    },

    async loadReport() {
      try {
        const res = await this.$axios.$get('/finance/export/monthly-report', { silent: true });
        if (res?.success) this.report = res.data;
      } catch (_) {}
    },

    exportDebts() {
      window.open(this.$axios.defaults.baseURL + '/finance/export/debts-excel', '_blank');
    },

    exportPdf() {
      window.print();
    },
  },
};
</script>
