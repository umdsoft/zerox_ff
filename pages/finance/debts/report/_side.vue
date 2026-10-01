<template>
  <!-- 30.09 (doc1 11-rasm): Shaxsiy qarz HISOBOTI — Qarz shartnomasi bo'limidagi "Debitor/Kreditor
       hisobot" (pages/hisobot/_type) kabi: gradient sarlavha, svod, qidiruv + "Yuklab olish", holat
       tablari (Barchasi / Jarayonda / Tugallangan / Voz kechilgan) va jadval.
       `side`: given (berilgan) | taken (olingan). `?status=` — completed | forgiven | all.
       01.10 (doc3 3-rasm): sahifada FAQAT YAKUNLANGAN qarzlar — tugallangan va voz kechilgan ("Jarayonda"
       tabi va ochiq qarzlar olib tashlandi; "Qoldiq" o'rniga "Qaytarilgan", sana — yopilgan sana). -->
  <div class="personal-debt-report pb-8">
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="px-5 sm:px-6 py-5" :style="'background: linear-gradient(135deg, ' + palette.from + ' 0%, ' + palette.to + ' 100%);'">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-4 min-w-0">
            <nuxt-link :to="localePath({ name: 'finance-debts' })" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all" style="background: rgba(255,255,255,0.2);" :title="t.back" :aria-label="t.back">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </nuxt-link>
            <div class="w-12 h-12 rounded-xl hidden sm:flex items-center justify-center flex-shrink-0" style="background: rgba(255,255,255,0.2);">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div class="min-w-0">
              <h1 class="text-xl lg:text-2xl font-bold text-white truncate">{{ isGiven ? t.titleGiven : t.titleTaken }}</h1>
              <p class="text-sm mt-0.5" style="color: rgba(255,255,255,0.85);">{{ isGiven ? t.subGiven : t.subTaken }}</p>
            </div>
          </div>
          <div class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl flex-shrink-0" style="background: rgba(255,255,255,0.2);">
            <span class="text-white font-semibold text-lg">{{ debts.length }}</span>
            <span class="text-sm" style="color: rgba(255,255,255,0.85);">{{ t.countSuffix }}</span>
          </div>
        </div>
      </div>

      <!-- Qidiruv + Yuklab olish -->
      <div class="px-5 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="relative w-full md:flex-1 md:max-w-md">
            <svg class="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" style="top: 50%; transform: translateY(-50%);" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              v-model="search"
              type="text"
              :placeholder="t.searchPh"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center justify-end">
            <DownloadButton size="md" :loading="exporting" :disabled="!visibleRows.length" @click="exportExcel()" />
          </div>
        </div>
      </div>

      <!-- Holat tablari -->
      <div class="px-5 sm:px-6 py-3">
        <div class="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-xl transition-all"
            :style="status === tab.key ? 'background:' + tab.soft + ';color:' + tab.fg : 'background:#F9FAFB;color:#4B5563'"
            @click="setStatus(tab.key)"
          >
            <span class="w-2.5 h-2.5 rounded-full" :style="'background:' + tab.dot"></span>
            {{ tab.label }}
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :style="status === tab.key ? 'background:' + tab.dot + ';color:#fff' : 'background:' + tab.soft + ';color:' + tab.fg">{{ tab.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Svod -->
    <DebtSummaryCards v-if="!loading" class="mb-6" :summary="summary" :side="isGiven ? 'lent' : 'borrowed'" closed-only />

    <!-- Yuklanmoqda -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm p-12 text-center">
      <p class="text-gray-400 text-sm">{{ t.loading }}</p>
    </div>

    <!-- Jadval -->
    <div v-else-if="visibleRows.length" class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="hidden md:grid grid-cols-12 items-center px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-100">
        <div class="col-span-3">{{ isGiven ? t.colBorrower : t.colLender }}</div>
        <div class="col-span-2">{{ t.colAmount }}</div>
        <div class="col-span-2">{{ t.colPaid }}</div>
        <div class="col-span-2">{{ t.colDate }}</div>
        <div class="col-span-2">{{ t.colDueOrClosed }}</div>
        <div class="col-span-1 text-right">{{ t.colStatus }}</div>
      </div>
      <div class="divide-y divide-gray-100">
        <nuxt-link
          v-for="r in pagedRows"
          :key="r.key"
          :to="r.to"
          class="block px-5 sm:px-6 py-4 hover:bg-blue-50 transition-colors"
        >
          <!-- Desktop -->
          <div class="hidden md:grid grid-cols-12 items-center gap-2">
            <div class="col-span-3 flex items-center gap-3 min-w-0">
              <span class="inline-block w-3 h-3 rounded-full flex-shrink-0" :style="'background:' + r.state.dot + ';box-shadow:0 0 0 4px ' + r.state.soft"></span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ r.name }}</p>
                <p v-if="r.phone" class="text-xs text-gray-500 truncate">{{ r.phone }}</p>
              </div>
            </div>
            <div class="col-span-2 text-sm text-gray-800">{{ money(r.amount, r.currency) }}</div>
            <div class="col-span-2 text-sm font-semibold" :style="'color:' + (r.paid > 0 ? '#16A34A' : '#9CA3AF')">{{ money(r.paid, r.currency) }}</div>
            <div class="col-span-2 text-sm text-gray-700">{{ r.date }}</div>
            <div class="col-span-2 text-sm text-gray-700">{{ r.endDate }}</div>
            <div class="col-span-1 text-right">
              <span class="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" :style="'background:' + r.state.soft + ';color:' + r.state.fg">{{ r.state.label }}</span>
            </div>
          </div>
          <!-- Mobil -->
          <div class="md:hidden">
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2 min-w-0">
                <span class="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" :style="'background:' + r.state.dot"></span>
                <p class="text-sm font-semibold text-gray-900 truncate">{{ r.name }}</p>
              </div>
              <span class="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" :style="'background:' + r.state.soft + ';color:' + r.state.fg">{{ r.state.label }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-gray-50 rounded-xl p-2.5">
                <p class="text-xs text-gray-500">{{ t.colAmount }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ money(r.amount, r.currency) }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-2.5">
                <p class="text-xs text-gray-500">{{ t.colPaid }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ money(r.paid, r.currency) }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-2.5">
                <p class="text-xs text-gray-500">{{ t.colDate }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ r.date }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-2.5">
                <p class="text-xs text-gray-500">{{ t.colDueOrClosed }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ r.endDate }}</p>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
      <div v-if="visibleRows.length > pagedRows.length" class="px-6 py-4 border-t border-gray-100 bg-gray-50 text-center">
        <button type="button" class="px-5 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100" @click="shown += PAGE_SIZE">
          {{ t.showMore }} ({{ visibleRows.length - pagedRows.length }})
        </button>
      </div>
    </div>

    <!-- Bo'sh -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-10 text-center">
      <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background:#EFF6FF">
        <svg class="w-8 h-8" style="color:#3B82F6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      </div>
      <p class="text-gray-500 text-sm">{{ t.empty }}</p>
    </div>
  </div>
</template>

<script>
import DownloadButton from '~/components/ui/DownloadButton.vue'
import DebtSummaryCards from '~/components/finance/DebtSummaryCards.vue'
import { titleCaseName, formatMoneyCur, formatPhoneUz, fmtDMY } from '~/utils/helpers'
import { buildDebtGroupKey, encodeGroupKey } from '~/utils/debtGroups'
import { summarizeDebts, fetchAllPersonalDebts, isOpenDebt, isForgivenDebt, paidOfDebt } from '~/utils/debtSummary'

const SIDES = { given: 'lent', taken: 'borrowed' }
// 01.10 (doc3 3-rasm): faqat yakunlangan qarzlar — "open" (Jarayonda) tabi yo'q
const STATUSES = ['all', 'completed', 'forgiven']
const PAGE_SIZE = 20
const MARKER_INCREASE_RE = /^__increase__/

export default {
  name: 'PersonalDebtReport',
  middleware: 'auth',
  components: { DownloadButton, DebtSummaryCards },

  data() {
    return {
      debts: [],
      loading: true,
      search: '',
      status: 'all',
      exporting: false,
      shown: PAGE_SIZE,
      PAGE_SIZE,
    }
  },

  computed: {
    side() {
      const s = String((this.$route.params && this.$route.params.side) || '')
      return SIDES[s] ? s : 'given'
    },
    isGiven() { return this.side === 'given' },
    debtType() { return SIDES[this.side] },
    palette() {
      return this.isGiven ? { from: '#2563EB', to: '#4338CA' } : { from: '#059669', to: '#0F766E' }
    },
    t() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const all = {
        uz: {
          back: 'Orqaga', titleGiven: 'Yakunlangan berilgan qarzlar', titleTaken: 'Yakunlangan olingan qarzlar',
          subGiven: 'Siz bergan qarzlar: tugallangan va voz kechilgan', subTaken: 'Siz olgan qarzlar: tugallangan va voz kechilgan', countSuffix: 'ta qarz',
          searchPh: 'FISh, telefon yoki summa bo‘yicha qidirish...', all: 'Barchasi', open: 'Jarayonda', completed: 'Tugallangan', forgiven: 'Voz kechilgan', overdue: 'Muddati o‘tgan',
          colBorrower: 'Qarz oluvchi', colLender: 'Qarz beruvchi', colAmount: 'Qarz miqdori', colRemaining: 'Qoldiq', colDate: 'Qarz sanasi', colDueOrClosed: 'Yopilgan sana', colPaid: 'Qaytarilgan', colStatus: 'Holat', colPhone: 'Telefon', colCurrency: 'Valyuta',
          showMore: 'Yana ko‘rsatish', empty: 'Ma’lumot topilmadi', loading: 'Yuklanmoqda…', exportError: 'Eksport qilishda xatolik', loadError: 'Ma’lumotlarni yuklab bo‘lmadi',
        },
        ru: {
          back: 'Назад', titleGiven: 'Завершённые выданные долги', titleTaken: 'Завершённые полученные долги',
          subGiven: 'Выданные вами долги: завершённые и прощённые', subTaken: 'Полученные вами долги: завершённые и прощённые', countSuffix: 'долгов',
          searchPh: 'Поиск по ФИО, телефону или сумме...', all: 'Все', open: 'В процессе', completed: 'Завершённые', forgiven: 'Прощённые', overdue: 'Просрочен',
          colBorrower: 'Должник', colLender: 'Кредитор', colAmount: 'Сумма долга', colRemaining: 'Остаток', colDate: 'Дата долга', colDueOrClosed: 'Дата закрытия', colPaid: 'Возвращено', colStatus: 'Статус', colPhone: 'Телефон', colCurrency: 'Валюта',
          showMore: 'Показать ещё', empty: 'Данные не найдены', loading: 'Загрузка…', exportError: 'Ошибка экспорта', loadError: 'Не удалось загрузить данные',
        },
        kr: {
          back: 'Орқага', titleGiven: 'Якунланган берилган қарзлар', titleTaken: 'Якунланган олинган қарзлар',
          subGiven: 'Сиз берган қарзлар: тугалланган ва воз кечилган', subTaken: 'Сиз олган қарзлар: тугалланган ва воз кечилган', countSuffix: 'та қарз',
          searchPh: 'ФИШ, телефон ёки сумма бўйича қидириш...', all: 'Барчаси', open: 'Жараёнда', completed: 'Тугалланган', forgiven: 'Воз кечилган', overdue: 'Муддати ўтган',
          colBorrower: 'Қарз олувчи', colLender: 'Қарз берувчи', colAmount: 'Қарз миқдори', colRemaining: 'Қолдиқ', colDate: 'Қарз санаси', colDueOrClosed: 'Ёпилган сана', colPaid: 'Қайтарилган', colStatus: 'Ҳолат', colPhone: 'Телефон', colCurrency: 'Валюта',
          showMore: 'Яна кўрсатиш', empty: 'Маълумот топилмади', loading: 'Юкланмоқда…', exportError: 'Экспорт қилишда хатолик', loadError: 'Маълумотларни юклаб бўлмади',
        },
        en: {
          back: 'Back', titleGiven: 'Completed debts given', titleTaken: 'Completed debts received',
          subGiven: 'Debts you gave: completed and waived', subTaken: 'Debts you received: completed and waived', countSuffix: 'debt(s)',
          searchPh: 'Search by name, phone or amount...', all: 'All', open: 'In progress', completed: 'Completed', forgiven: 'Waived', overdue: 'Overdue',
          colBorrower: 'Borrower', colLender: 'Lender', colAmount: 'Debt amount', colRemaining: 'Remaining', colDate: 'Debt date', colDueOrClosed: 'Closed on', colPaid: 'Returned', colStatus: 'Status', colPhone: 'Phone', colCurrency: 'Currency',
          showMore: 'Show more', empty: 'No data found', loading: 'Loading…', exportError: 'Export error', loadError: 'Could not load data',
        },
        kaa: {
          back: 'Artqa', titleGiven: 'Tamamlanǵan berilgen qarızlar', titleTaken: 'Tamamlanǵan alınǵan qarızlar',
          subGiven: 'Siz bergen qarızlar: tamamlanǵan hám waz keshilgen', subTaken: 'Siz alǵan qarızlar: tamamlanǵan hám waz keshilgen', countSuffix: 'qarız',
          searchPh: 'FAÁ, telefon yamasa summa boyınsha izlew...', all: 'Barlıǵı', open: 'Processte', completed: 'Tamamlanǵan', forgiven: 'Waz keshilgen', overdue: 'Múddeti ótken',
          colBorrower: 'Qarız alıwshı', colLender: 'Qarız beriwshi', colAmount: 'Qarız muǵdarı', colRemaining: 'Qaldıq', colDate: 'Qarız sánesi', colDueOrClosed: 'Jabılǵan sáne', colPaid: 'Qaytarılǵan', colStatus: 'Jaǵday', colPhone: 'Telefon', colCurrency: 'Valyuta',
          showMore: 'Jáne kórsetiw', empty: 'Maǵlıwmat tabılmadı', loading: 'Júklenbekte…', exportError: 'Eksport etiwde qátelik', loadError: 'Maǵlıwmatlardı júklep bolmadı',
        },
      }
      return all[l] || all.uz
    },
    /** Jadval qatorlari (barcha qarzlar) — holat, sanalar, havola bir marta hisoblanadi */
    rows() {
      return this.debts.map((d) => this.toRow(d))
    },
    counts() {
      const c = { all: this.rows.length, completed: 0, forgiven: 0 }
      for (const r of this.rows) if (c[r.bucket] != null) c[r.bucket] += 1
      return c
    },
    tabs() {
      const t = this.t
      return [
        { key: 'all', label: t.all, count: this.counts.all, dot: '#3B82F6', soft: '#DBEAFE', fg: '#1D4ED8' },
        { key: 'completed', label: t.completed, count: this.counts.completed, dot: '#22C55E', soft: '#DCFCE7', fg: '#15803D' },
        { key: 'forgiven', label: t.forgiven, count: this.counts.forgiven, dot: '#F43F5E', soft: '#FFE4E6', fg: '#BE123C' },
      ]
    },
    visibleRows() {
      const q = String(this.search || '').trim().toLowerCase()
      const digits = q.replace(/\D/g, '')
      return this.rows.filter((r) => {
        if (this.status !== 'all' && r.bucket !== this.status) return false
        if (!q) return true
        if (r.name.toLowerCase().includes(q)) return true
        if (digits && r.phoneDigits.includes(digits)) return true
        if (digits && r.amountDigits.includes(digits)) return true
        return false
      })
    },
    pagedRows() { return this.visibleRows.slice(0, this.shown) },
    summary() { return summarizeDebts(this.debts) },
  },

  watch: {
    side() { this.load() },
    status() { this.shown = PAGE_SIZE },
    search() { this.shown = PAGE_SIZE },
    '$route.query.status'(v) { this.status = STATUSES.indexOf(v) >= 0 ? v : 'all' },
  },

  mounted() {
    const qs = this.$route.query && this.$route.query.status
    if (STATUSES.indexOf(qs) >= 0) this.status = qs
    this.load()
  },

  methods: {
    async load() {
      this.loading = true
      try {
        // 01.10 (doc3 3-rasm): faqat yakunlangan — tugallangan va voz kechilgan (ikkalasi ham status 'completed')
        const list = await fetchAllPersonalDebts(this.$api, { type: this.debtType, status: 'completed' })
        this.debts = list.filter((d) => d.type === this.debtType && !isOpenDebt(d) && d.status === 'completed')
      } catch (_) {
        this.debts = []
        this.$toast && this.$toast.error && this.$toast.error(this.t.loadError)
      } finally {
        this.loading = false
      }
    },
    setStatus(key) {
      this.status = key
      const query = { ...this.$route.query }
      if (key === 'all') delete query.status
      else query.status = key
      this.$router.replace({ query }).catch(() => {})
    },
    money(v, cur) { return formatMoneyCur(v, cur) },

    /** Tugallangan qarzning yopilgan sanasi — oxirgi to'lov / voz kechish (qo'shimcha qarz emas) */
    closedDate(d) {
      const pays = (Array.isArray(d.payments) ? d.payments : []).filter((p) => !MARKER_INCREASE_RE.test(String((p && p.notes) || '')))
      let best = null
      for (const p of pays) {
        const v = p.created_at || p.payment_date
        if (v && (!best || new Date(v) > new Date(best))) best = v
      }
      return best || d.updated_at || null
    },

    stateOf(d) {
      const t = this.t
      if (isOpenDebt(d)) {
        const overdue = d.due_date && new Date(d.due_date) < new Date()
        return overdue
          ? { bucket: 'open', label: t.overdue, dot: '#EF4444', soft: '#FEE2E2', fg: '#B91C1C' }
          : { bucket: 'open', label: t.open, dot: '#F59E0B', soft: '#FEF3C7', fg: '#B45309' }
      }
      if (isForgivenDebt(d)) return { bucket: 'forgiven', label: t.forgiven, dot: '#F43F5E', soft: '#FFE4E6', fg: '#BE123C' }
      return { bucket: 'completed', label: t.completed, dot: '#22C55E', soft: '#DCFCE7', fg: '#15803D' }
    },

    /** O'z qarzim → qarz sahifasi; hamkor qaydi / do'kon → kontragent sahifasi (modallar o'sha yerda) */
    linkOf(d) {
      const tab = this.isGiven ? 'given' : 'taken'
      if (!d.is_mirror && !d.is_shop_debt) {
        return this.localePath({ name: 'finance-debts-id', params: { id: d.id }, query: { tab } })
      }
      const key = buildDebtGroupKey(d)
      return this.localePath({ name: 'finance-debts-group-key', params: { key: encodeGroupKey(key) }, query: { tab } })
    },

    toRow(d) {
      const state = this.stateOf(d)
      const open = state.bucket === 'open'
      const name = d.is_shop_debt ? (d.source_name || '—') : (titleCaseName(d.source_name) || d.source_name || '—')
      return {
        key: (d.is_shop_debt ? 's' : (d.is_mirror ? 'm' : 'o')) + '-' + d.id,
        name,
        phone: d.phone ? formatPhoneUz(d.phone) : '',
        phoneDigits: String(d.phone || '').replace(/\D/g, ''),
        amountDigits: (String(d.amount || '') + ' ' + String(d.remaining_amount || '')).replace(/\D/g, ' '),
        amount: Number(d.amount) || 0,
        left: open ? (Number(d.remaining_amount) || 0) : 0,
        paid: paidOfDebt(d),
        currency: d.currency || 'UZS',
        date: fmtDMY(d.start_date || d.created_at, '—'),
        endDate: open ? fmtDMY(d.due_date, '—') : fmtDMY(this.closedDate(d), '—'),
        bucket: state.bucket,
        state,
        to: this.linkOf(d),
      }
    },

    /** Ko'rinayotgan (filtr + qidiruv) qatorlarni Excel'ga — SheetJS dinamik import */
    async exportExcel() {
      if (this.exporting || !this.visibleRows.length) return
      this.exporting = true
      try {
        const mod = await import('xlsx')
        const XLSX = mod.default || mod
        const t = this.t
        const data = this.visibleRows.map((r) => ({
          [this.isGiven ? t.colBorrower : t.colLender]: r.name,
          [t.colPhone]: r.phone,
          [t.colAmount]: Math.round(r.amount),
          [t.colPaid]: Math.round(r.paid),
          [t.colCurrency]: r.currency,
          [t.colDate]: r.date,
          [t.colDueOrClosed]: r.endDate,
          [t.colStatus]: r.state.label,
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        ws['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 14 }]
        const wb = XLSX.utils.book_new()
        const title = this.isGiven ? t.titleGiven : t.titleTaken
        XLSX.utils.book_append_sheet(wb, ws, String(title).slice(0, 31))
        XLSX.writeFile(wb, `${title} - ${new Date().toISOString().slice(0, 10)}.xlsx`)
      } catch (_) {
        this.$toast && this.$toast.error && this.$toast.error(this.t.exportError)
      } finally { this.exporting = false }
    },
  },
}
</script>
