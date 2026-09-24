<template>
  <div>
    <!-- Boshqaruv: valyuta (chapda) + oy tanlagich (o'ngda) -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div class="flex items-center gap-2">
        <button
          v-for="v in ['UZS', 'USD']"
          :key="v"
          type="button"
          @click="setValyuta(v)"
          class="px-5 py-2 rounded-xl font-medium text-sm transition-colors"
          :class="valyuta === v ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ v }}
        </button>
        <span class="hidden sm:inline-flex items-center gap-3 ml-2 text-xs text-gray-500">
          <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {{ t.given }}</span>
          <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-green-500"></span> {{ t.returned }}</span>
        </span>
      </div>

      <!-- Oy tanlagich (oldingi / keyingi) -->
      <div class="flex items-center gap-1 bg-gray-50 rounded-xl px-1.5 py-1">
        <button
          type="button"
          @click="prevMonth"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-800 transition-colors"
          aria-label="prev"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span class="text-center text-sm font-semibold text-gray-700 select-none" style="min-width: 130px;">
          {{ t.monthsCap[selectedMonth - 1] }} {{ selectedYear }}
        </span>
        <button
          type="button"
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
        <!-- Oylik jami: berilgan / qaytarilgan -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="rounded-xl px-4 py-3 bg-blue-50">
            <p class="text-xs font-medium text-gray-600">{{ t.monthGiven }}</p>
            <p class="text-lg font-bold text-blue-600 whitespace-nowrap">{{ fmtMoney(month.jami_berilgan) }} <span class="text-xs font-medium text-gray-400">{{ valyuta }}</span></p>
          </div>
          <div class="rounded-xl px-4 py-3 bg-green-50">
            <p class="text-xs font-medium text-gray-600">{{ t.monthReturned }}</p>
            <p class="text-lg font-bold text-green-600 whitespace-nowrap">{{ fmtMoney(month.jami_undirilgan) }} <span class="text-xs font-medium text-gray-400">{{ valyuta }}</span></p>
          </div>
        </div>

        <!-- Hafta kunlari sarlavhasi (dushanbadan) -->
        <div class="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          <div
            v-for="wd in t.weekDays"
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
              class="cal-cell rounded-lg md:rounded-xl border flex flex-col items-center justify-center p-0.5 md:p-1"
              :class="[
                cell.day ? 'bg-gray-50 border-gray-100' : 'border-transparent',
                cell.today ? 'ring-2 ring-blue-400 border-blue-200' : '',
                cell.day ? 'cursor-pointer hover:ring-2 hover:ring-indigo-300 hover:shadow-sm transition' : '',
                (cell.day && cell.key === panelKey) ? 'ring-2 ring-indigo-500 border-indigo-300 bg-white' : ''
              ]"
              @click="openDay(cell)"
            >
              <template v-if="cell.day">
                <span class="cal-xs text-gray-400 leading-none mb-0.5">{{ cell.day }}</span>
                <span v-if="cell.berilgan > 0" class="cal-sum font-bold leading-tight text-center text-blue-600">
                  +{{ formatCompact(cell.berilgan) }}
                </span>
                <span v-if="cell.undirilgan > 0" class="cal-sum font-bold leading-tight text-center text-green-600">
                  −{{ formatCompact(cell.undirilgan) }}
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

      <!-- O'NG: tanlangan kun tahlili — berilgan va qaytarilgan qarzlar ro'yxati -->
      <div class="w-full lg:w-1/3">
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <!-- Kun tanlanmagan -->
          <div v-if="!panelKey" class="px-5 py-10 text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">{{ t.pickDay }}</p>
          </div>

          <!-- Kun tanlangan -->
          <template v-else>
            <div class="px-4 py-3 border-b border-gray-100 flex items-start justify-between">
              <div class="min-w-0">
                <h3 class="text-sm font-bold text-gray-900 truncate">{{ panelTitle }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">{{ t.dayAnalysis }}</p>
              </div>
              <button
                type="button"
                @click="closePanel"
                class="flex-shrink-0 ml-2 text-gray-300 hover:text-gray-600 transition-colors"
                aria-label="close"
                :title="t.close"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="px-4 py-4 overflow-y-auto" style="max-height: 32rem;">
              <div v-if="dayLoading" class="py-6 flex justify-center">
                <div class="w-7 h-7 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>

              <template v-else>
                <!-- Kun jami -->
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="rounded-xl bg-blue-50 px-3 py-2">
                    <p class="cal-xs font-bold uppercase tracking-wide text-blue-600">{{ t.given }}</p>
                    <p class="text-sm font-bold text-blue-700 whitespace-nowrap">{{ fmtMoney(dayTotals.berilgan) }} <span class="cal-xs font-medium text-gray-400">{{ valyuta }}</span></p>
                  </div>
                  <div class="rounded-xl bg-green-50 px-3 py-2">
                    <p class="cal-xs font-bold uppercase tracking-wide text-green-600">{{ t.returned }}</p>
                    <p class="text-sm font-bold text-green-700 whitespace-nowrap">{{ fmtMoney(dayTotals.qaytarilgan) }} <span class="cal-xs font-medium text-gray-400">{{ valyuta }}</span></p>
                  </div>
                </div>

                <!-- Berilgan qarzlar -->
                <p class="text-xs font-semibold text-gray-500 mb-1.5">{{ t.givenList }} ({{ dayGiven.length }})</p>
                <div v-if="dayGiven.length" class="space-y-1.5 mb-3">
                  <div v-for="it in dayGiven" :key="'b' + it.id" class="flex items-center justify-between p-2.5 rounded-xl bg-blue-50">
                    <div class="flex items-center min-w-0">
                      <span class="w-8 h-8 mr-2 flex-shrink-0 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-blue-500">{{ initial(it.mijoz) }}</span>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ it.mijoz }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ it.dokon || '—' }} · {{ fmtTime(it.vaqt) }}</p>
                      </div>
                    </div>
                    <span class="text-sm font-bold flex-shrink-0 ml-2 whitespace-nowrap text-blue-600">+{{ fmtMoney(it.summa) }}</span>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 py-1 mb-3">{{ t.noGiven }}</p>

                <!-- Qaytarilgan qarzlar -->
                <p class="text-xs font-semibold text-gray-500 mb-1.5">{{ t.returnedList }} ({{ dayReturned.length }})</p>
                <div v-if="dayReturned.length" class="space-y-1.5">
                  <div v-for="it in dayReturned" :key="'q' + it.id" class="flex items-center justify-between p-2.5 rounded-xl bg-green-50">
                    <div class="flex items-center min-w-0">
                      <span class="w-8 h-8 mr-2 flex-shrink-0 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-green-500">{{ initial(it.mijoz) }}</span>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ it.mijoz }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ it.dokon || '—' }} · {{ fmtTime(it.vaqt) }}</p>
                      </div>
                    </div>
                    <span class="text-sm font-bold flex-shrink-0 ml-2 whitespace-nowrap text-green-600">−{{ fmtMoney(it.summa) }}</span>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 py-1">{{ t.noReturned }}</p>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Qarz daftari kalendari.
 *
 * SS-DEV (2026-09-24): QAYTA YOZILDI — endi BACKEND manbasidan:
 *   • oylik kunlik yig'indilar — `GET /qarz-daftari/kalendar?year&month&valyuta[&faoliyat_id]`
 *     (berilgan = 'berish' tranzaksiyalar, undirilgan = 'qaytarish' tranzaksiyalar);
 *   • tanlangan KUN tahlili — `GET /qarz-daftari/kalendar/kun?date&valyuta[&faoliyat_id]`
 *     (o'sha kuni berilgan va qaytarilgan qarzlar ro'yxati: mijoz, do'kon, summa, vaqt).
 * Ilgari komponent `/qarz-daftari/qarzlar` ro'yxatini frontendda guruhlab, faqat bitta
 * rejimni (berilgan YOKI qaytarilgan) ko'rsatardi; kun tanlanganda qarzning "yopilgan"
 * vaqti `updated_at` dan taxmin qilinardi. Endi ikkala tur bitta panelda, aniq
 * tranzaksiya sanasi bo'yicha.
 *
 * Nuxt avto-import nomi: `QarzKalendar` (papka prefiksi "QarzDaftari" TAKROR "Qarz"
 * bo'g'ini tufayli qisqaradi). Sahifada aniq import qilinadi (pages/qarz-daftari/index.vue).
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
      valyuta: 'UZS',
      loading: false,
      month: { daily: [], jami_berilgan: 0, jami_undirilgan: 0 },
      panelKey: '',
      dayLoading: false,
      day: null, // { berilgan: [], qaytarilgan: [], jami: {...} }
      reqSeq: 0,
    }
  },

  computed: {
    loc() { return (this.$i18n && this.$i18n.locale) || 'uz' },
    t() {
      const m = {
        uz: {
          given: 'Berilgan', returned: 'Qaytarilgan',
          monthGiven: 'Oyda berilgan', monthReturned: 'Oyda qaytarilgan',
          weekDays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
          months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
          monthsCap: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
          wd: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'],
          pickDay: "Sanani tanlang — o'sha kuni berilgan va qaytarilgan qarzlar shu yerda ko'rinadi.",
          dayAnalysis: "Kun tahlili — berilgan va qaytarilgan qarzlar", close: 'Yopish',
          givenList: 'Berilgan qarzlar', returnedList: 'Qaytarilgan qarzlar',
          noGiven: "Bu kunda berilgan qarz yo'q", noReturned: "Bu kunda qaytarilgan qarz yo'q",
        },
        ru: {
          given: 'Выдано', returned: 'Возвращено',
          monthGiven: 'Выдано за месяц', monthReturned: 'Возвращено за месяц',
          weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
          months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
          monthsCap: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          wd: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
          pickDay: 'Выберите дату — здесь появятся выданные и возвращённые долги за этот день.',
          dayAnalysis: 'Анализ дня — выданные и возвращённые долги', close: 'Закрыть',
          givenList: 'Выданные долги', returnedList: 'Возвращённые долги',
          noGiven: 'В этот день долги не выдавались', noReturned: 'В этот день долги не возвращались',
        },
        kr: {
          given: 'Берилган', returned: 'Қайтарилган',
          monthGiven: 'Ойда берилган', monthReturned: 'Ойда қайтарилган',
          weekDays: ['Ду', 'Се', 'Чо', 'Па', 'Жу', 'Ша', 'Як'],
          months: ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'],
          monthsCap: ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентябр', 'Октябр', 'Ноябр', 'Декабр'],
          wd: ['якшанба', 'душанба', 'сешанба', 'чоршанба', 'пайшанба', 'жума', 'шанба'],
          pickDay: 'Санани танланг — ўша куни берилган ва қайтарилган қарзлар шу ерда кўринади.',
          dayAnalysis: 'Кун таҳлили — берилган ва қайтарилган қарзлар', close: 'Ёпиш',
          givenList: 'Берилган қарзлар', returnedList: 'Қайтарилган қарзлар',
          noGiven: 'Бу кунда берилган қарз йўқ', noReturned: 'Бу кунда қайтарилган қарз йўқ',
        },
      }
      return m[this.loc] || m.uz
    },

    // kun raqami -> { berilgan, undirilgan }
    dailyMap() {
      const map = {}
      for (const r of (this.month && this.month.daily) || []) {
        map[Number(r.kun)] = { berilgan: Number(r.berilgan) || 0, undirilgan: Number(r.undirilgan) || 0 }
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
      for (let i = 0; i < offset; i++) cells.push({ day: null })
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        const agg = this.dailyMap[d] || { berilgan: 0, undirilgan: 0 }
        cells.push({ day: d, key, berilgan: agg.berilgan, undirilgan: agg.undirilgan, today: isCurrentMonth && now.getDate() === d })
      }
      return cells
    },

    dayGiven() { return (this.day && this.day.berilgan) || [] },
    dayReturned() { return (this.day && this.day.qaytarilgan) || [] },
    dayTotals() {
      const sum = (arr) => arr.reduce((s, x) => s + (Number(x.summa) || 0), 0)
      return { berilgan: sum(this.dayGiven), qaytarilgan: sum(this.dayReturned) }
    },

    // Panel sarlavhasi — "18-sentabr, juma"
    panelTitle() {
      if (!this.panelKey) return ''
      const parts = String(this.panelKey).split('-')
      const y = Number(parts[0]); const m = Number(parts[1]); const d = Number(parts[2])
      if (!y || !m || !d) return ''
      const dt = new Date(y, m - 1, d)
      if (isNaN(dt.getTime())) return ''
      return `${d}-${this.t.months[m - 1]}, ${this.t.wd[dt.getDay()]}`
    }
  },

  watch: {
    // Oy almashsa tanlangan kun gridda yo'q — panel yopiladi, oy qayta yuklanadi
    selectedMonth() { this.closePanel(); this.load() },
    selectedYear() { this.closePanel(); this.load() },
    faoliyatId() { this.closePanel(); this.load() }
  },

  mounted() {
    this.load()
  },

  methods: {
    // Oylik kunlik yig'indilar — backend `kalendar` endpointi
    async load() {
      const seq = ++this.reqSeq
      this.loading = true
      try {
        const params = { year: this.selectedYear, month: this.selectedMonth, valyuta: this.valyuta }
        if (this.faoliyatId) params.faoliyat_id = this.faoliyatId
        const res = await this.$axios.$get('/qarz-daftari/kalendar', { params, silent: true })
        if (seq !== this.reqSeq) return
        this.month = (res && res.success && res.data) ? res.data : { daily: [], jami_berilgan: 0, jami_undirilgan: 0 }
      } catch (error) {
        if (seq === this.reqSeq) this.month = { daily: [], jami_berilgan: 0, jami_undirilgan: 0 }
      } finally {
        if (seq === this.reqSeq) this.loading = false
      }
    },

    // Tanlangan kun tafsiloti — backend `kalendar/kun` endpointi
    async loadDay(key) {
      this.dayLoading = true
      this.day = null
      try {
        const params = { date: key, valyuta: this.valyuta }
        if (this.faoliyatId) params.faoliyat_id = this.faoliyatId
        const res = await this.$axios.$get('/qarz-daftari/kalendar/kun', { params, silent: true })
        if (this.panelKey !== key) return
        this.day = (res && res.success && res.data) ? res.data : { berilgan: [], qaytarilgan: [] }
      } catch (error) {
        if (this.panelKey === key) this.day = { berilgan: [], qaytarilgan: [] }
      } finally {
        if (this.panelKey === key) this.dayLoading = false
      }
    },

    setValyuta(v) {
      if (this.valyuta === v) return
      this.valyuta = v
      this.load()
      if (this.panelKey) this.loadDay(this.panelKey)
    },

    prevMonth() {
      if (this.selectedMonth === 1) { this.selectedMonth = 12; this.selectedYear -= 1 } else { this.selectedMonth -= 1 }
    },

    nextMonth() {
      if (this.selectedMonth === 12) { this.selectedMonth = 1; this.selectedYear += 1 } else { this.selectedMonth += 1 }
    },

    openDay(cell) {
      if (!cell || !cell.day) return
      if (this.panelKey === cell.key) return
      this.panelKey = cell.key
      this.loadDay(cell.key)
    },

    closePanel() {
      this.panelKey = ''
      this.day = null
    },

    initial(name) {
      const s = String(name || '').trim()
      return s ? s.charAt(0).toUpperCase() : '•'
    },

    fmtMoney(v) {
      return Number(v || 0).toLocaleString('uz-UZ').replace(/,/g, ' ')
    },

    // "HH:MM" — tranzaksiya vaqti
    fmtTime(v) {
      if (!v) return ''
      const d = new Date(v)
      if (isNaN(d.getTime())) return ''
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },

    // Million/ming yaxlitlash: 1500000 -> "1.5M", 200000 -> "200K"
    formatCompact(v) {
      const n = Number(v) || 0
      const abs = Math.abs(n)
      if (abs >= 1e6) {
        const m = n / 1e6
        return (Number.isInteger(m) ? m : m.toFixed(1)) + 'M'
      }
      if (abs >= 1e3) return Math.round(n / 1e3) + 'K'
      return String(Math.round(n))
    }
  }
}
</script>

<style scoped>
/* Tailwind v2 (JIT o'chiq) — `text-[10px]`/`aspect-square` kabi klasslar ishlamaydi,
   shu sabab katakcha o'lchami va shriftlar shu yerda beriladi. */
.cal-cell { min-height: 44px; }
.cal-xs { font-size: 10px; }
.cal-sum { font-size: 10px; }

@media (min-width: 768px) {
  .cal-cell { min-height: 64px; }
  .cal-xs { font-size: 0.75rem; }
  .cal-sum { font-size: 0.8125rem; }
}
</style>
