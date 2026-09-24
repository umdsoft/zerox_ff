<template>
  <div>
    <!-- Boshqaruv: Xarajat/Daromad toggle (chapda) + oy tanlagich (o'ngda) -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <!-- Type toggle: Expense / Income -->
      <div class="flex items-center gap-2">
        <button
          @click="setCalendarType('expense')"
          class="px-5 py-2 rounded-xl font-medium text-sm transition-colors"
          :class="calendarType === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ $t('finance.expenses') }}
        </button>
        <button
          @click="setCalendarType('income')"
          class="px-5 py-2 rounded-xl font-medium text-sm transition-colors"
          :class="calendarType === 'income' ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ $t('finance.incomes') }}
        </button>
      </div>

      <!-- Oy tanlagich (oldingi / keyingi) — mustaqil ishlashi uchun -->
      <div class="flex items-center gap-1 bg-gray-50 rounded-xl px-1.5 py-1">
        <button
          @click="prevMonth"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-800 transition-colors"
          aria-label="prev"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span class="min-w-[130px] text-center text-sm font-semibold text-gray-700 select-none">
          {{ monthNames[selectedMonth - 1] }} {{ selectedYear }}
        </span>
        <button
          @click="nextMonth"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-800 transition-colors"
          aria-label="next"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <!-- Kalendar (chapda) + tanlangan kun tafsiloti paneli (o'ngda).
         Mobilda panel kalendar TAGIDA to'liq kenglikda chiqadi. -->
    <div class="flex flex-col lg:flex-row gap-5">
      <!-- CHAP: oylik jami + kun gridi -->
      <div class="w-full lg:w-2/3">
        <!-- Oylik jami (tanlangan tur bo'yicha) -->
        <div class="mb-4">
          <div class="rounded-xl px-5 py-3 flex items-center justify-between"
               :class="calendarType === 'expense' ? 'bg-red-50' : 'bg-green-50'">
            <span class="text-sm font-medium text-gray-600">
              {{ monthNames[selectedMonth - 1] }} {{ selectedYear }} —
              {{ calendarType === 'expense' ? $t('finance.total_expense') : $t('finance.total_income') }}
            </span>
            <span class="text-xl font-bold" :class="calendarType === 'expense' ? 'text-red-600' : 'text-green-600'">
              {{ fmtMoney(calendarTotal) }} so'm
            </span>
          </div>
        </div>

        <!-- Weekday headers -->
        <div class="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          <div
            v-for="wd in weekDays"
            :key="wd"
            class="cal-xs text-center font-semibold text-gray-400 uppercase py-1"
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
              cell.day ? 'cursor-pointer hover:ring-2 hover:ring-blue-300 hover:shadow-sm transition' : '',
              (cell.day && cell.key === panelKey) ? 'ring-2 ring-indigo-500 border-indigo-300 bg-white' : ''
            ]"
            @click="openDay(cell)"
          >
            <template v-if="cell.day">
              <span class="cal-xs text-gray-400 leading-none mb-0.5">{{ cell.day }}</span>
              <span
                v-if="cell.amount > 0"
                class="cal-sum font-bold leading-tight text-center"
                :class="calendarType === 'expense' ? 'text-red-600' : 'text-green-600'"
              >
                {{ formatCompact(cell.amount) }}
              </span>
            </template>
          </div>
        </div>
      </div>

      <!-- O'NG: tanlangan kun tafsiloti (xarajat + daromad birga) -->
      <div class="w-full lg:w-1/3">
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <!-- Kun tanlanmagan — yengil placeholder -->
          <div v-if="!panelKey" class="px-5 py-10 text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">
              Sanani tanlang — o'sha kundagi daromad va xarajatlar shu yerda ko'rinadi.
            </p>
          </div>

          <!-- Kun tanlangan -->
          <template v-else>
            <div class="px-4 py-3 border-b border-gray-100 flex items-start justify-between">
              <div class="min-w-0">
                <h3 class="text-sm font-bold text-gray-900 truncate">{{ panelTitle }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">Kun tafsiloti</p>
              </div>
              <button
                @click="closePanel"
                class="flex-shrink-0 ml-2 text-gray-300 hover:text-gray-600 transition-colors"
                aria-label="close"
                title="Yopish"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div v-if="panelLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>

            <div v-else class="px-4 py-4 overflow-y-auto" style="max-height: 30rem;">
              <!-- Xarajatlar (qizil) -->
              <div class="mb-5">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-red-600 uppercase tracking-wide">Xarajatlar</span>
                  <span class="text-sm font-bold text-red-600 whitespace-nowrap">{{ fmtMoney(panelExpenseTotal) }} so'm</span>
                </div>
                <div v-if="panelExpenses.length" class="space-y-1.5">
                  <div
                    v-for="it in panelExpenses"
                    :key="'exp-' + it.id"
                    class="flex items-center justify-between p-2.5 rounded-xl bg-red-50"
                  >
                    <div class="flex items-center min-w-0">
                      <span class="text-base mr-2 flex-shrink-0">{{ (it.category && it.category.icon) || '📦' }}</span>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ getCategoryName(it.category && it.category.name) || $t('finance.other') }}</p>
                        <p v-if="it.description" class="text-xs text-gray-500 truncate">{{ it.description }}</p>
                      </div>
                    </div>
                    <span class="text-sm font-bold text-red-600 flex-shrink-0 ml-2 whitespace-nowrap">
                      {{ fmtMoney(it.amount) }} {{ it.currency }}
                    </span>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 py-1">Bu kunda xarajat yo'q</p>
              </div>

              <!-- Daromadlar (yashil) -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-green-600 uppercase tracking-wide">Daromadlar</span>
                  <span class="text-sm font-bold text-green-600 whitespace-nowrap">{{ fmtMoney(panelIncomeTotal) }} so'm</span>
                </div>
                <div v-if="panelIncomes.length" class="space-y-1.5">
                  <div
                    v-for="it in panelIncomes"
                    :key="'inc-' + it.id"
                    class="flex items-center justify-between p-2.5 rounded-xl bg-green-50"
                  >
                    <div class="flex items-center min-w-0">
                      <span class="text-base mr-2 flex-shrink-0">{{ (it.category && it.category.icon) || '💰' }}</span>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ getCategoryName(it.category && it.category.name) || $t('finance.other') }}</p>
                        <p v-if="it.description" class="text-xs text-gray-500 truncate">{{ it.description }}</p>
                      </div>
                    </div>
                    <span class="text-sm font-bold text-green-600 flex-shrink-0 ml-2 whitespace-nowrap">
                      {{ fmtMoney(it.amount) }} {{ it.currency }}
                    </span>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 py-1">Bu kunda daromad yo'q</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatNumberGrouped, localizedMonthNames } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
