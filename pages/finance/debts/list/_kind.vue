<template>
  <!-- SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band (7-rasm): Shaxsiy qarz kartalari endi ro'yxatni sahifa
       OSTIDA ochmaydi — Qarz shartnomasi (debt-list/credit-list) va Qarz daftari kabi ALOHIDA SAHIFA.
       `kind`: given | taken | overdue-given | overdue-taken | completed | all.
       Tarkib: gradient hero (orqaga, sarlavha, "N ta qarz"), qidiruv + "Yuklab olish", kontragent
       guruh ro'yxati (DebtGroupList — index'dagi markup, funksiyalar o'zgarmagan). -->
  <div class="personal-debts-list pb-8">
    <!-- Hero -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="px-5 sm:px-6 py-5" :style="'background: linear-gradient(135deg, ' + palette.from + ' 0%, ' + palette.to + ' 100%);'">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-4 min-w-0">
            <nuxt-link :to="localePath({ name: 'finance-debts' })" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all" style="background: rgba(255,255,255,0.2);" :title="texts.back">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </nuxt-link>
            <div class="min-w-0">
              <h1 class="text-xl lg:text-2xl font-bold text-white truncate">{{ pageTitle }}</h1>
              <p class="text-sm mt-0.5" style="color: rgba(255,255,255,0.85);">{{ pageSubtitle }}</p>
            </div>
          </div>
          <div class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl flex-shrink-0" style="background: rgba(255,255,255,0.2);">
            <span class="text-white font-semibold text-lg">{{ debtCount }}</span>
            <span class="text-sm" style="color: rgba(255,255,255,0.85);">{{ texts.countSuffix }}</span>
          </div>
        </div>
      </div>

      <!-- Qidiruv + Yuklab olish -->
      <div class="px-5 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <!-- S5: FISh / telefon / summa bo'yicha qidiruv -->
          <div class="relative w-full md:flex-1 md:max-w-md">
            <svg class="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" style="top: 50%; transform: translateY(-50%);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              v-model="search"
              type="text"
              :placeholder="$t('finance.debt_search_ph')"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center gap-2 justify-between md:justify-end">
            <span class="sm:hidden text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{{ debtCount }} {{ texts.countSuffix }}</span>
            <!-- 26.09 hujjat 2-band: umumiy "Yuklab olish" chip'i -->
            <DownloadButton :loading="exporting" :disabled="!groupedDebts.length" @click="exportExcel" />
          </div>
        </div>
      </div>
    </div>

    <!-- Kontragent guruh ro'yxati -->
    <DebtGroupList :groups="groupedDebts" :loading="loading" @select="onGroupClick" />
  </div>
</template>

<script>
import DebtGroupList from '~/components/finance/DebtGroupList.vue'
import DownloadButton from '~/components/ui/DownloadButton.vue'
import { titleCaseName, formatPhoneUz } from '~/utils/helpers'
// SS-27 (2026-09-19): guruhlash mantiqi guruh sahifasi bilan BIRGA ishlatiladi (DRY).
import { groupDebtsByCounterparty, encodeGroupKey } from '~/utils/debtGroups'

/** Ro'yxat turlari (URL `kind` parametri) */
const LIST_KINDS = ['given', 'taken', 'overdue-given', 'overdue-taken', 'completed', 'all']

/** Hero ranglari: berilgan — ko'k (karta bilan bir xil), olingan — yashil, muddati o'tgan — qizil,
    tugallangan — kulrang, barchasi — indigo. */
const PALETTES = {
  given: { from: '#2563EB', to: '#4338CA' },
  taken: { from: '#059669', to: '#0F766E' },
  'overdue-given': { from: '#E11D48', to: '#BE123C' },
  'overdue-taken': { from: '#E11D48', to: '#BE123C' },
  completed: { from: '#4B5563', to: '#374151' },
  all: { from: '#4F46E5', to: '#4338CA' },
}

