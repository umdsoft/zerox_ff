<template>
  <div class="analytics-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.analytics_title') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('finance.analytics_subtitle') }}</p>
      </div>
      <!-- Period Selector -->
      <div class="flex items-center gap-3 mt-4 md:mt-0">
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

    <!-- Insights Section -->
    <div v-if="insights.length" class="mb-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.insights') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(insight, idx) in insights.slice(0, 6)"
          :key="idx"
          class="insight-card rounded-xl p-4"
          :class="getInsightClass(insight.type)"
        >
          <div class="flex items-start gap-3">
            <span class="text-2xl">{{ insight.icon }}</span>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ insight.title }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ insight.message }}</p>
              <p v-if="insight.value" class="text-sm font-medium mt-2" :class="getInsightValueClass(insight.type)">
                {{ formatInsightValue(insight) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-2xl shadow-sm mb-6">
      <div class="flex border-b overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors"
          :class="activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Expenses Tab -->
        <div v-if="activeTab === 'expenses'">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 rounded-xl p-4">
              <p class="text-sm text-blue-600">{{ $t('finance.total_spent') }}</p>
              <p class="text-2xl font-bold text-blue-700">{{ formatMoney(expenseData.total) }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600">{{ $t('finance.daily_average') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(expenseData.daily_average) }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600">{{ $t('finance.transaction_count') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ expenseData.by_category?.length || 0 }}</p>
            </div>
            <div class="rounded-xl p-4" :class="getComparisonClass(expenseData.comparison?.change)">
              <p class="text-sm">{{ $t('finance.vs_last_month') }}</p>
              <p class="text-2xl font-bold">
                {{ expenseData.comparison?.change >= 0 ? '+' : '' }}{{ formatMoney(expenseData.comparison?.change || 0) }}
              </p>
              <p class="text-sm">
                ({{ expenseData.comparison?.change_percent >= 0 ? '+' : '' }}{{ expenseData.comparison?.change_percent || 0 }}%)
              </p>
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Category List -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.by_category') }}</h3>
              <div class="space-y-3">
                <div
                  v-for="cat in expenseData.by_category"
                  :key="cat.name"
                  class="flex items-center"
                >
                  <span class="text-2xl w-10">{{ cat.icon || '📦' }}</span>
                  <div class="flex-1 mx-3">
                    <div class="flex justify-between mb-1">
                      <span class="font-medium text-gray-900">{{ getCategoryName(cat.name) }}</span>
                      <span class="text-gray-600">{{ cat.percent }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full"
                        :style="{ width: cat.percent + '%', backgroundColor: cat.color || '#3B82F6' }"
                      ></div>
                    </div>
                  </div>
                  <span class="font-semibold text-gray-900 w-28 text-right">{{ formatMoney(cat.total, true) }}</span>
                </div>
              </div>
            </div>

            <!-- Daily Trend Chart -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.daily_trend') }}</h3>
              <div class="h-64 flex items-end gap-1">
                <div
                  v-for="(day, idx) in expenseData.daily_expenses"
                  :key="idx"
                  class="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                  :style="{ height: getDailyBarHeight(day.total) + '%' }"
                >
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                    {{ formatDate(day.date) }}: {{ formatMoney(day.total, true) }}
                  </div>
                </div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>30 {{ $t('common.days') }} {{ $t('common.ago') }}</span>
                <span>{{ $t('common.today') }}</span>
              </div>
            </div>
          </div>

          <!-- Top Expenses -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.top_expenses') }}</h3>
            <div class="bg-gray-50 rounded-xl overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-100">
                  <tr class="text-left text-sm text-gray-600">
                    <th class="px-4 py-3 font-medium">{{ $t('finance.category') }}</th>
                    <th class="px-4 py-3 font-medium">{{ $t('finance.description') }}</th>
                    <th class="px-4 py-3 font-medium">{{ $t('finance.date') }}</th>
                    <th class="px-4 py-3 font-medium text-right">{{ $t('finance.amount') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="exp in expenseData.top_expenses"
                    :key="exp.id"
                    class="border-t border-gray-200"
                  >
                    <td class="px-4 py-3">
                      <span class="text-lg mr-2">{{ exp.category_icon || '📦' }}</span>
                      {{ getCategoryName(exp.category_name) || $t('finance.other') }}
                    </td>
                    <td class="px-4 py-3 text-gray-600">{{ exp.description || '-' }}</td>
                    <td class="px-4 py-3 text-gray-500">{{ formatDate(exp.expense_date) }}</td>
                    <td class="px-4 py-3 text-right font-semibold">{{ formatMoney(exp.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Debts Tab -->
        <div v-if="activeTab === 'debts'">
          <!-- Summary -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-red-50 rounded-xl p-4">
              <p class="text-sm text-red-600">{{ $t('finance.total_borrowed') }}</p>
              <p class="text-2xl font-bold text-red-700">{{ formatMoney(debtData.summary?.total_borrowed) }}</p>
            </div>
            <div class="bg-green-50 rounded-xl p-4">
              <p class="text-sm text-green-600">{{ $t('finance.total_lent') }}</p>
              <p class="text-2xl font-bold text-green-700">{{ formatMoney(debtData.summary?.total_lent) }}</p>
            </div>
            <div class="rounded-xl p-4" :class="debtData.summary?.net_balance >= 0 ? 'bg-green-50' : 'bg-red-50'">
              <p class="text-sm" :class="debtData.summary?.net_balance >= 0 ? 'text-green-600' : 'text-red-600'">{{ $t('finance.net_balance') }}</p>
              <p class="text-2xl font-bold" :class="debtData.summary?.net_balance >= 0 ? 'text-green-700' : 'text-red-700'">
                {{ formatMoney(debtData.summary?.net_balance) }}
              </p>
            </div>
            <div class="bg-yellow-50 rounded-xl p-4">
              <p class="text-sm text-yellow-600">{{ $t('finance.overdue_count') }}</p>
              <p class="text-2xl font-bold text-yellow-700">{{ debtData.summary?.overdue_count || 0 }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Upcoming Payments -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.upcoming_payments') }}</h3>
              <div v-if="debtData.upcoming_payments?.length" class="space-y-3">
                <div
                  v-for="payment in debtData.upcoming_payments"
                  :key="payment.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ payment.person_name }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(payment.due_date) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold" :class="payment.type === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                      {{ formatMoney(payment.remaining) }}
                    </p>
                    <span class="text-xs px-2 py-1 rounded-full" :class="payment.type === 'borrowed' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                      {{ payment.type === 'borrowed' ? $t('finance.borrowed') : $t('finance.lent') }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-400">
                <p>{{ $t('finance.no_upcoming') }}</p>
              </div>
            </div>

            <!-- Overdue Debts -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.overdue_debts') }}</h3>
              <div v-if="debtData.overdue_debts?.length" class="space-y-3">
                <div
                  v-for="debt in debtData.overdue_debts"
                  :key="debt.id"
                  class="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ debt.person_name }}</p>
                    <p class="text-sm text-red-600">{{ debt.days_overdue }} {{ $t('finance.days_overdue') }}</p>
                  </div>
                  <p class="font-semibold text-red-600">{{ formatMoney(debt.remaining) }}</p>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                <svg class="w-12 h-12 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-green-600">{{ $t('finance.no_overdue') }}</p>
              </div>
            </div>
          </div>

          <!-- By Source -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.by_source') }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="source in debtData.by_source"
                :key="source.source_type"
                class="bg-gray-50 rounded-xl p-4 text-center"
              >
                <span class="text-2xl">{{ getSourceIcon(source.source_type) }}</span>
                <p class="text-sm text-gray-600 mt-2">{{ getSourceLabel(source.source_type) }}</p>
                <p class="text-lg font-bold text-gray-900">{{ formatMoney(source.remaining, true) }}</p>
                <p class="text-xs text-gray-500">{{ source.count }} {{ $t('common.items') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Budget Tab -->
        <div v-if="activeTab === 'budget'">
          <!-- Yearly Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 rounded-xl p-4">
              <p class="text-sm text-blue-600">{{ $t('finance.total_planned') }}</p>
              <p class="text-2xl font-bold text-blue-700">{{ formatMoney(budgetData.yearly_stats?.total_planned) }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600">{{ $t('finance.total_spent') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(budgetData.yearly_stats?.total_spent) }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600">{{ $t('finance.avg_monthly') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(budgetData.yearly_stats?.average_monthly_spend) }}</p>
            </div>
            <div class="rounded-xl p-4" :class="budgetData.yearly_stats?.savings_rate >= 0 ? 'bg-green-50' : 'bg-red-50'">
              <p class="text-sm" :class="budgetData.yearly_stats?.savings_rate >= 0 ? 'text-green-600' : 'text-red-600'">{{ $t('finance.savings_rate') }}</p>
              <p class="text-2xl font-bold" :class="budgetData.yearly_stats?.savings_rate >= 0 ? 'text-green-700' : 'text-red-700'">
                {{ budgetData.yearly_stats?.savings_rate || 0 }}%
              </p>
            </div>
          </div>

          <!-- Monthly Chart -->
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.monthly_comparison') }}</h3>
          <div class="space-y-3">
            <div
              v-for="b in budgetData.yearly_budgets"
              :key="b.month"
              class="flex items-center"
            >
              <span class="w-20 text-sm text-gray-600">{{ monthNames[b.month - 1]?.substring(0, 3) }}</span>
              <div class="flex-1 mx-3">
                <div class="relative w-full bg-gray-200 rounded-full h-6">
                  <!-- Planned line -->
                  <div class="absolute top-0 left-0 h-full w-full flex items-center">
                    <div
                      class="h-6 rounded-full"
                      :class="b.spent_amount > b.planned_amount ? 'bg-red-400' : 'bg-green-400'"
                      :style="{ width: getBudgetBarWidth(b) + '%' }"
                    ></div>
                  </div>
                  <!-- Planned marker -->
                  <div
                    v-if="b.planned_amount > 0"
                    class="absolute top-0 h-full w-0.5 bg-blue-600"
                    :style="{ left: '100%' }"
                  ></div>
                </div>
              </div>
              <div class="w-32 text-right">
                <span class="font-medium" :class="b.spent_amount > b.planned_amount ? 'text-red-600' : 'text-green-600'">
                  {{ formatMoney(b.spent_amount, true) }}
                </span>
                <span class="text-gray-400 text-sm"> / {{ formatMoney(b.planned_amount, true) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals Tab -->
        <div v-if="activeTab === 'goals'">
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-purple-50 rounded-xl p-4">
              <p class="text-sm text-purple-600">{{ $t('finance.active_goals') }}</p>
              <p class="text-2xl font-bold text-purple-700">{{ goalData.stats?.active_goals || 0 }}</p>
            </div>
            <div class="bg-green-50 rounded-xl p-4">
              <p class="text-sm text-green-600">{{ $t('finance.completed_goals') }}</p>
              <p class="text-2xl font-bold text-green-700">{{ goalData.stats?.completed_goals || 0 }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600">{{ $t('finance.total_saved') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(goalData.stats?.total_saved) }}</p>
            </div>
            <div class="bg-blue-50 rounded-xl p-4">
              <p class="text-sm text-blue-600">{{ $t('finance.overall_progress') }}</p>
              <p class="text-2xl font-bold text-blue-700">{{ goalData.stats?.overall_progress || 0 }}%</p>
            </div>
          </div>

          <!-- Goals by Priority -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- High Priority -->
            <div>
              <h3 class="text-lg font-semibold text-red-600 mb-4 flex items-center">
                <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                {{ $t('finance.priority_high') }}
              </h3>
              <div v-if="goalData.by_priority?.high?.length" class="space-y-3">
                <div
                  v-for="goal in goalData.by_priority.high"
                  :key="goal.id"
                  class="bg-red-50 rounded-xl p-4"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">{{ goal.icon }}</span>
                    <span class="font-medium text-gray-900">{{ goal.title }}</span>
                  </div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">{{ formatMoney(goal.current_amount, true) }} / {{ formatMoney(goal.target_amount, true) }}</span>
                    <span class="font-medium text-red-600">{{ goal.progress }}%</span>
                  </div>
                  <div class="w-full bg-red-200 rounded-full h-2">
                    <div class="h-2 bg-red-500 rounded-full" :style="{ width: Math.min(goal.progress, 100) + '%' }"></div>
                  </div>
                  <p v-if="goal.monthly_needed" class="text-xs text-red-600 mt-2">
                    {{ $t('finance.monthly_need') }}: {{ formatMoney(goal.monthly_needed, true) }}
                  </p>
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-400 bg-gray-50 rounded-xl">
                <p>{{ $t('finance.no_goals') }}</p>
              </div>
            </div>

            <!-- Medium Priority -->
            <div>
              <h3 class="text-lg font-semibold text-yellow-600 mb-4 flex items-center">
                <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                {{ $t('finance.priority_medium') }}
              </h3>
              <div v-if="goalData.by_priority?.medium?.length" class="space-y-3">
                <div
                  v-for="goal in goalData.by_priority.medium"
                  :key="goal.id"
                  class="bg-yellow-50 rounded-xl p-4"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">{{ goal.icon }}</span>
                    <span class="font-medium text-gray-900">{{ goal.title }}</span>
                  </div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">{{ formatMoney(goal.current_amount, true) }} / {{ formatMoney(goal.target_amount, true) }}</span>
                    <span class="font-medium text-yellow-600">{{ goal.progress }}%</span>
                  </div>
                  <div class="w-full bg-yellow-200 rounded-full h-2">
                    <div class="h-2 bg-yellow-500 rounded-full" :style="{ width: Math.min(goal.progress, 100) + '%' }"></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-400 bg-gray-50 rounded-xl">
                <p>{{ $t('finance.no_goals') }}</p>
              </div>
            </div>

            <!-- Low Priority -->
            <div>
              <h3 class="text-lg font-semibold text-gray-600 mb-4 flex items-center">
                <span class="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                {{ $t('finance.priority_low') }}
              </h3>
              <div v-if="goalData.by_priority?.low?.length" class="space-y-3">
                <div
                  v-for="goal in goalData.by_priority.low"
                  :key="goal.id"
                  class="bg-gray-50 rounded-xl p-4"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">{{ goal.icon }}</span>
                    <span class="font-medium text-gray-900">{{ goal.title }}</span>
                  </div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">{{ formatMoney(goal.current_amount, true) }} / {{ formatMoney(goal.target_amount, true) }}</span>
                    <span class="font-medium text-gray-600">{{ goal.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 bg-gray-500 rounded-full" :style="{ width: Math.min(goal.progress, 100) + '%' }"></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-400 bg-gray-50 rounded-xl">
                <p>{{ $t('finance.no_goals') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceAnalytics',
  middleware: 'auth',

  data() {
    const now = new Date()
    return {
      activeTab: 'expenses',
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      insights: [],
      expenseData: {},
      debtData: {},
      budgetData: {},
      goalData: {},
      loading: true
    }
  },

  computed: {
    monthNames() {
      return [
        this.$t('months.january'),
        this.$t('months.february'),
        this.$t('months.march'),
        this.$t('months.april'),
        this.$t('months.may'),
        this.$t('months.june'),
        this.$t('months.july'),
        this.$t('months.august'),
        this.$t('months.september'),
        this.$t('months.october'),
        this.$t('months.november'),
        this.$t('months.december')
      ]
    },

    availableYears() {
      const currentYear = new Date().getFullYear()
      return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]
    },

    tabs() {
      return [
        { id: 'expenses', label: this.$t('finance.expenses') },
        { id: 'debts', label: this.$t('finance.personal_debts') },
        { id: 'budget', label: this.$t('finance.budget') },
        { id: 'goals', label: this.$t('finance.goals') }
      ]
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
    await this.loadInsights()
    await this.loadTabData()
  },

  methods: {
    async loadInsights() {
      try {
        const res = await this.$api.getFinanceInsights()
        if (res?.data?.success) {
          this.insights = res.data.data.insights || []
        }
      } catch (error) {
        console.error('Load insights error:', error)
      }
    },

    async loadTabData() {
      try {
        this.loading = true
        const params = { year: this.selectedYear, month: this.selectedMonth }

        switch (this.activeTab) {
          case 'expenses':
            const expRes = await this.$api.getExpenseAnalytics(params)
            if (expRes?.data?.success) {
              this.expenseData = expRes.data.data
            }
            break

          case 'debts':
            const debtRes = await this.$api.getDebtAnalytics()
            if (debtRes?.data?.success) {
              this.debtData = debtRes.data.data
            }
            break

          case 'budget':
            const budgetRes = await this.$api.getBudgetAnalytics({ year: this.selectedYear })
            if (budgetRes?.data?.success) {
              this.budgetData = budgetRes.data.data
            }
            break

          case 'goals':
            const goalRes = await this.$api.getGoalAnalytics()
            if (goalRes?.data?.success) {
              this.goalData = goalRes.data.data
            }
            break
        }
      } catch (error) {
        console.error('Load tab data error:', error)
      } finally {
        this.loading = false
      }
    },

    formatMoney(value, short = false) {
      if (!value) return '0 UZS'
      if (short && Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
      }
      if (short && Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(0) + 'K'
      }
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    getInsightClass(type) {
      const classes = {
        danger: 'bg-red-50 border border-red-200',
        warning: 'bg-yellow-50 border border-yellow-200',
        info: 'bg-blue-50 border border-blue-200',
        success: 'bg-green-50 border border-green-200'
      }
      return classes[type] || 'bg-gray-50'
    },

    getInsightValueClass(type) {
      const classes = {
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
        success: 'text-green-600'
      }
      return classes[type] || 'text-gray-600'
    },

    formatInsightValue(insight) {
      if (insight.category === 'expense' || insight.category === 'debt' || insight.category === 'goal') {
        return this.formatMoney(insight.value)
      }
      return insight.value
    },

    getComparisonClass(change) {
      if (change > 0) return 'bg-red-50'
      if (change < 0) return 'bg-green-50'
      return 'bg-gray-50'
    },

    getDailyBarHeight(total) {
      if (!this.expenseData.daily_expenses?.length) return 0
      const max = Math.max(...this.expenseData.daily_expenses.map(d => d.total || 0), 1)
      return (total / max) * 100
    },

    getBudgetBarWidth(budget) {
      if (!budget.planned_amount) return 0
      return Math.min((budget.spent_amount / budget.planned_amount) * 100, 100)
    },

    getSourceIcon(source) {
      const icons = {
        bank: '🏦',
        family: '👨‍👩‍👧',
        friend: '🤝',
        other: '📋'
      }
      return icons[source] || '📋'
    },

    getSourceLabel(source) {
      const labels = {
        bank: this.$t('finance.source_bank'),
        family: this.$t('finance.source_family'),
        friend: this.$t('finance.source_friend'),
        other: this.$t('finance.source_other')
      }
      return labels[source] || source
    },

    getCategoryName(name) {
      if (!name) return null
      const key = `finance.${name}`
      const translated = this.$t(key)
      if (translated === key) {
        return name
      }
      return translated
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
