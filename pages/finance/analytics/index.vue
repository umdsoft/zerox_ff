<template>
  <div class="analytics-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <!-- 30.09 (doc1 14-rasm): matnli "← Orqaga" O'RNIGA Qarz shartnomasi / Qarz daftaridagidek kvadrat tugma -->
        <div class="flex items-center gap-3">
          <PageBackButton :to="localePath({ name: 'finance' })" />
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ calendarOnly ? $t('finance.tab_calendar') : $t('finance.analytics_title') }}</h1>
        </div>
        <p v-if="!calendarOnly" class="text-gray-500 mt-1">{{ $t('finance.analytics_subtitle') }}</p>
      </div>
      <!-- Period Selector (Hisobot/trend tabida yashiriladi — u yerda o'z boshqaruvi bor) -->
      <div v-if="activeTab !== 'trend'" class="flex items-center gap-3 mt-4 md:mt-0">
        <select
          v-model="selectedMonth"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="(name, idx) in monthNames" :key="idx" :value="idx + 1">
            {{ name }}
          </option>
        </select>
        <select
          v-model="selectedYear"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <!-- Aqlli tavsiyalar bloki olib tashlandi — u "Tavsiyalar" bo'limida (finance-advice) mavjud -->

    <!-- Tab Navigation (SS10: only=1 rejimida yashiriladi — faqat Kalendar ko'rsatiladi) -->
    <div class="bg-white rounded-2xl shadow-sm mb-6">
      <div v-if="!calendarOnly" class="flex border-b overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors"
          :class="activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
    <AnalyticsIncomesTab
      v-if="activeTab === 'incomes'"
      :format-money="formatMoney"
      :income-data="incomeData"
      :get-category-name="getCategoryName"
      :income-daily-options="incomeDailyOptions"
      :income-daily-series="incomeDailySeries"
    />
    <AnalyticsExpensesTab
      v-if="activeTab === 'expenses'"
      :format-money="formatMoney"
      :expense-data="expenseData"
      :get-comparison-class="getComparisonClass"
      :get-category-name="getCategoryName"
      :expense-daily-options="expenseDailyOptions"
      :expense-daily-series="expenseDailySeries"
    />
    <AnalyticsDebtsTab
      v-if="activeTab === 'debts'"
      :format-money="formatMoney"
      :debt-data="debtData"
      :format-date="formatDate"
      :get-source-icon="getSourceIcon"
      :get-source-label="getSourceLabel"
    />
    <AnalyticsBudgetTab
      v-if="activeTab === 'budget'"
      :format-money="formatMoney"
      :budget-data="budgetData"
      :month-names="monthNames"
      :get-budget-bar-width="getBudgetBarWidth"
    />
    <AnalyticsGoalsTab v-if="activeTab === 'goals'" :goal-data="goalData" :format-money="formatMoney" />
    <AnalyticsCalendarTab
      v-if="activeTab === 'calendar'"
      :calendar-type="calendarType"
      :set-calendar-type="setCalendarType"
      :month-names="monthNames"
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
      :calendar-total="calendarTotal"
      :week-days="weekDays"
      :calendar-cells="calendarCells"
      :open-day="openDay"
      :format-compact="formatCompact"
    />
    <AnalyticsTrendTab
      v-if="activeTab === 'trend'"
      :trend-period-value.sync="trendPeriod"
      :selected-month-value.sync="selectedMonth"
      :month-names="monthNames"
      :trend-quarter-value.sync="trendQuarter"
      :selected-year-value.sync="selectedYear"
      :available-years="availableYears"
      :trend-start-date-value.sync="trendStartDate"
      :trend-end-date-value.sync="trendEndDate"
      :downloading-trend="downloadingTrend"
      :download-excel="downloadExcel"
      :health="health"
      :health-style="healthStyle"
      :health-message="healthMessage"
      :signed="signed"
      :has-trend-data="hasTrendData"
      :trend-chart-options="trendChartOptions"
      :trend-chart-series="trendChartSeries"
    />
      </div>
    </div>

    <AnalyticsDayModal
      v-if="showDayModal"
      :day-modal-title="dayModalTitle"
      :day-modal-type="dayModalType"
      :day-modal-total="dayModalTotal"
      :day-modal-loading="dayModalLoading"
      :day-modal-items="dayModalItems"
      :get-category-name="getCategoryName"
    />
  </div>
</template>

<script>
import AnalyticsIncomesTab from '~/components/analytics/AnalyticsIncomesTab.vue';
import AnalyticsExpensesTab from '~/components/analytics/AnalyticsExpensesTab.vue';
import AnalyticsDebtsTab from '~/components/analytics/AnalyticsDebtsTab.vue';
import AnalyticsBudgetTab from '~/components/analytics/AnalyticsBudgetTab.vue';
import AnalyticsGoalsTab from '~/components/analytics/AnalyticsGoalsTab.vue';
import AnalyticsCalendarTab from '~/components/analytics/AnalyticsCalendarTab.vue';
import AnalyticsTrendTab from '~/components/analytics/AnalyticsTrendTab.vue';
import AnalyticsDayModal from '~/components/analytics/AnalyticsDayModal.vue';
import PageBackButton from '@/components/ui/PageBackButton.vue' // 30.09 (doc1 14-rasm): Qarz daftari uslubidagi kvadrat "Orqaga"
import DownloadButton from '@/components/ui/DownloadButton.vue' // 30.09 (doc1 13-rasm): umumiy "Yuklab olish" chip'i
import analyticsViewMixin from '~/mixins/analyticsViewMixin.js';
import analyticsLoadMixin from '~/mixins/analyticsLoadMixin.js';
import analyticsFormatMixin from '~/mixins/analyticsFormatMixin.js';
export default {
  components: { AnalyticsIncomesTab, AnalyticsExpensesTab, AnalyticsDebtsTab, AnalyticsBudgetTab, AnalyticsGoalsTab, AnalyticsCalendarTab, AnalyticsTrendTab, AnalyticsDayModal, DownloadButton, PageBackButton },
  name: 'FinanceAnalytics',
  mixins: [analyticsViewMixin, analyticsLoadMixin, analyticsFormatMixin],
  middleware: 'auth',

  data() {
    const now = new Date()
    // SS10: "Kalendar" endi Shaxsiy moliya asosiy bo'limidan ochiladi (?tab=calendar&only=1).
    // only=1 bo'lsa — faqat kalendar ko'rsatiladi (Tahlil tab-lentasi yashiriladi).
    const q = (this.$route && this.$route.query) || {}
    const validTabs = ['incomes', 'expenses', 'debts', 'budget', 'goals', 'calendar', 'trend']
    return {
      activeTab: validTabs.includes(q.tab) ? q.tab : 'incomes',
      calendarOnly: q.tab === 'calendar' && q.only === '1',
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      insights: [],
      incomeData: {},
      expenseData: {},
      debtData: {},
      budgetData: {},
      goalData: {},
      calendarType: 'expense',
      calendarDaily: {},
      weekDays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
      // R12: kalendar kuni tafsiloti modali
      showDayModal: false,
      dayModalLoading: false,
      dayModalItems: [],
      dayModalType: 'expense',
      dayModalDay: null,
      dayModalKey: '',
      dayModalTotal: 0,
      trend: [],
      health: null,
      downloadingTrend: false,
      // Excel eksport davri (oylik/choraklik/yillik/ixtiyoriy)
      trendPeriod: 'month',
      trendQuarter: Math.floor(now.getMonth() / 3) + 1,
      trendStartDate: '',
      trendEndDate: '',
      loading: true
    }
  },


  watch: {
    selectedMonth() {
      this.loadTabData()
    },
    selectedYear() {
      this.loadTabData()
    },
    activeTab() {
      this.loadTabData()
    }
  },

  async mounted() {
    // PERF: insights va tab ma'lumoti mustaqil — parallel (ilgari ketma-ket edi)
    await Promise.all([this.loadInsights(), this.loadTabData()])
  },

  methods: {
    // Kalendar uchun toggle almashtirish + qayta yuklash
    setCalendarType(type) {
      if (this.calendarType === type) {return}
      this.calendarType = type
      this.loadCalendar()
    },

    signed(value) {
      const n = Number(value) || 0
      const sign = n > 0 ? '+' : ''
      return sign + this.formatMoney(n)
    }
  }
}
</script>

<style scoped>
.insight-card {
  transition: transform 0.2s;
}

.insight-card:hover {
  transform: translateY(-2px);
}
</style>
