<template>
  <!-- Trend Tab (Trend / Hisobot) -->
  <div>
    <!-- Excel download (oylik / choraklik / yillik / ixtiyoriy muddat) -->
    <div class="bg-gray-50 rounded-2xl p-4 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('finance.reports_download_excel') }}</h3>
      <div class="flex flex-wrap items-end gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_period') }}</label>
          <select v-model="trendPeriod" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
            <option value="month">{{ $t('finance.reports_period_month') }}</option>
            <option value="quarter">{{ $t('finance.reports_period_quarter') }}</option>
            <option value="year">{{ $t('finance.reports_period_year') }}</option>
            <option value="custom">{{ $t('finance.reports_period_custom') }}</option>
          </select>
        </div>
        <div v-if="trendPeriod === 'month'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.date') }}</label>
          <select v-model="selectedMonth" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
            <option v-for="(name, idx) in monthNames" :key="idx" :value="idx + 1">{{ name }}</option>
          </select>
        </div>
        <div v-if="trendPeriod === 'quarter'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_quarter') }}</label>
          <select v-model="trendQuarter" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
            <option v-for="q in 4" :key="q" :value="q">{{ q }}-{{ $t('finance.reports_quarter') }}</option>
          </select>
        </div>
        <div v-if="trendPeriod !== 'custom'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_period_year') }}</label>
          <select v-model="selectedYear" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div v-if="trendPeriod === 'custom'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_start_date') }}</label>
          <input v-model="trendStartDate" v-mask="'##.##.####'" type="text" inputmode="numeric" placeholder="KK.OO.YYYY" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div v-if="trendPeriod === 'custom'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_end_date') }}</label>
          <input v-model="trendEndDate" v-mask="'##.##.####'" type="text" inputmode="numeric" placeholder="KK.OO.YYYY" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500" />
        </div>
        <!-- 30.09 (doc1 13-rasm): katta yashil tugma O'RNIGA umumiy "Yuklab olish" chip'i -->
        <DownloadButton size="md" :loading="downloadingTrend" :title="$t('finance.reports_download_excel')" @click="downloadExcel()" />
      </div>
    </div>

    <!-- Financial health -->
    <div
      v-if="health"
      class="rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
      :style="healthStyle"
    >
      <div class="flex items-center gap-4">
        <div>
          <h2 class="text-lg font-semibold opacity-90">{{ $t('finance.reports_health_title') }}</h2>
          <p class="text-xl font-bold mt-1">{{ healthMessage }}</p>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <div class="bg-white/15 rounded-xl px-4 py-3">
          <p class="text-sm opacity-90">{{ $t('finance.reports_income_change') }}</p>
          <p class="text-lg font-bold">{{ signed(health.income_change) }}</p>
        </div>
        <div class="bg-white/15 rounded-xl px-4 py-3">
          <p class="text-sm opacity-90">{{ $t('finance.reports_expense_change') }}</p>
          <p class="text-lg font-bold">{{ signed(health.expense_change) }}</p>
        </div>
        <div class="bg-white/15 rounded-xl px-4 py-3">
          <p class="text-sm opacity-90">{{ $t('finance.reports_avg_net') }}</p>
          <p class="text-lg font-bold">{{ signed(health.avg_net_last3) }}</p>
        </div>
      </div>
    </div>

    <!-- Trend chart -->
    <div class="border border-gray-100 rounded-2xl p-4 md:p-6">
      <div class="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.reports_trend_title') }}</h3>
        <p class="text-xs text-gray-400">UZS</p>
      </div>
      <div v-if="hasTrendData">
        <client-only>
          <apexchart type="area" :height="320" :options="trendChartOptions" :series="trendChartSeries" />
        </client-only>
      </div>
      <div v-else class="text-center py-12 text-gray-400">
        <p>{{ $t('finance.reports_no_data') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
import DownloadButton from '@/components/ui/DownloadButton.vue' // 30.09 (doc1 13-rasm): umumiy "Yuklab olish" chip'i
export default {
  name: 'AnalyticsTrendTab',
  components: { DownloadButton },
  props: {
    trendPeriodValue: { type: null, default: undefined },
    selectedMonthValue: { type: null, default: undefined },
    monthNames: { type: null, default: undefined },
    trendQuarterValue: { type: null, default: undefined },
    selectedYearValue: { type: null, default: undefined },
    availableYears: { type: null, default: undefined },
    trendStartDateValue: { type: null, default: undefined },
    trendEndDateValue: { type: null, default: undefined },
    downloadingTrend: { type: null, default: undefined },
    downloadExcel: { type: Function, default: undefined },
    health: { type: null, default: undefined },
    healthStyle: { type: null, default: undefined },
    healthMessage: { type: null, default: undefined },
    signed: { type: Function, default: undefined },
    hasTrendData: { type: null, default: undefined },
    trendChartOptions: { type: null, default: undefined },
    trendChartSeries: { type: null, default: undefined },
  },
  computed: {
    trendPeriod: {
      get() { return this.trendPeriodValue; },
      set(v) { this.$emit('update:trendPeriodValue', v); },
    },
    selectedMonth: {
      get() { return this.selectedMonthValue; },
      set(v) { this.$emit('update:selectedMonthValue', v); },
    },
    trendQuarter: {
      get() { return this.trendQuarterValue; },
      set(v) { this.$emit('update:trendQuarterValue', v); },
    },
    selectedYear: {
      get() { return this.selectedYearValue; },
      set(v) { this.$emit('update:selectedYearValue', v); },
    },
    trendStartDate: {
      get() { return this.trendStartDateValue; },
      set(v) { this.$emit('update:trendStartDateValue', v); },
    },
    trendEndDate: {
      get() { return this.trendEndDateValue; },
      set(v) { this.$emit('update:trendEndDateValue', v); },
    },
  },
};
</script>
