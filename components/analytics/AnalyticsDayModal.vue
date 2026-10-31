<template>
  <!-- R12: Kalendar kuni tafsiloti — o'sha kundagi xarajat/daromadlar ro'yxati -->
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="showDayModal = false"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl flex flex-col" style="max-height: 85vh;">
      <div class="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 class="text-base font-bold text-gray-900">{{ dayModalTitle }}</h3>
          <p class="text-sm font-semibold mt-0.5" :class="dayModalType === 'expense' ? 'text-red-600' : 'text-green-600'">
            {{ Number(dayModalTotal).toLocaleString('uz-UZ').replace(/,/g,' ') }} so'm
          </p>
        </div>
        <button class="text-gray-400 hover:text-gray-600" aria-label="close" @click="showDayModal = false">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="px-5 py-3 overflow-y-auto flex-1 min-h-0">
        <div v-if="dayModalLoading" class="flex justify-center py-10">
          <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <div v-else-if="dayModalItems.length" class="space-y-2">
          <div
            v-for="it in dayModalItems"
            :key="it.id"
            class="flex items-center justify-between p-3 rounded-xl"
            :class="dayModalType === 'expense' ? 'bg-red-50' : 'bg-green-50'"
          >
            <div class="flex items-center min-w-0">
              <span class="text-xl mr-3 flex-shrink-0">{{ (it.category && it.category.icon) || (dayModalType === 'expense' ? '📦' : '💰') }}</span>
              <div class="min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ getCategoryName(it.category && it.category.name) || $t('finance.other') }}</p>
                <p class="text-sm text-gray-500 truncate">{{ it.description || '-' }}</p>
              </div>
            </div>
            <span class="font-bold flex-shrink-0 ml-2" :class="dayModalType === 'expense' ? 'text-red-600' : 'text-green-600'">
              {{ Number(it.amount).toLocaleString('uz-UZ').replace(/,/g,' ') }} {{ it.currency }}
            </span>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400">{{ $t('finance.family_no_data') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'AnalyticsDayModal',
  props: {
    dayModalTitle: { type: null, default: undefined },
    dayModalType: { type: null, default: undefined },
    dayModalTotal: { type: null, default: undefined },
    dayModalLoading: { type: null, default: undefined },
    dayModalItems: { type: null, default: undefined },
    getCategoryName: { type: Function, default: undefined },
  },
};
</script>
