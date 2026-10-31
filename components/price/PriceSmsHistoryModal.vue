<template>
  <PriceModalOverlay @close="closeSmsHistory">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4">
      <div class="flex items-start justify-between mb-5">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ texts.smsHistoryTitle }}</h3>
          <p class="text-xs text-gray-500 mt-0.5">{{ texts.smsHistorySubtitle }}</p>
        </div>
        <button @click="closeSmsHistory" class="text-gray-400 hover:text-gray-600 p-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div v-if="smsHistoryLoading" class="text-center py-10">
        <svg class="w-8 h-8 text-blue-500 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>

      <div v-else class="space-y-3">
        <!-- Kategoriya: click → blur fonli alohida oyna (SMS ro'yxati) -->
        <div v-for="cat in smsCats" :key="cat.type" class="rounded-xl overflow-hidden border" :class="cat.borderClass">
          <button type="button" @click="openSmsCat(cat)" class="w-full flex items-center justify-between p-4 transition-colors text-left" :class="cat.bgClass">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="cat.iconBg">
                <svg class="w-5 h-5" :class="cat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="cat.iconPath"/></svg>
              </div>
              <div class="min-w-0">
                <span class="block text-sm font-medium text-gray-900">{{ cat.label }}</span>
                <span v-if="cat.poolLine" class="block text-xs text-gray-500 mt-0.5">{{ cat.poolLine }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-xl font-bold tabular-nums" :class="cat.numColor">{{ cat.count }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>
        <!-- Jami yuborilgan -->
        <div class="pt-3 mt-2 border-t-2 border-dashed border-gray-200">
          <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl shadow-sm">
            <span class="text-sm font-bold text-white uppercase tracking-wide">{{ texts.smsCatTotal }}</span>
            <span class="text-2xl font-extrabold text-white tabular-nums">{{ smsTotalSent }}</span>
          </div>
        </div>
      </div>
    </div>
  </PriceModalOverlay>
</template>

<script>
// wave C: pages/price/index.vue dan ajratilgan (SMS xabarlar tarixi modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import PriceModalOverlay from '~/components/price/PriceModalOverlay.vue';

export default {
  name: 'PriceSmsHistoryModal',
  components: { PriceModalOverlay },
  props: {
    texts: { type: Object, required: true },
    smsHistoryLoading: { type: Boolean, default: false },
    smsCats: { type: Array, required: true },
    smsTotalSent: { type: Number, default: 0 },
  },
  methods: {
    closeSmsHistory() {
      this.$emit('close');
    },
    openSmsCat(cat) {
      this.$emit('open-cat', cat);
    },
  },
};
</script>
