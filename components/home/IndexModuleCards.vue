<template>
  <!-- SECTION 3: Module Overview Cards -->
  <div class="mt-6 lg:mt-8">
    <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.modulesOverview }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      <!-- Qarz Shartnomasi -->
      <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="block group">
        <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">{{ texts.contractModule }}</h3>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <!-- Debitor/Kreditor: shartnoma SONI emas, qoldiq SUMMA (UZS/USD alohida) -->
            <div class="bg-green-50 rounded-xl p-3">
              <p class="text-lg font-bold text-green-700">{{ formatShort(contractDebitorUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-bold text-green-700">{{ formatShort(contractDebitorUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
              <p class="text-xs text-gray-500">{{ texts.lent }}</p>
            </div>
            <div class="bg-red-50 rounded-xl p-3">
              <p class="text-lg font-bold text-red-700">{{ formatShort(contractCreditorUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-bold text-red-700">{{ formatShort(contractCreditorUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
              <p class="text-xs text-gray-500">{{ texts.borrowed }}</p>
            </div>
          </div>
        </div>
      </nuxt-link>

      <!-- Qarz Daftari -->
      <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="block group">
        <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">{{ texts.debtModule }}</h3>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <!-- Qarz daftari: berilgan BIRINCHI, olingan IKKINCHI — combinedStats (/qarz-daftari/dashboard) dan -->
            <div class="bg-green-50 rounded-xl p-3">
              <p class="text-lg font-bold text-green-700">{{ formatShort(daftariBerilganUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-bold text-green-700">{{ formatShort(daftariBerilganUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
              <p class="text-xs text-gray-500">{{ texts.lent }}</p>
            </div>
            <div class="bg-red-50 rounded-xl p-3">
              <p class="text-lg font-bold text-red-700">{{ formatShort(daftariOlinganUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-bold text-red-700">{{ formatShort(daftariOlinganUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
              <p class="text-xs text-gray-500">{{ texts.borrowed }}</p>
            </div>
          </div>
        </div>
      </nuxt-link>

      <!-- Shaxsiy qarz (+ 22.10: ostida "Qarzdan chiqish" satri — /home/analytics → debtPlan) -->
      <div class="flex flex-col gap-2">
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="block group flex-1">
        <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">{{ ratioTexts.shaxsiy }}</h3>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <!-- Berilgan/Olingan shaxsiy qarz: UZS katta + USD kichik -->
            <div class="bg-green-50 rounded-xl p-3">
              <p class="text-lg font-bold text-green-700">{{ formatShort(personalLentUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-bold text-green-700">{{ formatShort(personalLentUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
              <p class="text-xs text-gray-500">{{ texts.lent }}</p>
            </div>
            <div class="bg-red-50 rounded-xl p-3">
              <p class="text-lg font-bold text-red-700">{{ formatShort(personalBorrowedUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-bold text-red-700">{{ formatShort(personalBorrowedUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
              <p class="text-xs text-gray-500">{{ texts.borrowed }}</p>
            </div>
          </div>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="debtPlanLine"
        :to="localePath({ name: 'finance-debt-plan' })"
        class="flex items-center justify-between gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-sm font-semibold text-emerald-800 transition-colors"
      >
        <span class="truncate">{{ debtPlanLine }}</span>
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
// wave D: pages/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'IndexModuleCards',
  props: {
    texts: { type: null, default: undefined },
    formatShort: { type: Function, default: undefined },
    contractDebitorUzs: { type: null, default: undefined },
    contractDebitorUsd: { type: null, default: undefined },
    contractCreditorUzs: { type: null, default: undefined },
    contractCreditorUsd: { type: null, default: undefined },
    daftariBerilganUzs: { type: null, default: undefined },
    daftariBerilganUsd: { type: null, default: undefined },
    daftariOlinganUzs: { type: null, default: undefined },
    daftariOlinganUsd: { type: null, default: undefined },
    ratioTexts: { type: null, default: undefined },
    personalLentUzs: { type: null, default: undefined },
    personalLentUsd: { type: null, default: undefined },
    personalBorrowedUzs: { type: null, default: undefined },
    personalBorrowedUsd: { type: null, default: undefined },
    debtPlanLine: { type: null, default: undefined },
  },
};
</script>

<style scoped src="../../assets/page-styles/index.css"></style>
