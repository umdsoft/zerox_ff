<template>
  <!-- Expenses Tab -->
  <div>
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
        <p class="text-2xl font-bold text-gray-900">{{ expenseData.transaction_count ?? expenseData.by_category?.length ?? 0 }}</p>
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
            <span class="font-semibold text-gray-900 w-28 text-right">{{ formatMoney(cat.total, true, cat.currency) }}</span>
          </div>
        </div>
      </div>

      <!-- Daily Trend Chart -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.daily_trend') }}</h3>
        <div v-if="expenseData.daily_expenses && expenseData.daily_expenses.length">
          <client-only>
            <apexchart type="bar" :height="256" :options="expenseDailyOptions" :series="expenseDailySeries" />
          </client-only>
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
          {{ $t('finance.no_expenses') }}
        </div>
      </div>
    </div>

  </div>

</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'AnalyticsExpensesTab',
  props: {
    formatMoney: { type: Function, default: undefined },
    expenseData: { type: null, default: undefined },
    getComparisonClass: { type: Function, default: undefined },
    getCategoryName: { type: Function, default: undefined },
    expenseDailyOptions: { type: null, default: undefined },
    expenseDailySeries: { type: null, default: undefined },
  },
};
</script>
