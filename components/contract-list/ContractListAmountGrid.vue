<template>
  <div class="grid grid-cols-2 gap-3">
    <div class="bg-gray-50 rounded-xl p-3">
      <div class="text-xs text-gray-500 mb-1">{{ columnAmount }}</div>
      <div class="text-sm font-semibold text-gray-900">
        {{ $formatNumber(item.amount) }} {{ item.currency }}
      </div>
    </div>
    <div class="bg-orange-50 rounded-xl p-3">
      <div class="text-xs text-orange-600 mb-1">{{ columnResidual }}</div>
      <div class="text-sm font-semibold text-orange-700">
        {{ $formatNumber(item.residual_amount) }} {{ item.currency }}
      </div>
    </div>
  </div>
</template>

<script>
// wave C: mobil kartadagi 'summa / qoldiq' bloki (debt-list, credit-list, near-expiration da baytma-bayt bir xil edi).
export default {
  name: 'ContractListAmountGrid',
  props: {
    columnAmount: { type: null, default: undefined },
    columnResidual: { type: null, default: undefined },
    item: { type: null, default: undefined },
  },
};
</script>
