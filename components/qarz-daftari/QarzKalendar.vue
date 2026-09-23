<template>
  <div>
    <!-- Boshqaruv: Berilgan/Qaytarilgan toggle (chapda) + oy tanlagich (o'ngda) -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-2">
        <button
          @click="setMode('berilgan')"
          class="px-5 py-2 rounded-xl font-medium text-sm transition-colors"
          :class="mode === 'berilgan' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          Berilgan qarzlar
        </button>
        <button
          @click="setMode('qaytarilgan')"
          class="px-5 py-2 rounded-xl font-medium text-sm transition-colors"
          :class="mode === 'qaytarilgan' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          Qaytarilgan qarzlar
        </button>
      </div>

      <!-- Oy tanlagich (oldingi / keyingi) -->
      <div class="flex items-center gap-1 bg-gray-50 rounded-xl px-1.5 py-1">
        <button
          @click="prevMonth"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-800 transition-colors"
          aria-label="prev"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span class="text-center text-sm font-semibold text-gray-700 select-none" style="min-width: 130px;">
          {{ uzMonthsCap[selectedMonth - 1] }} {{ selectedYear }}
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
        <!-- Oylik jami -->
        <div class="mb-4">
          <div class="rounded-xl px-5 py-3 flex items-center justify-between"
               :class="mode === 'berilgan' ? 'bg-blue-50' : 'bg-green-50'">
            <span class="text-sm font-medium text-gray-600">
              {{ uzMonthsCap[selectedMonth - 1] }} {{ selectedYear }} —
              {{ mode === 'berilgan' ? 'jami berilgan' : 'jami qaytarilgan' }}
            </span>
            <span class="text-right">
              <span class="block text-xl font-bold" :class="mode === 'berilgan' ? 'text-blue-600' : 'text-green-600'">
                {{ fmtMoney(monthTotalUzs) }} so'm
              </span>
              <span v-if="monthTotalUsd > 0" class="block text-sm font-bold text-gray-500">
                {{ fmtMoney(monthTotalUsd) }} USD
              </span>
            </span>
          </div>
        </div>

        <!-- Hafta kunlari sarlavhasi (dushanbadan) -->
        <div class="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          <div
            v-for="wd in weekDays"
            :key="wd"
            class="cal-xs text-center font-semibold text-gray-400 uppercase py-1"
          >
            {{ wd }}
          </div>
        </div>

        <!-- Kun katakchalari -->
        <div class="relative">
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
                  v-if="cell.uzs > 0"
                  class="cal-sum font-bold leading-tight text-center"
                  :class="mode === 'berilgan' ? 'text-blue-600' : 'text-green-600'"
                >
                  {{ formatCompact(cell.uzs) }}
                </span>
                <span
                  v-if="cell.usd > 0"
                  class="cal-usd font-bold leading-tight text-center text-gray-400"
                >
                  ${{ formatCompact(cell.usd) }}
                </span>
              </template>
            </div>
          </div>

          <!-- Yuklanmoqda -->
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-xl">
            <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      <!-- O'NG: tanlangan kun qarzlari -->
      <div class="w-full lg:w-1/3">
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <!-- Kun tanlanmagan -->
          <div v-if="!panelKey" class="px-5 py-10 text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">
              Sanani tanlang — o'sha kundagi qarzlar shu yerda ko'rinadi.
            </p>
          </div>

          <!-- Kun tanlangan -->
          <template v-else>
            <div class="px-4 py-3 border-b border-gray-100 flex items-start justify-between">
              <div class="min-w-0">
                <h3 class="text-sm font-bold text-gray-900 truncate">{{ panelTitle }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ mode === 'berilgan' ? 'Berilgan qarzlar' : 'Qaytarilgan qarzlar' }}
                </p>
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

            <div class="px-4 py-4 overflow-y-auto" style="max-height: 30rem;">
              <!-- Kun jami -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold uppercase tracking-wide"
                      :class="mode === 'berilgan' ? 'text-blue-600' : 'text-green-600'">
                  Kun jami
                </span>
                <span class="text-right">
                  <span class="block text-sm font-bold whitespace-nowrap"
                        :class="mode === 'berilgan' ? 'text-blue-600' : 'text-green-600'">
                    {{ fmtMoney(panelTotalUzs) }} so'm
                  </span>
                  <span v-if="panelTotalUsd > 0" class="block text-xs font-bold text-gray-500 whitespace-nowrap">
                    {{ fmtMoney(panelTotalUsd) }} USD
                  </span>
                </span>
              </div>

              <!-- Qarzlar ro'yxati: mijoz FISh + summa + do'kon -->
              <div v-if="panelItems.length" class="space-y-1.5">
                <div
                  v-for="it in panelItems"
                  :key="it.id"
                  class="flex items-center justify-between p-2.5 rounded-xl"
                  :class="mode === 'berilgan' ? 'bg-blue-50' : 'bg-green-50'"
                >
                  <div class="flex items-center min-w-0">
                    <span
                      class="w-8 h-8 mr-2 flex-shrink-0 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      :class="mode === 'berilgan' ? 'bg-blue-500' : 'bg-green-500'"
                    >
                      {{ it.initial }}
                    </span>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ it.fish }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ it.dokon || '—' }}</p>
                    </div>
                  </div>
                  <span
                    class="text-sm font-bold flex-shrink-0 ml-2 whitespace-nowrap"
                    :class="mode === 'berilgan' ? 'text-blue-600' : 'text-green-600'"
                  >
                    {{ fmtMoney(it.summa) }} {{ it.valyuta }}
                  </span>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 py-2">
                {{ mode === 'berilgan' ? "Bu kunda berilgan qarz yo'q" : "Bu kunda qaytarilgan qarz yo'q" }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Qarz daftari kalendari — FinanceCalendar tuzilishi asosida.
 *
 * MA'LUMOT MANBASI: mavjud `GET /qarz-daftari/qarzlar` endpointi (`turi=berish`).
 * Bu endpoint sana oralig'i (start_date/end_date) parametrlarini QABUL QILMAYDI —
 * faqat `turi`, `status`, `faoliyat_id`. Shu sababli ro'yxat BIR MARTA olinadi va
 * sana bo'yicha guruhlash frontendda bajariladi.
 *
 *  • "Berilgan qarzlar"   → har bir qarz `berilgan_sana` kuniga, summa = `miqdor`
 *  • "Qaytarilgan qarzlar" → faqat `status = 'yopilgan'` qarzlar, sana = `updated_at`
 *    (qarz yopilgan payt; jadvalda alohida `yopilgan_sana` ustuni yo'q),
 *    summa = `miqdor - voz_kechilgan` (haqiqatan qaytarilgan qism).
 */
export default {
  name: 'QarzKalendar',

  props: {
    // Ixtiyoriy: aniq do'kon (savdo faoliyati) bo'yicha filtr
    faoliyatId: {
      type: [Number, String],
      default: null
    }
  },

  data() {
    const now = new Date()
    return {
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      mode: 'berilgan', // 'berilgan' | 'qaytarilgan'
      qarzlar: [],
      loading: false,
      panelKey: '',
      weekDays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
      uzMonths: [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
      ],
      uzMonthsCap: [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
      ],
      uzWeekDays: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
    }
  },

  computed: {
    // Tanlangan rejim bo'yicha normallashtirilgan elementlar ro'yxati
    normalizedItems() {
      const isReturned = this.mode === 'qaytarilgan'
      const out = []
      for (const q of this.qarzlar || []) {
        const item = this.toCalendarItem(q, isReturned)
        if (item) out.push(item)
      }
      return out
    },

    // Kun kaliti -> { uzs, usd } (faqat joriy oy uchun ishlatiladi)
    dailyMap() {
      const map = {}
      for (const it of this.normalizedItems) {
        if (!map[it.key]) map[it.key] = { uzs: 0, usd: 0 }
        if (it.valyuta === 'USD') map[it.key].usd += it.summa
        else map[it.key].uzs += it.summa
      }
      return map
    },

    // Kalendar katakchalari (dushanba boshi, to'g'ri padding)
    calendarCells() {
      const year = this.selectedYear
      const month = this.selectedMonth // 1-12
      const firstDay = new Date(year, month - 1, 1)
      const offset = (firstDay.getDay() + 6) % 7 // dushanba = 0
      const daysInMonth = new Date(year, month, 0).getDate()
      const now = new Date()
      const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month
      const cells = []
      for (let i = 0; i < offset; i++) {
        cells.push({ day: null })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        const agg = this.dailyMap[key] || { uzs: 0, usd: 0 }
        cells.push({
          day: d,
          key,
          uzs: agg.uzs,
          usd: agg.usd,
          today: isCurrentMonth && now.getDate() === d
        })
      }
      return cells
    },

    // Oylik jamilar (faqat joriy oy katakchalari bo'yicha)
    monthTotalUzs() {
      return this.calendarCells.reduce((s, c) => s + (c.uzs || 0), 0)
    },

    monthTotalUsd() {
      return this.calendarCells.reduce((s, c) => s + (c.usd || 0), 0)
    },

    // Tanlangan kundagi qarzlar
    panelItems() {
      if (!this.panelKey) return []
      return this.normalizedItems.filter(it => it.key === this.panelKey)
    },

    panelTotalUzs() {
      return this.panelItems.reduce((s, it) => s + (it.valyuta === 'UZS' ? it.summa : 0), 0)
    },

    panelTotalUsd() {
      return this.panelItems.reduce((s, it) => s + (it.valyuta === 'USD' ? it.summa : 0), 0)
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
    }
  },

  watch: {
    // Oy almashsa tanlangan kun gridda yo'q — panel yopiladi
    selectedMonth() {
      this.closePanel()
    },
    selectedYear() {
      this.closePanel()
    },
    faoliyatId() {
      this.closePanel()
      this.load()
    }
  },

  mounted() {
    this.load()
  },

  methods: {
    // Qarzlar ro'yxatini olish — MAVJUD endpoint, sana filtri frontendda
    async load() {
      this.loading = true
      try {
        const params = { turi: 'berish' }
        if (this.faoliyatId) params.faoliyat_id = this.faoliyatId
        const res = await this.$axios.$get('/qarz-daftari/qarzlar', { params, silent: true })
        this.qarzlar = (res && res.success && Array.isArray(res.data)) ? res.data : []
      } catch (error) {
        this.qarzlar = []
      } finally {
        this.loading = false
      }
    },

    /**
     * Bitta qarz qatorini kalendar elementiga aylantiradi.
     * Mos kelmasa (rejimga tushmasa / sanasi yo'q / summasi 0) — `null`.
     */
    toCalendarItem(q, isReturned) {
      if (isReturned && q.status !== 'yopilgan') return null

      const rawDate = isReturned
        ? (q.updated_at || q.qaytarish_sanasi || q.berilgan_sana)
        : q.berilgan_sana
      const key = this.ymd(rawDate)
      if (!key) return null

      const summa = this.itemSumma(q, isReturned)
      if (summa <= 0) return null

      const fish = (q.mijoz && q.mijoz.fish) || '—'
      return {
        id: q.id,
        key,
        fish,
        dokon: (q.savdoFaoliyat && q.savdoFaoliyat.nomi)
          || (q.savdo_faoliyat && q.savdo_faoliyat.nomi)
          || '',
        summa,
        valyuta: q.valyuta === 'USD' ? 'USD' : 'UZS',
        initial: fish.charAt(0).toUpperCase()
      }
    },

    /**
     * Berilgan rejimda — qarzning to'liq miqdori.
     * Qaytarilgan rejimda — miqdordan VOZ KECHILGAN summa ayriladi
     * (voz kechilgan qism aslida qaytarilmagan).
     */
    itemSumma(q, isReturned) {
      const miqdor = Number(q.miqdor) || 0
      if (!isReturned) return miqdor
      return Math.max(miqdor - (Number(q.voz_kechilgan) || 0), 0)
    },

    setMode(next) {
      if (this.mode === next) return
      this.mode = next
      this.closePanel()
    },

    prevMonth() {
      if (this.selectedMonth === 1) {
        this.selectedMonth = 12
        this.selectedYear -= 1
      } else {
        this.selectedMonth -= 1
      }
    },

    nextMonth() {
      if (this.selectedMonth === 12) {
        this.selectedMonth = 1
        this.selectedYear += 1
      } else {
        this.selectedMonth += 1
      }
    },

    openDay(cell) {
      if (!cell || !cell.day) return
      this.panelKey = cell.key
    },

    closePanel() {
      this.panelKey = ''
    },

    /**
     * Sanani "YYYY-MM-DD" ga keltirish.
     * Sof DATE ("2026-09-18") to'g'ridan-to'g'ri olinadi — vaqt mintaqasi
     * tufayli bir kunga surilib ketmasligi uchun. ISO timestamp esa mahalliy
     * vaqt bo'yicha o'qiladi (loyihadagi boshqa sahifalar bilan bir xil).
     */
    ymd(v) {
      if (!v) return ''
      const s = String(v)
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
      const d = new Date(s)
      if (isNaN(d.getTime())) return ''
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },

    fmtMoney(v) {
      return Number(v || 0).toLocaleString('uz-UZ').replace(/,/g, ' ')
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
.cal-usd { font-size: 9px; }

@media (min-width: 768px) {
  .cal-xs { font-size: 0.75rem; }
  .cal-sum { font-size: 0.875rem; }
  .cal-usd { font-size: 0.6875rem; }
}
</style>
