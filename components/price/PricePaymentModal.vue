<template>
  <PriceModalOverlay @close="closePayment">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
      <div class="flex items-start justify-between mb-5">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ texts.payTitle }}</h3>
          <p class="text-xs text-gray-500 mt-0.5">{{ paymentTargetLabel }}</p>
        </div>
        <button @click="closePayment" class="text-gray-400 hover:text-gray-600 p-1" :disabled="paymentLoading">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="space-y-3">
        <!-- Click (BIRINCHI — user talabiga ko'ra) -->
        <button
          @click="choosePayment('click')"
          :disabled="paymentLoading"
          class="w-full flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-md disabled:opacity-50"
        >
          <div class="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <img src="@/assets/img/click2.png" alt="Click" class="h-8 object-contain" />
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-semibold text-gray-900">Click</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ texts.payViaClick }}</p>
          </div>
          <svg v-if="paymentLoading && paymentMethod === 'click'" class="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <!-- Payme (IKKINCHI) -->
        <button
          @click="choosePayment('payme')"
          :disabled="paymentLoading"
          class="w-full flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-md disabled:opacity-50"
        >
          <div class="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <img src="https://cdn.payme.uz/logo/payme_color.png" alt="Payme" class="h-8 object-contain" />
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-semibold text-gray-900">Payme</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ texts.payViaPayme }}</p>
          </div>
          <svg v-if="paymentLoading && paymentMethod === 'payme'" class="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </PriceModalOverlay>
</template>

<script>
// wave C: pages/price/index.vue dan ajratilgan (to'lov usuli (Click / Payme) modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import PriceModalOverlay from '~/components/price/PriceModalOverlay.vue';

export default {
  name: 'PricePaymentModal',
  components: { PriceModalOverlay },
  props: {
    texts: { type: Object, required: true },
    paymentTargetLabel: { type: String, default: '' },
    paymentLoading: { type: Boolean, default: false },
    paymentMethod: { type: String, default: null },
  },
  methods: {
    closePayment() {
      this.$emit('close');
    },
    choosePayment(method) {
      this.$emit('choose', method);
    },
  },
};
</script>
