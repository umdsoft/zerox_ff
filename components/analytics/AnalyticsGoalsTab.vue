<template>
  <!-- Goals Tab -->
  <div>
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

</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'AnalyticsGoalsTab',
  props: {
    goalData: { type: null, default: undefined },
    formatMoney: { type: Function, default: undefined },
  },
};
</script>
