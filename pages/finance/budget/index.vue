<template>
  <div class="budget-page pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.budget') }}</h1>
    </div>

    <!-- Current Month Budget -->
    <div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button
            @click="changeMonth(-1)"
            class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 class="text-xl font-bold text-gray-900">{{ monthNames[selectedMonth - 1] }} {{ selectedYear }}</h2>
          <button
            @click="changeMonth(1)"
            class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <button
          @click="showBudgetModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
        >
          {{ currentBudget ? $t('finance.edit_budget') : $t('finance.set_budget') }}
        </button>
      </div>

      <!-- Budget Progress -->
      <div v-if="currentBudget">
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <p class="text-sm text-gray-500">{{ $t('finance.planned') }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatMoney(currentBudget.planned_amount) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <p class="text-sm text-gray-500">{{ $t('finance.spent') }}</p>
            <p class="text-2xl font-bold" :class="isOverBudget ? 'text-red-600' : 'text-blue-600'">
              {{ formatMoney(currentBudget.spent_amount) }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <p class="text-sm text-gray-500">{{ $t('finance.remaining') }}</p>
            <p class="text-2xl font-bold" :class="remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ formatMoney(remainingAmount) }}
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">{{ $t('finance.budget_used') }}</span>
            <span :class="usagePercentage > 100 ? 'text-red-600 font-medium' : usagePercentage > 80 ? 'text-yellow-600' : 'text-green-600'">
              {{ usagePercentage }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div
              class="h-4 rounded-full transition-all"
              :class="usagePercentage > 100 ? 'bg-red-500' : usagePercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'"
              :style="{ width: Math.min(usagePercentage, 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Daily Stats -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p class="text-sm text-gray-500">{{ $t('finance.daily_limit') }}</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatMoney(dailyLimit) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ $t('finance.days_remaining') }}</p>
            <p class="text-lg font-semibold text-gray-900">{{ daysRemaining }} {{ $t('common.days') }}</p>
          </div>
        </div>
      </div>

      <!-- No Budget Set -->
      <div v-else class="text-center py-8">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_budget') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('finance.no_budget_desc') }}</p>
        <button
          @click="showBudgetModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
        >
          {{ $t('finance.set_budget') }}
        </button>
      </div>
    </div>

    <!-- Yearly Stats -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.yearly_overview') }} {{ selectedYear }}</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.total_spent') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatMoney(yearlyStats.total_spent) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.total_planned') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatMoney(yearlyStats.total_planned) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.avg_monthly') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatMoney(yearlyStats.avg_monthly) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.months_over') }}</p>
          <p class="text-xl font-bold" :class="yearlyStats.months_over > 0 ? 'text-red-600' : 'text-green-600'">
            {{ yearlyStats.months_over || 0 }}
          </p>
        </div>
      </div>

      <!-- Monthly Chart -->
      <div class="space-y-3">
        <div
          v-for="m in monthlyData"
          :key="m.month"
          class="flex items-center"
        >
          <span class="w-16 text-sm text-gray-600">{{ monthNames[m.month - 1]?.substring(0, 3) }}</span>
          <div class="flex-1 mx-3">
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="h-3 rounded-full"
                :class="m.spent > m.planned && m.planned > 0 ? 'bg-red-500' : 'bg-green-500'"
                :style="{ width: getBarWidth(m) + '%' }"
              ></div>
            </div>
          </div>
          <span class="w-24 text-right text-sm font-medium">{{ formatMoney(m.spent, true) }}</span>
        </div>
      </div>
    </div>

    <!-- Budget Modal -->
    <div v-if="showBudgetModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showBudgetModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ $t('finance.set_budget_for') }} {{ monthNames[selectedMonth - 1] }} {{ selectedYear }}
        </h3>
        <form @submit.prevent="saveBudget">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.planned_amount') }}</label>
            <input
              v-model="budgetForm.planned_amount"
              type="number"
              required
              min="100000"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xl font-semibold"
              placeholder="5 000 000"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.alert_threshold') }} (%)</label>
            <input
              v-model="budgetForm.alert_threshold"
              type="number"
              min="50"
              max="100"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="80"
            />
            <p class="text-sm text-gray-500 mt-1">{{ $t('finance.alert_threshold_hint') }}</p>
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="showBudgetModal = false"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="budgetLoading"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium"
            >
              {{ budgetLoading ? $t('common.loading') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetPage',
  middleware: 'auth',

  data() {
    const now = new Date()
    return {
      currentBudget: null,
      yearlyStats: {
        total_spent: 0,
        total_planned: 0,
        avg_monthly: 0,
        months_over: 0
      },
      monthlyData: [],
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      showBudgetModal: false,
      budgetForm: {
        planned_amount: '',
        alert_threshold: 80
      },
      budgetLoading: false,
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

    usagePercentage() {
      if (!this.currentBudget || !this.currentBudget.planned_amount) return 0
      return Math.round((this.currentBudget.spent_amount / this.currentBudget.planned_amount) * 100)
    },

    remainingAmount() {
      if (!this.currentBudget) return 0
      return this.currentBudget.planned_amount - this.currentBudget.spent_amount
    },

    isOverBudget() {
      return this.currentBudget && this.currentBudget.spent_amount > this.currentBudget.planned_amount
    },

    daysRemaining() {
      const lastDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate()
      const today = new Date().getDate()
      return Math.max(0, lastDay - today)
    },

    dailyLimit() {
      if (!this.currentBudget || this.daysRemaining <= 0) return 0
      return Math.max(0, this.remainingAmount / this.daysRemaining)
    }
  },

  watch: {
    selectedMonth() {
      this.loadCurrentBudget()
    },
    selectedYear() {
      this.loadCurrentBudget()
      this.loadYearlyStats()
    }
  },

  async mounted() {
    await Promise.all([
      this.loadCurrentBudget(),
      this.loadYearlyStats()
    ])
  },

  methods: {
    async loadCurrentBudget() {
      try {
        this.loading = true
        const res = await this.$api.getBudgets({
          year: this.selectedYear,
          month: this.selectedMonth
        })
        if (res?.data?.success && res.data.data.length) {
          this.currentBudget = res.data.data.find(b => !b.category_id) || null
          if (this.currentBudget) {
            this.budgetForm.planned_amount = this.currentBudget.planned_amount
            this.budgetForm.alert_threshold = this.currentBudget.alert_threshold
          }
        } else {
          this.currentBudget = null
          this.budgetForm.planned_amount = ''
          this.budgetForm.alert_threshold = 80
        }
      } catch (error) {
        console.error('Load budget error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadYearlyStats() {
      try {
        const res = await this.$api.getBudgetStats({ year: this.selectedYear })
        if (res?.data?.success) {
          this.yearlyStats = res.data.data
          this.monthlyData = res.data.data.monthly || []
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },

    async saveBudget() {
      try {
        this.budgetLoading = true
        const res = await this.$api.saveBudget({
          month: this.selectedMonth,
          year: this.selectedYear,
          planned_amount: this.budgetForm.planned_amount,
          alert_threshold: this.budgetForm.alert_threshold
        })
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.budget_saved'))
          this.showBudgetModal = false
          await this.loadCurrentBudget()
          await this.loadYearlyStats()
        }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.budgetLoading = false
      }
    },

    changeMonth(delta) {
      let newMonth = this.selectedMonth + delta
      let newYear = this.selectedYear

      if (newMonth > 12) {
        newMonth = 1
        newYear++
      } else if (newMonth < 1) {
        newMonth = 12
        newYear--
      }

      this.selectedMonth = newMonth
      this.selectedYear = newYear
    },

    getBarWidth(m) {
      const max = Math.max(...this.monthlyData.map(x => x.spent || 0), 1)
      return ((m.spent || 0) / max) * 100
    },

    formatMoney(value, short = false) {
      if (!value) return '0 UZS'
      if (short && value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
      }
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    }
  }
}
</script>