export default {
  name: 'PersonalDebtsList',
  middleware: 'auth',
  components: { DebtGroupList, DownloadButton },

  data() {
    return {
      debts: [],
      loading: false,
      search: '',
      exporting: false,
    }
  },

  computed: {
    /** URL'dagi tur; noma'lum bo'lsa — 'all' */
    kind() {
      const k = String((this.$route.params && this.$route.params.kind) || '')
      return LIST_KINDS.indexOf(k) >= 0 ? k : 'all'
    },
    palette() { return PALETTES[this.kind] || PALETTES.all },
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const t = {
        uz: {
          back: 'Orqaga', countSuffix: 'ta qarz',
          titles: { given: 'Berilgan qarz', taken: 'Olingan qarz', 'overdue-given': "Berilgan qarz — muddati o'tgan", 'overdue-taken': "Olingan qarz — muddati o'tgan", completed: 'Tugallangan qarzlar', all: 'Barcha qarzlar' },
          subtitles: { given: "Sizdan qarz olgan shaxslar ro'yxati", taken: "Sizga qarz bergan shaxslar ro'yxati", 'overdue-given': "Qaytarish muddati o'tgan berilgan qarzlar", 'overdue-taken': "Qaytarish muddati o'tgan olingan qarzlar", completed: "To'liq yopilgan qarzlar", all: 'Barcha shaxsiy qarzlaringiz' },
          colName: 'Kontragent', colPhone: 'Telefon', colCount: 'Qarzlar soni', colUzs: 'Qoldiq (UZS)', colUsd: 'Qoldiq (USD)', colType: 'Turi', lent: 'Berilgan', borrowed: 'Olingan', mixed: 'Aralash', shop: "Do'kon", exportError: 'Eksport qilishda xatolik',
        },
        ru: {
          back: 'Назад', countSuffix: 'долгов',
          titles: { given: 'Выданный долг', taken: 'Полученный долг', 'overdue-given': 'Выданный долг — просрочен', 'overdue-taken': 'Полученный долг — просрочен', completed: 'Завершённые долги', all: 'Все долги' },
          subtitles: { given: 'Список лиц, взявших у вас в долг', taken: 'Список лиц, давших вам в долг', 'overdue-given': 'Выданные долги с истёкшим сроком возврата', 'overdue-taken': 'Полученные долги с истёкшим сроком возврата', completed: 'Полностью закрытые долги', all: 'Все ваши личные долги' },
          colName: 'Контрагент', colPhone: 'Телефон', colCount: 'Кол-во долгов', colUzs: 'Остаток (UZS)', colUsd: 'Остаток (USD)', colType: 'Тип', lent: 'Выдано', borrowed: 'Получено', mixed: 'Смешанный', shop: 'Магазин', exportError: 'Ошибка экспорта',
        },
        kr: {
          back: 'Орқага', countSuffix: 'та қарз',
          titles: { given: 'Берилган қарз', taken: 'Олинган қарз', 'overdue-given': 'Берилган қарз — муддати ўтган', 'overdue-taken': 'Олинган қарз — муддати ўтган', completed: 'Тугалланган қарзлар', all: 'Барча қарзлар' },
          subtitles: { given: 'Сиздан қарз олган шахслар рўйхати', taken: 'Сизга қарз берган шахслар рўйхати', 'overdue-given': 'Қайтариш муддати ўтган берилган қарзлар', 'overdue-taken': 'Қайтариш муддати ўтган олинган қарзлар', completed: 'Тўлиқ ёпилган қарзлар', all: 'Барча шахсий қарзларингиз' },
          colName: 'Контрагент', colPhone: 'Телефон', colCount: 'Қарзлар сони', colUzs: 'Қолдиқ (UZS)', colUsd: 'Қолдиқ (USD)', colType: 'Тури', lent: 'Берилган', borrowed: 'Олинган', mixed: 'Аралаш', shop: 'Дўкон', exportError: 'Экспорт қилишда хатолик',
        },
        en: {
          back: 'Back', countSuffix: 'debt(s)',
          titles: { given: 'Debt given', taken: 'Debt received', 'overdue-given': 'Debt given — overdue', 'overdue-taken': 'Debt received — overdue', completed: 'Completed debts', all: 'All debts' },
          subtitles: { given: 'People who borrowed from you', taken: 'People who lent to you', 'overdue-given': 'Given debts past their due date', 'overdue-taken': 'Received debts past their due date', completed: 'Fully closed debts', all: 'All your personal debts' },
          colName: 'Counterparty', colPhone: 'Phone', colCount: 'Debts', colUzs: 'Remaining (UZS)', colUsd: 'Remaining (USD)', colType: 'Type', lent: 'Given', borrowed: 'Received', mixed: 'Mixed', shop: 'Shop', exportError: 'Export error',
        },
        kaa: {
          back: 'Artqa', countSuffix: 'qarız',
          titles: { given: 'Berilgen qarız', taken: 'Alınǵan qarız', 'overdue-given': 'Berilgen qarız — múddeti ótken', 'overdue-taken': 'Alınǵan qarız — múddeti ótken', completed: 'Tamamlanǵan qarızlar', all: 'Barlıq qarızlar' },
          subtitles: { given: 'Sizden qarız alǵan adamlar dizimi', taken: 'Sizge qarız bergen adamlar dizimi', 'overdue-given': 'Qaytarıw múddeti ótken berilgen qarızlar', 'overdue-taken': 'Qaytarıw múddeti ótken alınǵan qarızlar', completed: 'Tolıq jabılǵan qarızlar', all: 'Barlıq jeke qarızlarıńız' },
          colName: 'Kontragent', colPhone: 'Telefon', colCount: 'Qarızlar sanı', colUzs: 'Qaldıq (UZS)', colUsd: 'Qaldıq (USD)', colType: 'Túri', lent: 'Berilgen', borrowed: 'Alınǵan', mixed: 'Aralas', shop: 'Dúkan', exportError: 'Eksport etiwde qátelik',
        },
      }
      return t[l] || t.uz
    },
    pageTitle() { return this.texts.titles[this.kind] || this.texts.titles.all },
    pageSubtitle() { return this.texts.subtitles[this.kind] || '' },
    /** Turga mos qarzlar (index'dagi `scopedDebts` mantig'i aynan) */
    scopedDebts() {
      const k = this.kind
      if (k === 'completed' || k === 'all') return this.debts
      const base = k.indexOf('given') >= 0 ? 'lent' : 'borrowed'
      const overdue = k.indexOf('overdue') === 0
      return this.debts.filter((d) => {
        if (d.type !== base) return false
        if (d.status !== 'active' && d.status !== 'overdue') return false
        return overdue ? this.isOverdue(d) : true
      })
    },
    // S5: qidiruv — FISh / telefon / summa bo'yicha (client-side)
    filteredDebts() {
      const q = String(this.search || '').trim().toLowerCase()
      if (!q) return this.scopedDebts
      const digits = q.replace(/\D/g, '')
      return this.scopedDebts.filter((d) => {
        const name = String(d.source_name || '').toLowerCase()
        const phone = String(d.phone || '').replace(/\D/g, '')
        const amt = (String(d.amount || '') + ' ' + String(d.remaining_amount || '')).replace(/\D/g, ' ')
        if (name.includes(q)) return true
        if (digits && phone.includes(digits)) return true
        if (digits && amt.includes(digits)) return true
        return false
      })
    },
    // SS-5 (2026-09-18): filteredDebts'ni KONTRAGENT bo'yicha guruhlash (utils/debtGroups).
    groupedDebts() { return groupDebtsByCounterparty(this.filteredDebts) },
    /** Hero'dagi hisoblagich — qidiruvdan MUSTAQIL, turdagi qarzlar soni */
    debtCount() { return this.scopedDebts.length },
  },

  watch: {
    // Bir sahifa ichida tur almashsa (masalan given → taken) qayta yuklanadi
    kind() { this.loadDebts() },
  },

  async mounted() {
    await this.loadDebts()
  },

  methods: {
    titleCaseName,

    /** Turga mos so'rov: karta turlari — faol; completed — tugallangan; all — hammasi (limit 100) */
    async loadDebts() {
      try {
        this.loading = true
        const params = { limit: 100 }
        if (this.kind === 'completed') params.status = 'completed'
        else if (this.kind !== 'all') params.status = 'active'
        const res = await this.$api.getPersonalDebts(params)
        if (res && res.data && res.data.success) {
          // SS7: o'z qarzlarim + TELEFON bo'yicha ko'zgu qarzlar (faqat-o'qish). created_at bo'yicha aralash.
          const own = res.data.data || []
          const mirrors = res.data.mirror_debts || []
          this.debts = [...own, ...mirrors].sort((a, b) =>
            new Date(b.created_at || 0) - new Date(a.created_at || 0))
        }
      } catch (error) {
        console.error('Load debts error:', error)
        this.$toast && this.$toast.error && this.$toast.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    // SS-27 (2026-09-19): guruh qatoriga bosish — kontragentning alohida sahifasi.
    // `tab` = joriy ro'yxat turi — "Orqaga" AYNI shu ro'yxatga qaytadi.
    onGroupClick(group) {
      if (!group) return
      this.$router.push(this.localePath({
        name: 'finance-debts-group-key',
        params: { key: encodeGroupKey(group.key) },
        query: { tab: this.kind }
      }))
    },

    isOverdue(debt) {
      if (!debt.due_date || (debt.status !== 'active' && debt.status !== 'overdue')) return false
      return new Date(debt.due_date) < new Date()
    },

    /** Ko'rinayotgan guruh ro'yxatini Excel'ga (SheetJS dinamik import — bundle og'irlashmaydi) */
    async exportExcel() {
      if (this.exporting || !this.groupedDebts.length) return
      this.exporting = true
      try {
        const mod = await import('xlsx')
        const XLSX = mod.default || mod
        const t = this.texts
        const sum = (g, cur, field) => Math.round(((g.byCurrency || []).find((c) => c.currency === cur) || {})[field] || 0)
        const rows = this.groupedDebts.map((g) => ({
          [t.colName]: g.kind === 'shop' ? g.name : titleCaseName(g.name),
          [t.colPhone]: g.phone ? formatPhoneUz(g.phone) : '',
          [t.colCount]: g.count,
          [t.colUzs]: sum(g, 'UZS', 'lent') - sum(g, 'UZS', 'borrowed'),
          [t.colUsd]: sum(g, 'USD', 'lent') - sum(g, 'USD', 'borrowed'),
          [t.colType]: g.kind === 'shop' ? t.shop : (g.mixed ? t.mixed : (g.displayType === 'lent' ? t.lent : t.borrowed)),
        }))
        const ws = XLSX.utils.json_to_sheet(rows)
        ws['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 12 }]
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, String(this.pageTitle).slice(0, 31))
        XLSX.writeFile(wb, `${this.pageTitle} - ${new Date().toISOString().slice(0, 10)}.xlsx`)
      } catch (_) {
        this.$toast && this.$toast.error && this.$toast.error(this.texts.exportError)
      } finally { this.exporting = false }
    },
  },
}
</script>
