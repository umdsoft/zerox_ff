<template>
  <!-- SS-DEV (2026-09-24): TARIFLAR bo'limi (11-rasm) — navbar "Tariflar" shu yerga olib keladi.
       Ma'lumot `utils/pricingPlans.js` dan (pages/price bilan bir xil). -->
  <section id="pricing" class="py-16 lg:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{{ texts.pricing.title }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ texts.pricing.description }}</p>
      </div>

      <!-- SS-DEV (2026-09-24), hujjat-4 7-band (8-rasm): Free va Premium kartalari "Ommabop"
           (Start) kartasi USLUBIDA — bir xil chegara/soya, tepada rangli tasma, bir xil balandlik
           (flex-col + mt-auto tugma), pastda bir xil tugma. -->
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div
          v-for="p in plans"
          :key="p.key"
          class="bg-white rounded-2xl border overflow-hidden flex flex-col shadow-lg"
          :class="p.key === 'premium' ? 'border-purple-500' : p.key === 'start' ? 'border-blue-500' : 'border-gray-400'"
        >
          <div
            class="text-white text-center text-xs font-semibold py-1.5 uppercase tracking-wide"
            :class="p.key === 'premium' ? 'bg-purple-600' : p.key === 'start' ? 'bg-blue-600' : 'bg-gray-600'"
          >{{ p.popular ? p.popularText : p.name }}</div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="text-center">
              <span
                class="inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase"
                :class="p.key === 'premium' ? 'bg-purple-100 text-purple-700' : p.key === 'start' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'"
              >{{ p.name }}</span>
              <div class="mt-4">
                <span class="text-4xl font-bold text-gray-900">{{ p.priceText }}</span>
                <span class="text-gray-500 ml-1">UZS</span>
              </div>
              <p class="mt-1 text-sm font-medium" :class="p.key === 'premium' ? 'text-purple-600' : p.key === 'start' ? 'text-blue-600' : 'text-gray-500'">{{ p.smsText }}</p>
            </div>
            <!-- 11.10: funksiyalar bo'limlar bo'yicha — Qarz daftari (mavjud), Shaxsiy qarz, Shaxsiy moliya -->
            <p class="mt-6 text-xs font-semibold tracking-wide text-gray-500">{{ daftariTitle }}</p>
            <ul class="mt-3 space-y-3">
              <li v-for="f in p.featureTexts" :key="f" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-gray-700">{{ f }}</span>
              </li>
              <li v-for="f in p.disabledTexts" :key="'d' + f" class="flex items-start gap-3 opacity-40">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-gray-400 line-through">{{ f }}</span>
              </li>
            </ul>
            <plan-feature-groups :plan="p.key" />
            <!-- Bir xil tugma (hamma kartada, pastda) -->
            <nuxt-link
              :to="localePath({ name: 'auth-register' })"
              class="mt-auto block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors text-white"
              :class="p.key === 'premium' ? 'bg-purple-600 hover:bg-purple-700' : p.key === 'start' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-800'"
              style="margin-top: 1.5rem"
            >{{ p.key === 'free' ? texts.pricing.startFree : texts.pricing.choose }}</nuxt-link>
          </div>
        </div>
      </div>

      <!-- Qarz shartnomasi narxi (pages/price bilan bir xil) -->
      <div class="max-w-5xl mx-auto mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div class="flex-1">
          <p class="text-lg font-bold text-gray-900">{{ texts.pricing.contractTitle }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ texts.pricing.contractDesc }}</p>
        </div>
        <ul class="text-sm text-gray-700 space-y-1">
          <li v-for="c in contractPricing" :key="c" class="flex items-start gap-2"><span class="text-blue-500 mt-0.5">•</span><span>{{ c }}</span></li>
        </ul>
      </div>

      <!-- SS-DEV (2026-09-24), hujjat-4 7-band: "Tariflar sahifasi" havolasi OLIB TASHLANDI. -->
    </div>
  </section>
</template>

<script>
// wave D: components/LandingPage.vue dan ajratilgan bo'lim (markup baytma-bayt o'sha; matnlar `texts` prop orqali).
import PlanFeatureGroups from '~/components/pricing/PlanFeatureGroups.vue';
export default {
  name: 'LandingPricing',
  components: { PlanFeatureGroups },
  props: {
    texts: { type: Object, required: true },
    plans: { type: Array, required: true },
    daftariTitle: { type: String, default: '' },
    contractPricing: { type: Array, required: true },
  },
};
</script>
