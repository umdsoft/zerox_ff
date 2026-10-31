<template>
  <!-- Debts Tab -->
  <div>
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

</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'AnalyticsDebtsTab',
  props: {
    formatMoney: { type: Function, default: undefined },
    debtData: { type: null, default: undefined },
    formatDate: { type: Function, default: undefined },
    getSourceIcon: { type: Function, default: undefined },
    getSourceLabel: { type: Function, default: undefined },
  },
};
</script>
