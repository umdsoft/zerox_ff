<template>
  <div class="finance-dashboard pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.title') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('finance.subtitle') }}</p>
      </div>
      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap gap-2 mt-4 md:mt-0">
        <nuxt-link
          :to="localePath({ name: 'finance-expenses-add' })"
          class="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          {{ $t('finance.add_expense') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath({ name: 'finance-debts-add' })"
          class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm"
        >
          <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ $t('finance.add_debt') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath({ name: 'finance-goals-add' })"
          class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm"
        >
          <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          {{ $t('finance.add_goal') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath({ name: 'finance-analytics' })"
          class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          {{ $t('finance.view_analytics') }}
        </nuxt-link>
      </div>
    </div>

    <!-- Financial Health Score -->
    <div class="health-score-card rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div class="relative z-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-semibold opacity-90">{{ $t('finance.health_score') }}</h2>
            <div class="flex items-baseline mt-2">
              <span class="text-6xl font-bold">{{ health.score }}</span>
              <span class="text-2xl ml-1 opacity-80">/100</span>
            </div>
            <p class="mt-2 text-green-100">{{ getHealthStatus(health.status) }}</p>
          </div>
          <div class="mt-6 md:mt-0 flex gap-3">
            <div class="health-stat-card rounded-xl px-5 py-4 min-w-[140px]">
              <p class="text-sm text-green-100 mb-1">{{ $t('finance.total_debt') }}</p>
              <p class="text-xl font-bold">{{ formatMoney(health.factors?.debt_level || 0) }}</p>
            </div>
            <div class="health-stat-card rounded-xl px-5 py-4 min-w-[140px]">
              <p class="text-sm text-green-100 mb-1">{{ $t('finance.overdue_count') }}</p>
              <p class="text-xl font-bold">{{ health.factors?.overdue_debts || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Borrowed (Olingan qarzlar) -->
      <nuxt-link :to="localePath({ name: 'finance-debts', query: { type: 'borrowed' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border-l-4 border-red-500">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ $t('finance.borrowed') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('finance.total_borrowed') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.debts?.borrowed || 0) }}</p>
        </div>
      </nuxt-link>

      <!-- Lent (Berilgan qarzlar) -->
      <nuxt-link :to="localePath({ name: 'finance-debts', query: { type: 'lent' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border-l-4 border-green-500">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{{ $t('finance.lent') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('finance.total_lent') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.debts?.lent || 0) }}</p>
        </div>
      </nuxt-link>

      <!-- Monthly Expense -->
      <nuxt-link :to="localePath({ name: 'finance-expenses' })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border-l-4 border-blue-500">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{{ $t('finance.this_month') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('finance.monthly_expense') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.expenses?.monthly_total || 0) }}</p>
        </div>
      </nuxt-link>

      <!-- Goals Progress -->
      <nuxt-link :to="localePath({ name: 'finance-goals' })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border-l-4 border-purple-500">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{{ dashboard.goals?.active_count || 0 }} {{ $t('finance.active') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('finance.goals_progress') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ dashboard.goals?.progress || 0 }}%</p>
        </div>
      </nuxt-link>
    </div>

    <!-- Budget Progress -->
    <div v-if="dashboard.budget" class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.monthly_budget') }}</h3>
        <nuxt-link :to="localePath({ name: 'finance-budget' })" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {{ $t('common.details') }} →
        </nuxt-link>
      </div>
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600">{{ formatMoney(dashboard.budget.spent) }} / {{ formatMoney(dashboard.budget.planned) }}</span>
          <span :class="dashboard.budget.percentage > 100 ? 'text-red-600' : 'text-green-600'">
            {{ dashboard.budget.percentage }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all"
            :class="dashboard.budget.percentage > 100 ? 'bg-red-500' : dashboard.budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'"
            :style="{ width: Math.min(dashboard.budget.percentage, 100) + '%' }"
          ></div>
        </div>
      </div>
      <p class="text-sm text-gray-500">
        {{ $t('finance.remaining') }}: <span class="font-semibold text-gray-900">{{ formatMoney(dashboard.budget.remaining) }}</span>
      </p>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upcoming Payments -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.upcoming_payments') }}</h3>
        </div>
        <div v-if="dashboard.debts?.upcoming?.length" class="space-y-3">
          <div
            v-for="debt in dashboard.debts.upcoming"
            :key="debt.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
          >
            <div>
              <p class="font-medium text-gray-900">{{ debt.person_name }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(debt.due_date) }}</p>
            </div>
            <p class="font-semibold" :class="debt.type === 'borrowed' ? 'text-red-600' : 'text-green-600'">
              {{ formatMoney(debt.remaining_amount) }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p>{{ $t('finance.no_upcoming') }}</p>
        </div>
      </div>

      <!-- Top Categories - Pie Chart -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.top_categories') }}</h3>
        </div>
        <div v-if="dashboard.expenses?.top_categories?.length">
          <client-only>
            <apexchart
              type="pie"
              :height="280"
              :options="categoryChartOptions"
              :series="categoryChartSeries"
            />
          </client-only>
          <!-- Legend with amounts -->
          <div class="mt-4 space-y-2">
            <div
              v-for="(cat, index) in dashboard.expenses.top_categories"
              :key="cat.name"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center">
                <span
                  class="w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: chartColors[index % chartColors.length] }"
                ></span>
                <span class="text-gray-700">{{ getCategoryName(cat.name) }}</span>
              </div>
              <span class="font-medium text-gray-900">{{ formatMoney(cat.total) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <p>{{ $t('finance.no_expenses') }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Expenses -->
    <div class="bg-white rounded-2xl p-6 shadow-sm mt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.recent_expenses') }}</h3>
        <nuxt-link :to="localePath({ name: 'finance-expenses' })" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {{ $t('common.all') }} →
        </nuxt-link>
      </div>
      <div v-if="dashboard.expenses?.recent?.length" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-gray-500 border-b">
              <th class="pb-3 font-medium">{{ $t('finance.category') }}</th>
              <th class="pb-3 font-medium">{{ $t('finance.description') }}</th>
              <th class="pb-3 font-medium">{{ $t('finance.date') }}</th>
              <th class="pb-3 font-medium text-right">{{ $t('finance.amount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="expense in dashboard.expenses.recent"
              :key="expense.id"
              class="border-b last:border-0"
            >
              <td class="py-3">
                <div class="flex items-center">
                  <span class="text-xl mr-2">{{ expense.category?.icon || '📦' }}</span>
                  <span class="font-medium">{{ getCategoryName(expense.category?.name) || $t('finance.other') }}</span>
                </div>
              </td>
              <td class="py-3 text-gray-600">{{ expense.description || '-' }}</td>
              <td class="py-3 text-gray-500">{{ formatDate(expense.expense_date) }}</td>
              <td class="py-3 text-right font-semibold">{{ formatMoney(expense.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-gray-400">
        <p>{{ $t('finance.no_expenses') }}</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'FinanceDashboard',
  middleware: 'auth',

  data() {
    return {
      dashboard: {
        debts: {},
        expenses: {},
        budget: null,
        goals: {}
      },
      health: {
        score: 0,
        status: 'good',
        factors: {}
      },
      loading: true,
      chartColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
    }
  },

  computed: {
    // PIE chart series - faqat summalar
    categoryChartSeries() {
      if (!this.dashboard.expenses?.top_categories?.length) return []
      return this.dashboard.expenses.top_categories.map(cat => parseFloat(cat.total) || 0)
    },

    // PIE chart options
    categoryChartOptions() {
      const labels = this.dashboard.expenses?.top_categories?.map(cat => this.getCategoryName(cat.name)) || []
      return {
        chart: {
          type: 'pie',
          fontFamily: 'inherit'
        },
        labels,
        colors: this.chartColors,
        legend: {
          show: false // Biz o'zimiz legend qilamiz
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toFixed(0) + '%'
        },
        tooltip: {
          y: {
            formatter: (val) => this.formatMoney(val)
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height: 250
            }
          }
        }]
      }
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        const [dashboardRes, healthRes] = await Promise.all([
          this.$api.getFinanceDashboard(),
          this.$api.getFinancialHealth()
        ])

        if (dashboardRes?.data?.success) {
          this.dashboard = dashboardRes.data.data
        }
        if (healthRes?.data?.success) {
          this.health = healthRes.data.data
        }
      } catch (error) {
        console.error('Finance dashboard error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    getHealthStatus(status) {
      const statuses = {
        excellent: this.$t('finance.health_excellent'),
        good: this.$t('finance.health_good'),
        fair: this.$t('finance.health_fair'),
        poor: this.$t('finance.health_poor')
      }
      return statuses[status] || status
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
.health-score-card {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #0d9488 100%);
  box-shadow: 0 10px 40px -10px rgba(5, 150, 105, 0.4);
}

.health-stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.text-green-100 {
  color: rgba(209, 250, 229, 0.9);
}
</style>
