<template>
  <!-- Incomes Tab (Daromadlar) -->
  <div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-green-50 rounded-xl p-4">
        <p class="text-sm text-green-600">{{ $t('finance.total_income') }}</p>
        <p class="text-2xl font-bold text-green-700">{{ formatMoney(incomeData.total) }}</p>
      </div>
      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-sm text-gray-600">{{ $t('finance.daily_average') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatMoney(incomeData.daily_average) }}</p>
      </div>
      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-sm text-gray-600">{{ $t('finance.transaction_count') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ incomeData.transaction_count ?? incomeData.by_category?.length ?? 0 }}</p>
      </div>
      <div class="rounded-xl p-4" :class="incomeData.comparison?.change >= 0 ? 'bg-green-50' : 'bg-red-50'">
        <p class="text-sm">{{ $t('finance.vs_last_month') }}</p>
        <p class="text-2xl font-bold">
          {{ incomeData.comparison?.change >= 0 ? '+' : '' }}{{ formatMoney(incomeData.comparison?.change || 0) }}
        </p>
        <p class="text-sm">
          ({{ incomeData.comparison?.change_percent >= 0 ? '+' : '' }}{{ incomeData.comparison?.change_percent || 0 }}%)
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Category List -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.by_category') }}</h3>
        <div class="space-y-3">
          <div v-for="cat in incomeData.by_category" :key="cat.name" class="flex items-center">
            <span class="text-2xl w-10">{{ cat.icon || '💰' }}</span>
            <div class="flex-1 mx-3">
              <div class="flex justify-between mb-1">
                <span class="font-medium text-gray-900">{{ getCategoryName(cat.name) }}</span>
                <span class="text-gray-600">{{ cat.percent }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" :style="{ width: cat.percent + '%', backgroundColor: cat.color || '#10B981' }"></div>
              </div>
            </div>
            <span class="font-semibold text-gray-900 w-28 text-right">{{ formatMoney(cat.total, true, cat.currency) }}</span>
          </div>
          <div v-if="!incomeData.by_category?.length" class="text-center py-8 text-gray-400">{{ $t('finance.no_incomes') }}</div>
        </div>
      </div>

      <!-- Daily Trend Chart -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('finance.daily_trend') }}</h3>
        <div v-if="incomeData.daily_incomes && incomeData.daily_incomes.length">
          <client-only>
            <apexchart type="bar" :height="256" :options="incomeDailyOptions" :series="incomeDailySeries" />
          </client-only>
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
          {{ $t('finance.no_incomes') }}
        </div>
      </div>
    </div>

  </div>

</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'AnalyticsIncomesTab',
  props: {
    formatMoney: { type: Function, default: undefined },
    incomeData: { type: null, default: undefined },
    getCategoryName: { type: Function, default: undefined },
    incomeDailyOptions: { type: null, default: undefined },
    incomeDailySeries: { type: null, default: undefined },
  },
};
</script>
