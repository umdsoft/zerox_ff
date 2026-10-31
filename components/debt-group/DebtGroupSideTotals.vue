<template>
  <div v-if="side" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <p class="text-xs text-gray-500">{{ texts.totalDebt }}</p>
      <p v-for="c in sideTotals" :key="'st' + c.currency" class="text-lg font-bold text-gray-900 mt-0.5 leading-tight">{{ formatMoney(c.total, c.currency) }}</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <p class="text-xs text-gray-500">{{ side === 'lent' ? texts.collected : texts.repaid }}</p>
      <p v-for="c in sideTotals" :key="'sp' + c.currency" class="text-lg font-bold text-green-600 mt-0.5 leading-tight">{{ formatMoney(c.paid, c.currency) }}</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <p class="text-xs text-gray-500">{{ texts.remaining }}</p>
      <p v-for="c in sideTotals" :key="'sr' + c.currency" class="text-lg font-bold mt-0.5 leading-tight" :class="side === 'lent' ? 'text-blue-600' : 'text-red-600'">{{ formatMoney(c.left, c.currency) }}</p>
    </div>
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <p class="text-xs text-gray-500">{{ $t('l10n.pdg.total_taken') }}</p>
      <p v-for="c in totalsByCurrency" :key="'b' + c.currency" class="text-lg font-bold text-red-600 mt-0.5 leading-tight">{{ formatMoney(c.borrowed, c.currency) }}</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <p class="text-xs text-gray-500">{{ $t('l10n.pdg.total_given') }}</p>
      <p v-for="c in totalsByCurrency" :key="'l' + c.currency" class="text-lg font-bold text-green-600 mt-0.5 leading-tight">{{ formatMoney(c.lent, c.currency) }}</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <p class="text-xs text-gray-500">{{ $t('l10n.pdg.net_balance') }}</p>
      <p v-for="c in totalsByCurrency" :key="'n' + c.currency" class="text-lg font-bold mt-0.5 leading-tight" :class="c.net >= 0 ? 'text-green-600' : 'text-red-600'">
        {{ c.net >= 0 ? '+' : '-' }}{{ formatMoney(Math.abs(c.net), c.currency) }}
      </p>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/debts/group/_key.vue dan ajratilgan (kontragent bo'yicha 3 ta katak). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { formatMoneyCur } from '@/utils/helpers';
export default {
  name: 'DebtGroupSideTotals',
  props: {
    side: { type: null, default: undefined },
    sideTotals: { type: null, default: undefined },
    texts: { type: null, default: undefined },
    totalsByCurrency: { type: null, default: undefined },
  },
  methods: {
    formatMoney: formatMoneyCur,
  },
};
</script>
