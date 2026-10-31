<template>
    <!-- Qo'shimcha SMS paketlar -->
    <div class="max-w-5xl mx-auto px-4 mt-12">
      <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">{{ texts.addonTitle }}</h2>
      <p class="text-sm text-gray-500 text-center mb-6">{{ texts.addonDesc }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="pkg in addonPackages" :key="pkg.name"
          class="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow">
          <div class="text-2xl font-bold text-gray-900">{{ pkg.sms }}</div>
          <div class="text-sm text-gray-500 mb-3">SMS</div>
          <div class="text-lg font-semibold text-blue-600 mb-4">{{ formatPrice(pkg.price) }} UZS</div>
          <button
            :disabled="purchasing"
            class="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
            @click="$emit('purchase', pkg.name)"
          >
            {{ texts.buyAddon }}
          </button>
        </div>
      </div>
    </div>
</template>

<script>
// wave D: pages/price/index.vue dan ajratilgan (qo'shimcha SMS paketlar). Ko'rsatish sharti (v-if) sahifada.
import { groupThousands } from '~/utils/format';
export default {
  name: 'PriceAddonPackages',
  props: {
    texts: { type: Object, required: true },
    addonPackages: { type: Array, required: true },
    purchasing: { type: Boolean, default: false },
  },
  methods: {
    formatPrice(n) { return groupThousands(n); },
  },
};
</script>
