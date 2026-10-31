<template>
  <!-- Budget Tab -->
  <div>
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

</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'AnalyticsBudgetTab',
  props: {
    formatMoney: { type: Function, default: undefined },
    budgetData: { type: null, default: undefined },
    monthNames: { type: null, default: undefined },
    getBudgetBarWidth: { type: Function, default: undefined },
  },
};
</script>