export default {
  name: 'FinanceCalendar',

  data() {
    const now = new Date()
    return {
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      calendarType: 'expense',
      calendarDaily: {},
      weekDays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
      // Tanlangan kun yon paneli — o'sha kundagi XARAJAT va DAROMADlar birga
      panelKey: '',
      panelLoading: false,
      panelExpenses: [],
      panelIncomes: [],
      // Panel sarlavhasi uchun (i18n'ga bog'liq emas)
      uzMonths: [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
      ],
      uzWeekDays: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
    }
  },

  computed: {
    monthNames() { return localizedMonthNames(this.$t.bind(this)) }, // SS-AUDIT (2026-09-25): utils/helpers

    // Kalendar oylik jami (tanlangan tur bo'yicha, UZS)
    calendarTotal() {
      return Object.values(this.calendarDaily || {}).reduce((s, v) => s + (Number(v) || 0), 0)
    },

    // Panel sarlavhasi — "18-sentabr, juma"
    panelTitle() {
      if (!this.panelKey) return ''
      const parts = String(this.panelKey).split('-')
      const y = Number(parts[0])
      const m = Number(parts[1])
      const d = Number(parts[2])
      if (!y || !m || !d) return ''
      const dt = new Date(y, m - 1, d)
      if (isNaN(dt.getTime())) return ''
      return `${d}-${this.uzMonths[m - 1]}, ${this.uzWeekDays[dt.getDay()]}`
    },

    // Panel bo'lim jamilari — faqat UZS (so'm) qatorlar qo'shiladi
    panelExpenseTotal() {
      return this.sumUzs(this.panelExpenses)
    },

    panelIncomeTotal() {
      return this.sumUzs(this.panelIncomes)
    },

    // Kalendar katakchalari (dushanba boshi, to'g'ri padding)
    calendarCells() {
      const year = this.selectedYear
      const month = this.selectedMonth // 1-12
      const firstDay = new Date(year, month - 1, 1)
      const offset = (firstDay.getDay() + 6) % 7 // Monday = 0
      const daysInMonth = new Date(year, month, 0).getDate()
      const now = new Date()
      const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month
      const cells = []
      for (let i = 0; i < offset; i++) {
        cells.push({ day: null })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        cells.push({
          day: d,
          key,
          amount: this.calendarDaily[key] || 0,
          today: isCurrentMonth && now.getDate() === d
        })
      }
      return cells
    }
  },

  watch: {
    // Oy almashsa tanlangan kun gridda yo'q — panel yopiladi
    selectedMonth() {
      this.closePanel()
      this.loadCalendar()
    },
    selectedYear() {
      this.closePanel()
      this.loadCalendar()
    }
  },

  mounted() {
    this.loadCalendar()
  },

  methods: {
    // Oldingi oy
    prevMonth() {
      if (this.selectedMonth === 1) {
        this.selectedMonth = 12
        this.selectedYear -= 1
      } else {
        this.selectedMonth -= 1
      }
    },

    // Keyingi oy
    nextMonth() {
      if (this.selectedMonth === 12) {
        this.selectedMonth = 1
        this.selectedYear += 1
      } else {
        this.selectedMonth += 1
      }
    },

    // Kalendar uchun toggle almashtirish + qayta yuklash
    setCalendarType(type) {
      if (this.calendarType === type) return
      this.calendarType = type
      this.loadCalendar()
    },

    async loadCalendar() {
      try {
        const params = { year: this.selectedYear, month: this.selectedMonth }
        const res = this.calendarType === 'expense'
          ? await this.$api.getExpenseStats(params)
          : await this.$api.getIncomeStats(params)
        const data = res?.data?.data || {}
        const map = {}
        ;(data.daily || []).forEach(d => {
          map[d.date] = parseFloat(d.total) || 0
        })
        this.calendarDaily = map
      } catch (error) {
        console.error('Load calendar error:', error)
        this.calendarDaily = {}
      }
    },

    // Kalendar kuniga bosilganda — YON PANELda o'sha kundagi xarajat VA daromadlar.
    // Tanlangan turdan (calendarType) qat'i nazar ikkala ro'yxat ham yuklanadi.
    async openDay(cell) {
      if (!cell || !cell.day) return
      const reqKey = cell.key
      this.panelKey = reqKey
      this.panelExpenses = []
      this.panelIncomes = []
      this.panelLoading = true
      const params = { start_date: reqKey, end_date: reqKey, limit: 200 }
      try {
        // Bittasi yiqilsa ikkinchisi baribir ko'rinsin — har bir so'rov alohida ushlanadi
        const [expRes, incRes] = await Promise.all([
          this.$axios.get('/finance/expenses', { params }).catch(() => null),
          this.$axios.get('/finance/incomes', { params }).catch(() => null)
        ])
        // Tez ketma-ket bosilganda eski javob yangisini bosib ketmasin
        if (this.panelKey !== reqKey) return
        this.panelExpenses = (expRes && expRes.data && expRes.data.data) || []
        this.panelIncomes = (incRes && incRes.data && incRes.data.data) || []
      } finally {
        if (this.panelKey === reqKey) this.panelLoading = false
      }
    },

    // Yon panelni yopish
    closePanel() {
      this.panelKey = ''
      this.panelExpenses = []
      this.panelIncomes = []
      this.panelLoading = false
    },

    // UZS qatorlar yig'indisi (valyutalar aralashmasligi uchun)
    sumUzs(list) {
      return (list || []).reduce((sum, it) => {
        const cur = String(it.currency || 'UZS').toUpperCase()
        return cur === 'UZS' ? sum + (Number(it.amount) || 0) : sum
      }, 0)
    },

    // Summani "1 500 000" ko'rinishida chiqarish
    fmtMoney: formatNumberGrouped, // SS-AUDIT (2026-09-25): utils/helpers

    getCategoryName(name) {
      if (!name) return null
      const key = `finance.${name}`
      const translated = this.$t(key)
      if (translated === key) {
        return name
      }
      return translated
    },

    // Million/ming yaxlitlash: 1500000 -> "1.5M", 200000 -> "200K"
    formatCompact(v) {
      const n = Number(v) || 0
      const abs = Math.abs(n)
      if (abs >= 1e6) {
        const m = n / 1e6
        return (Number.isInteger(m) ? m : m.toFixed(1)) + 'M'
      }
      if (abs >= 1e3) {
        return Math.round(n / 1e3) + 'K'
      }
      return String(Math.round(n))
    }
  }
}
</script>

<style scoped>
/* Tailwind v2 (JIT o'chiq) — `text-[10px]` kabi arbitrary klasslar ishlamaydi,
   shu sabab kalendar katakchasi shriftlari shu yerda beriladi. */
.cal-xs { font-size: 10px; }
.cal-sum { font-size: 10px; }

@media (min-width: 768px) {
  .cal-xs { font-size: 0.75rem; }
  .cal-sum { font-size: 0.875rem; }
}
</style>
