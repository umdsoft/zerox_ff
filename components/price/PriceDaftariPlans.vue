<template>
  <div>
    <!-- ==================== QARZ DAFTARI TARIFLARI ==================== -->
    <div class="max-w-5xl mx-auto px-4 mb-5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ texts.daftariSectionTitle }}</h2>
          <p class="text-sm text-gray-500">{{ texts.daftariSectionDesc }}</p>
        </div>
      </div>
    </div>

    <!-- Tarif kartochkalari -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">

      <!-- FREE -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="p-6 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full uppercase">Free</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">0</span>
              <span class="text-gray-500 ml-1">UZS</span>
            </div>
                      </div>

          <ul class="mt-6 space-y-3">
            <li v-for="(f, i) in plansShared[0].items" :key="i" class="flex items-start gap-3" :class="f.on ? '' : 'opacity-40'">
              <svg v-if="f.on" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm" :class="f.on ? 'text-gray-700' : 'text-gray-400 line-through'">{{ f.text }}</span>
            </li>
          </ul>
        </div>

        <!-- SS-DEV (2026-09-24): "Joriy tarif" tugmasi OLIB TASHLANDI (9-rasm). -->
      </div>

      <!-- START -->
      <div class="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden flex flex-col relative">
        <div class="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-wide">
          {{ plansShared[1].popularText }}
        </div>
        <div class="p-6 pt-10 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">Start</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">99 000</span>
              <span class="text-gray-500 ml-1">UZS {{ texts.perMonth }}</span>
            </div>
                      </div>

          <ul class="mt-6 space-y-3">
            <li v-for="(f, i) in plansShared[1].items" :key="i" class="flex items-start gap-3" :class="f.on ? '' : 'opacity-40'">
              <svg v-if="f.on" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm" :class="f.on ? 'text-gray-700' : 'text-gray-400 line-through'">{{ f.text }}</span>
            </li>
          </ul>
        </div>

        <!-- 29.09: "Ulanish" tugmasi QAYTARILDI — 24.09 da (9-rasm) olib tashlangani sababli Start/Premium'ga
             ulanib bo'lmay qolgandi. Joriy tarif bo'lsa — muddatni uzaytirish (+1 oy). -->
        <div class="p-6 pt-0">
          <p v-if="isActivePlan('start') && subEnd" class="text-xs text-center text-green-700 font-medium mb-2">{{ texts.currentPlanBtn }} · {{ fmtDate(subEnd) }} {{ texts.activeUntil }}</p>
          <button
            v-if="currentPlan === 'premium'"
            type="button"
            disabled
            class="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-default"
          >{{ texts.hasHigherPlan }}</button>
          <button
            v-else
            type="button"
            :disabled="purchaseLoading"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            @click="$emit('purchase', 'start')"
          >{{ isActivePlan('start') ? texts.renewBtn : texts.buyBtn }}</button>
        </div>
      </div>

      <!-- PREMIUM -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="p-6 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">Premium</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">199 000</span>
              <span class="text-gray-500 ml-1">UZS {{ texts.perMonth }}</span>
            </div>
                      </div>

          <ul class="mt-6 space-y-3">
            <li v-for="(f, i) in plansShared[2].items" :key="i" class="flex items-start gap-3" :class="f.on ? '' : 'opacity-40'">
              <svg v-if="f.on" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm" :class="f.on ? 'text-gray-700' : 'text-gray-400 line-through'">{{ f.text }}</span>
            </li>
          </ul>
        </div>

        <!-- 29.09: "Ulanish" tugmasi QAYTARILDI (Start bilan bir xil oqim) -->
        <div class="p-6 pt-0">
          <p v-if="isActivePlan('premium') && subEnd" class="text-xs text-center text-green-700 font-medium mb-2">{{ texts.currentPlanBtn }} · {{ fmtDate(subEnd) }} {{ texts.activeUntil }}</p>
          <button
            type="button"
            :disabled="purchaseLoading"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            @click="$emit('purchase', 'premium')"
          >{{ isActivePlan('premium') ? texts.renewBtn : texts.buyBtn }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// wave D: pages/price/index.vue dan ajratilgan (Qarz daftari tarif kartochkalari).
import { fmtTariffDate } from '~/utils/priceCheckout';
export default {
  name: 'PriceDaftariPlans',
  props: {
    texts: { type: Object, required: true },
    plansShared: { type: Array, required: true },
    currentPlan: { type: String, default: 'free' },
    isGuest: { type: Boolean, default: false },
    subEnd: { type: null, default: null },
    purchaseLoading: { type: Boolean, default: false },
  },
  methods: {
    fmtDate(value) { return fmtTariffDate(value); },
    isActivePlan(plan) { return !this.isGuest && this.currentPlan === plan; },
  },
};
</script>
