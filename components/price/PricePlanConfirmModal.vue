<template>
  <PriceModalOverlay @close="closePlanConfirm">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
      <div class="flex items-start justify-between mb-5">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ planConfirmTarget.kind === 'addon' ? texts.addonPurchaseTitle : texts.confirmPurchaseTitle }}</h3>
          <p class="text-xs text-gray-500 mt-0.5">{{ planConfirmTarget.kind === 'addon' ? texts.payAddonPrefix : texts.payPlanPrefix }} {{ planConfirmTarget.label }}</p>
        </div>
        <button @click="closePlanConfirm" class="text-gray-400 hover:text-gray-600 p-1" :disabled="purchaseLoading">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="space-y-3 mb-5">
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <span class="text-sm text-gray-600">{{ texts.currentBalance }}</span>
          <span :class="['text-base font-bold tabular-nums', balanceSufficient ? 'text-gray-900' : 'text-red-600']">{{ formatPrice(userBalance) }} UZS</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
          <span class="text-sm text-gray-600">{{ planConfirmTarget.kind === 'addon' ? texts.packagePrice : texts.tariffPrice }}</span>
          <span class="text-base font-bold text-blue-700 tabular-nums">{{ formatPrice(planConfirmTarget.price) }} UZS</span>
        </div>
        <div v-if="planConfirmPeriod" class="p-3 bg-indigo-50 rounded-xl">
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm text-gray-600">{{ texts.validity }}</span>
            <span class="text-sm font-bold text-indigo-700 tabular-nums">{{ fmtDate(planConfirmPeriod.start) }} — {{ fmtDate(planConfirmPeriod.end) }}</span>
          </div>
          <p v-if="planConfirmPeriod.extended" class="text-xs text-indigo-600 mt-1 leading-snug">{{ texts.renewHint }}</p>
          <p v-else-if="planConfirmPeriod.restarted" class="text-xs text-indigo-600 mt-1 leading-snug">{{ texts.restartHint }}</p>
        </div>
        <div v-if="balanceSufficient" class="flex items-center justify-between p-3 bg-green-50 rounded-xl">
          <span class="text-sm text-gray-600">{{ texts.afterPurchase }}</span>
          <span class="text-base font-bold text-green-700 tabular-nums">{{ formatPrice(userBalance - planConfirmTarget.price) }} UZS</span>
        </div>
        <div v-else class="flex items-center justify-between p-3 bg-red-50 rounded-xl">
          <span class="text-sm text-gray-600">{{ texts.shortfall }}</span>
          <span class="text-base font-bold text-red-700 tabular-nums">{{ formatPrice(balanceShortfall) }} UZS</span>
        </div>
      </div>

      <p v-if="balanceSufficient" class="text-xs text-gray-500 mb-4 leading-snug">{{ planConfirmTarget.kind === 'addon' ? texts.addonConfirmHint : texts.confirmHint }}</p>
      <p v-else class="text-xs text-red-500 mb-4 leading-snug">{{ texts.insufficientHint }}</p>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          @click="closePlanConfirm"
          :disabled="purchaseLoading"
        >{{ texts.cancel }}</button>
        <button
          v-if="balanceSufficient"
          type="button"
          @click="confirmPlanPurchase"
          :disabled="purchaseLoading"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center"
        >
          <svg v-if="purchaseLoading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          {{ purchaseLoading ? texts.processing : texts.confirmBtn }}
        </button>
        <button
          v-else
          type="button"
          @click="openTopupFromConfirm"
          class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          {{ texts.topUpBtn }}
        </button>
      </div>
    </div>
  </PriceModalOverlay>
</template>

<script>
// wave C: pages/price/index.vue dan ajratilgan (tarif/paket sotib olishni tasdiqlash modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import PriceModalOverlay from '~/components/price/PriceModalOverlay.vue';
import { groupThousands } from '~/utils/format';
import { fmtTariffDate } from '~/utils/priceCheckout';

export default {
  name: 'PricePlanConfirmModal',
  components: { PriceModalOverlay },
  props: {
    texts: { type: Object, required: true },
    planConfirmTarget: { type: Object, required: true },
    purchaseLoading: { type: Boolean, default: false },
    balanceSufficient: { type: Boolean, default: false },
    userBalance: { type: Number, default: 0 },
    balanceShortfall: { type: Number, default: 0 },
    planConfirmPeriod: { type: Object, default: null },
  },
  methods: {
    closePlanConfirm() {
      this.$emit('close');
    },
    confirmPlanPurchase() {
      this.$emit('confirm');
    },
    openTopupFromConfirm() {
      this.$emit('topup');
    },
    formatPrice(n) {
      return groupThousands(n);
    },
    fmtDate(value) {
      return fmtTariffDate(value);
    },
  },
};
</script>
