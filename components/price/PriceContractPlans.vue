<template>
    <!-- ==================== QARZ SHARTNOMASI TARIFLARI ==================== -->
    <div class="max-w-5xl mx-auto px-4 mt-14">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ texts.contractSectionTitle }}</h2>
          <p class="text-sm text-gray-500">{{ texts.contractSectionDesc }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <!-- 1) Bepul shartnomalar (birinchi, yashilda) -->
          <div class="p-6">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p class="text-2xl font-bold text-green-600">{{ texts.contractFullyFree }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ texts.contractFreeForAll }}</p>
          </div>
          <!-- 2) Shartnoma narxi — 3 tier ro'yxat (0.1% alohida ko'rsatilmaydi) -->
          <div class="p-6">
            <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-2">{{ texts.contractPriceTitle }}</p>
            <ul class="space-y-1 text-sm text-gray-700">
              <li class="flex items-start gap-2">
                <span class="text-indigo-500 mt-1">•</span>
                <span><span class="text-gray-500">1 mln so'mgacha —</span> <span class="font-semibold">1 000 UZS</span></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-500 mt-1">•</span>
                <span><span class="text-gray-500">1 mln dan 100 mln so'mgacha —</span> <span class="font-semibold">0.1%</span></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-500 mt-1">•</span>
                <span><span class="text-gray-500">100 mln so'mdan ortiq —</span> <span class="font-semibold">100 000 UZS</span></span>
              </li>
            </ul>
          </div>
        </div>
        <!-- SS-DEV (2026-09-24): "Hisobni to'ldirish" tugmasi OLIB TASHLANDI (9-rasm). -->
        <div class="bg-indigo-50 px-6 py-4">
          <p class="text-sm text-indigo-800">{{ texts.contractPayFrom }}</p>
        </div>
      </div>
    </div>
</template>

<script>
// wave D: pages/price/index.vue dan ajratilgan (Qarz shartnomasi narxlari — statik blok).
export default {
  name: 'PriceContractPlans',
  props: {
    texts: { type: Object, required: true },
  },
};
</script>
