<template>
  <!-- Calendar Tab (Kalendar) -->
  <div>
    <!-- Type toggle: Expense / Income -->
    <div class="flex items-center gap-2 mb-6">
      <button
        class="px-5 py-2 rounded-xl font-medium text-sm transition-colors"
        :class="calendarType === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        @click="setCalendarType('expense')"
      >
        {{ $t('finance.expenses') }}
      </button>
      <button
        class="px-5 py-2 rounded-xl font-medium text-sm transition-colors"
        :class="calendarType === 'income' ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        @click="setCalendarType('income')"
      >
        {{ $t('finance.incomes') }}
      </button>
    </div>

    <!-- Oylik jami (tanlangan tur bo'yicha) -->
    <div class="max-w-3xl mb-4">
      <div class="rounded-xl px-5 py-3 flex items-center justify-between"
           :class="calendarType === 'expense' ? 'bg-red-50' : 'bg-green-50'">
        <span class="text-sm font-medium text-gray-600">
          {{ monthNames[selectedMonth - 1] }} {{ selectedYear }} —
          {{ calendarType === 'expense' ? $t('finance.total_expense') : $t('finance.total_income') }}
        </span>
        <span class="text-xl font-bold" :class="calendarType === 'expense' ? 'text-red-600' : 'text-green-600'">
          {{ Number(calendarTotal).toLocaleString('uz-UZ').replace(/,/g,' ') }} so'm
        </span>
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="max-w-3xl">
      <!-- Weekday headers -->
      <div class="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        <div
          v-for="wd in weekDays"
          :key="wd"
          class="text-center text-[10px] md:text-xs font-semibold text-gray-400 uppercase py-1"
        >
          {{ wd }}
        </div>
      </div>
      <!-- Day cells -->
      <div class="grid grid-cols-7 gap-1 md:gap-2">
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          class="aspect-square rounded-lg md:rounded-xl border flex flex-col items-center justify-center p-0.5 md:p-1"
          :class="[
            cell.day ? 'bg-gray-50 border-gray-100' : 'border-transparent',
            cell.today ? 'ring-2 ring-blue-400 border-blue-200' : '',
            (cell.day && cell.amount > 0) ? 'cursor-pointer hover:ring-2 hover:ring-blue-300 hover:shadow-sm transition' : ''
          ]"
          @click="openDay(cell)"
        >
          <template v-if="cell.day">
            <span class="text-[10px] md:text-xs text-gray-400 leading-none mb-0.5">{{ cell.day }}</span>
            <span
              v-if="cell.amount > 0"
              class="text-[10px] md:text-sm font-bold leading-tight text-center"
              :class="calendarType === 'expense' ? 'text-red-600' : 'text-green-600'"
            >
              {{ formatCompact(cell.amount) }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
// wave D: pages/finance/analytics/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'AnalyticsCalendarTab',
  props: {
    calendarType: { type: null, default: undefined },
    setCalendarType: { type: Function, default: undefined },
    monthNames: { type: null, default: undefined },
    selectedMonth: { type: null, default: undefined },
    selectedYear: { type: null, default: undefined },
    calendarTotal: { type: null, default: undefined },
    weekDays: { type: null, default: undefined },
    calendarCells: { type: null, default: undefined },
    openDay: { type: Function, default: undefined },
    formatCompact: { type: Function, default: undefined },
  },
};
</script>
