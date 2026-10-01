<template>
  <!-- 30.09 (doc1 17/19/20-rasm): kontragent sahifasidagi amallar endi "ENG OXIRGI aktiv qarz"ga
       emas, foydalanuvchi TANLAGAN qarz(lar)ga qo'llanadi:
         • close / pay — "To'liq" yoki "Qisman" (summa kiritiladi) — "Qarzni yopish" va "Qarzni qaytarish"
           BITTA amalga birlashtirildi (bo'sh/to'liq = yopish, qisman = to'lov);
         • forgive     — bir yoki bir nechta qarz (yoki "Barchasi") tanlanadi.
       01.10 (doc3 5/6-rasm): close / pay da ham BIR NECHTA (yoki barcha) qarz birga tanlanadi; kiritilgan
       summa AVVAL MUDDATI YAQIN qarzlarga taqsimlanadi, qoldiq muddati UZOQ qarzda qoladi (oldindan
       ko'rinadi). Faqat bitta valyuta — boshqa valyutadagi qarz bosilsa tanlov o'sha valyutaga o'tadi.
       Ranglar inline (Tailwind v2 JIT o'chiq; `disabled:` varianti ishlamaydi). -->
  <div class="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style="z-index: 120">
    <div class="absolute inset-0" style="background: rgba(17, 24, 39, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)" @click="cancel"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md overflow-hidden flex flex-col" style="max-height: 92vh">
      <div class="p-5 pb-3 text-center">
        <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" :style="'background:' + tone.soft + ';color:' + tone.fg">{{ tone.icon }}</div>
        <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500 mt-1.5 leading-relaxed">{{ subtitle }}</p>
      </div>

      <div class="px-5 overflow-y-auto" style="max-height: 52vh">
        <!-- "Barchasi" (close/pay — joriy valyutadagi barcha qarzlar) -->
        <button
          v-if="allPool.length > 1"
          type="button"
          class="w-full flex items-center justify-between gap-3 px-4 py-3 mb-2 rounded-xl border text-sm font-semibold transition-colors"
          :style="allSelected ? 'border-color:' + tone.btn + ';background:' + tone.soft + ';color:' + tone.fg : 'border-color:#E5E7EB;color:#374151'"
          @click="toggleAll"
        >
          <span class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0" :style="allSelected ? 'border-color:' + tone.btn + ';background:' + tone.btn : 'border-color:#D1D5DB'">
              <svg v-if="allSelected" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            </span>
            {{ t.all }} ({{ allPool.length }})
          </span>
          <span class="text-xs font-medium text-right">{{ totalsText(allPool) }}</span>
        </button>

        <div class="space-y-2">
          <button
            v-for="d in debts"
            :key="keyOf(d)"
            type="button"
            class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors"
            :style="isSelected(d) ? 'border-color:' + tone.btn + ';background:' + tone.soft : 'border-color:#E5E7EB;background:#fff'"
            @click="toggle(d)"
          >
            <span class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0" :style="isSelected(d) ? 'border-color:' + tone.btn + ';background:' + tone.btn : 'border-color:#D1D5DB'">
              <svg v-if="isSelected(d)" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            </span>
            <span class="flex-1 min-w-0">
              <span class="block text-sm font-semibold text-gray-900">{{ money(d.remaining_amount, d.currency) }}
                <span v-if="d.is_mirror" class="ml-1 inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-full align-middle" style="background:#ECFDF5;color:#065F46">🔗 {{ t.linked }}</span>
              </span>
              <span class="block text-xs text-gray-500 mt-0.5">
                {{ t.date }} {{ fmt(d.start_date || d.created_at) }}<template v-if="d.due_date"> · {{ t.due }} {{ fmt(d.due_date) }}</template>
              </span>
              <span v-if="Number(d.amount) !== Number(d.remaining_amount)" class="block text-xs text-gray-400">{{ t.initial }}: {{ money(d.amount, d.currency) }}</span>
              <!-- 01.10: taqsimot oldindan ko'rinishi (bir nechta qarz + qisman summa) -->
              <span v-if="previewOf(d)" class="block text-xs font-semibold mt-0.5" :style="'color:' + (previewOf(d).closes ? '#15803D' : '#B45309')">
                <template v-if="previewOf(d).closes">✓ {{ t.willClose }}</template>
                <template v-else-if="previewOf(d).pay > 0">− {{ money(previewOf(d).pay, d.currency) }} · {{ t.willRemain }} {{ money(previewOf(d).remainingAfter, d.currency) }}</template>
                <template v-else>{{ t.untouched }}</template>
              </span>
            </span>
            <span v-if="isOverdue(d)" class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style="background:#FEE2E2;color:#B91C1C">{{ t.overdue }}</span>
          </button>
        </div>

        <!-- To'liq / qisman (faqat close|pay) -->
        <div v-if="!isForgive && selectedDebts.length" class="mt-4">
          <div class="grid grid-cols-2 gap-1 p-1 rounded-xl" style="background:#F3F4F6">
            <button type="button" class="py-2 rounded-lg text-sm font-semibold transition-colors" :style="partial ? 'color:#4B5563' : 'background:#fff;color:#111827;box-shadow:0 1px 2px rgba(0,0,0,.08)'" @click="partial = false">{{ t.full }}</button>
            <button type="button" class="py-2 rounded-lg text-sm font-semibold transition-colors" :style="partial ? 'background:#fff;color:#111827;box-shadow:0 1px 2px rgba(0,0,0,.08)' : 'color:#4B5563'" @click="partial = true">{{ t.part }}</button>
          </div>
          <div v-if="partial" class="mt-3">
            <label class="block text-xs font-medium text-gray-500 mb-1">{{ mode === 'pay' ? t.payAmount : t.closeAmount }}</label>
            <div class="relative">
              <input
                v-model="amountDisplay"
                type="text"
                inputmode="numeric"
                :placeholder="fmtNum(selectedTotal)"
                class="w-full border rounded-xl px-3 py-2.5 pr-16 text-sm outline-none focus:ring-2"
                :class="amountOver ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'"
              />
              <span class="absolute right-3 text-sm text-gray-500" style="top:50%;transform:translateY(-50%)">{{ selectedCurrency }}</span>
            </div>
            <p v-if="amountOver" class="text-xs text-red-600 mt-1.5">{{ t.over }} ({{ money(selectedTotal, selectedCurrency) }})</p>
            <p v-else-if="selectedDebts.length > 1" class="text-xs text-gray-400 mt-1.5">{{ t.multiHint }}</p>
            <p v-else class="text-xs text-gray-400 mt-1.5">{{ t.partHint }}</p>
          </div>
          <p v-else class="text-xs text-gray-400 mt-2">{{ t.fullHint }} {{ money(selectedTotal, selectedCurrency) }}</p>
        </div>
        <p v-if="isForgive" class="text-xs text-gray-400 mt-3">{{ t.forgiveHint }}</p>
      </div>

      <div class="flex gap-2 p-5 pt-4">
        <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" :disabled="busy" @click="cancel">{{ t.cancel }}</button>
        <button
          type="button"
          class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm whitespace-nowrap"
          :style="'background:' + tone.btn + ';' + (busy || !canConfirm ? 'opacity:.6;cursor:not-allowed' : '')"
          :disabled="busy || !canConfirm"
          @click="confirm"
        >{{ busy ? '…' : confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * DebtActionModal — kontragentning qaysi qarz(lar)iga amal qo'llanishini tanlash.
 *
 * Props:
 *   - mode:  'close' (berilgan qarz qaytarildi) | 'pay' (olingan qarzni qaytarish) | 'forgive' (voz kechish)
 *   - debts: tanlash mumkin bo'lgan OCHIQ qarzlar (o'z qaydlarim + men boshqaradigan hamkor qaydlari)
 *   - name:  kontragent ismi (sarlavha matni uchun)
 *   - busy:  amal bajarilmoqda
 * Hodisalar:
 *   - cancel
 *   - confirm({ debts: Object[], amount: number|null })  amount=null — tanlanganlarning butun qoldig'i.
 *     close/pay da bir nechta qarz bo'lsa — `amount` muddati yaqin qarzlardan boshlab taqsimlanadi
 *     (utils/debtAllocation; serverda POST /finance/debts/allocate-payment).
 */
import { formatMoneyCur, fmtDMY } from '~/utils/helpers'
import { allocatePayment } from '~/utils/debtAllocation'

const TEXTS = {
  uz: {
    closeTitle: 'Qarzni yopish', payTitle: 'Qarzni qaytarish', forgiveTitle: 'Qarzdan voz kechish',
    closeSub: '«{name}» qaysi qarz(lar)ni qaytardi? Bir yoki bir nechta qarzni tanlang va to‘liq yoki qisman yoping.',
    paySub: '«{name}»ga qaysi qarz(lar)ni qaytardingiz? Bir yoki bir nechta qarzni tanlang va to‘liq yoki qisman summani kiriting.',
    forgiveSub: '«{name}» qaysi qarz(lar)idan voz kechasiz? Bir nechtasini yoki barchasini tanlashingiz mumkin.',
    all: 'Barchasi', linked: 'Bog‘langan', date: 'Qarz sanasi:', due: 'Muddat:', initial: 'Dastlabki summa', overdue: 'Muddati o‘tgan',
    full: 'To‘liq', part: 'Qisman', closeAmount: 'Qaytarilgan summa', payAmount: 'Qaytarayotgan summangiz',
    over: 'Summa tanlangan qarzlar qoldig‘idan oshmasligi kerak', partHint: 'Qoldiqqa teng summa kiritilsa — qarz to‘liq yopiladi.', fullHint: 'Butun qoldiq yopiladi:',
    multiHint: 'Summa avval muddati yaqin qarzlarga taqsimlanadi; qoldiq muddati uzoq qarzda qoladi.',
    willClose: 'to‘liq yopiladi', willRemain: 'qoladi:', untouched: 'o‘zgarmaydi',
    forgiveHint: 'Tanlangan qarzlar yopiladi va qolgan summa qaytmaydi.',
    cancel: 'Bekor qilish', closeYes: 'Yopish', payYes: 'Qayd etish', forgiveYes: 'Voz kechish', forgiveYesN: 'Voz kechish ({n})',
  },
  ru: {
    closeTitle: 'Закрыть долг', payTitle: 'Вернуть долг', forgiveTitle: 'Простить долг',
    closeSub: 'Какие долги вернул(а) «{name}»? Выберите один или несколько долгов и закройте полностью или частично.',
    paySub: 'Какие долги вы вернули «{name}»? Выберите один или несколько долгов и укажите полную или частичную сумму.',
    forgiveSub: 'Какие долги «{name}» вы прощаете? Можно выбрать несколько или все.',
    all: 'Все', linked: 'Связан', date: 'Дата долга:', due: 'Срок:', initial: 'Начальная сумма', overdue: 'Просрочен',
    full: 'Полностью', part: 'Частично', closeAmount: 'Возвращённая сумма', payAmount: 'Сумма возврата',
    over: 'Сумма не должна превышать остаток выбранных долгов', partHint: 'Если сумма равна остатку — долг закроется полностью.', fullHint: 'Будет погашен весь остаток:',
    multiHint: 'Сумма сначала гасит долги с ближайшим сроком; остаток останется на долге с самым дальним сроком.',
    willClose: 'закроется полностью', willRemain: 'останется:', untouched: 'без изменений',
    forgiveHint: 'Выбранные долги будут закрыты, оставшаяся сумма не вернётся.',
    cancel: 'Отмена', closeYes: 'Закрыть', payYes: 'Записать', forgiveYes: 'Простить', forgiveYesN: 'Простить ({n})',
  },
  kr: {
    closeTitle: 'Қарзни ёпиш', payTitle: 'Қарзни қайтариш', forgiveTitle: 'Қарздан воз кечиш',
    closeSub: '«{name}» қайси қарз(лар)ни қайтарди? Бир ёки бир нечта қарзни танланг ва тўлиқ ёки қисман ёпинг.',
    paySub: '«{name}»га қайси қарз(лар)ни қайтардингиз? Бир ёки бир нечта қарзни танланг ва тўлиқ ёки қисман суммани киритинг.',
    forgiveSub: '«{name}» қайси қарз(лар)идан воз кечасиз? Бир нечтасини ёки барчасини танлашингиз мумкин.',
    all: 'Барчаси', linked: 'Боғланган', date: 'Қарз санаси:', due: 'Муддат:', initial: 'Дастлабки сумма', overdue: 'Муддати ўтган',
    full: 'Тўлиқ', part: 'Қисман', closeAmount: 'Қайтарилган сумма', payAmount: 'Қайтараётган суммангиз',
    over: 'Сумма танланган қарзлар қолдиғидан ошмаслиги керак', partHint: 'Қолдиққа тенг сумма киритилса — қарз тўлиқ ёпилади.', fullHint: 'Бутун қолдиқ ёпилади:',
    multiHint: 'Сумма аввал муддати яқин қарзларга тақсимланади; қолдиқ муддати узоқ қарзда қолади.',
    willClose: 'тўлиқ ёпилади', willRemain: 'қолади:', untouched: 'ўзгармайди',
    forgiveHint: 'Танланган қарзлар ёпилади ва қолган сумма қайтмайди.',
    cancel: 'Бекор қилиш', closeYes: 'Ёпиш', payYes: 'Қайд этиш', forgiveYes: 'Воз кечиш', forgiveYesN: 'Воз кечиш ({n})',
  },
  en: {
    closeTitle: 'Close debt', payTitle: 'Repay debt', forgiveTitle: 'Waive debt',
    closeSub: 'Which debt(s) did «{name}» repay? Choose one or several debts and close them fully or partially.',
    paySub: 'Which debt(s) did you repay to «{name}»? Choose one or several debts and enter the full or partial amount.',
    forgiveSub: 'Which debts of «{name}» do you waive? You can choose several or all of them.',
    all: 'All', linked: 'Linked', date: 'Debt date:', due: 'Due:', initial: 'Initial amount', overdue: 'Overdue',
    full: 'In full', part: 'Partially', closeAmount: 'Repaid amount', payAmount: 'Amount you repay',
    over: 'Amount must not exceed the balance of the selected debts', partHint: 'If the amount equals the balance, the debt is closed in full.', fullHint: 'The whole balance will be closed:',
    multiHint: 'The amount is applied to the debts due soonest first; any remainder stays on the debt due last.',
    willClose: 'closed in full', willRemain: 'remains:', untouched: 'unchanged',
    forgiveHint: 'The selected debts will be closed and the remaining amount will not be returned.',
    cancel: 'Cancel', closeYes: 'Close', payYes: 'Record', forgiveYes: 'Waive', forgiveYesN: 'Waive ({n})',
  },
  kaa: {
    closeTitle: 'Qarızdı jabıw', payTitle: 'Qarızdı qaytarıw', forgiveTitle: 'Qarızdan waz keshiw',
    closeSub: '«{name}» qaysı qarız(lar)dı qaytardı? Bir yamasa bir neshe qarızdı tańlań hám tolıq yamasa bólek jabıń.',
    paySub: '«{name}»ǵa qaysı qarız(lar)dı qaytardıńız? Bir yamasa bir neshe qarızdı tańlań hám tolıq yamasa bólek summanı kiritiń.',
    forgiveSub: '«{name}» qaysı qarız(lar)ınan waz keshesiz? Bir neshewin yamasa barlıǵın tańlawıńız múmkin.',
    all: 'Barlıǵı', linked: 'Baylanısqan', date: 'Qarız sánesi:', due: 'Múddet:', initial: 'Dáslepki summa', overdue: 'Múddeti ótken',
    full: 'Tolıq', part: 'Bólek', closeAmount: 'Qaytarılǵan summa', payAmount: 'Qaytarıp atırǵan summańız',
    over: 'Summa tańlanǵan qarızlar qaldıǵınan aspawı kerek', partHint: 'Qaldıqqa teń summa kiritilse — qarız tolıq jabıladı.', fullHint: 'Pútkil qaldıq jabıladı:',
    multiHint: 'Summa aldın múddeti jaqın qarızlarǵa bólistiriledi; qaldıq múddeti alıs qarızda qaladı.',
    willClose: 'tolıq jabıladı', willRemain: 'qaladı:', untouched: 'ózgermeydi',
    forgiveHint: 'Tańlanǵan qarızlar jabıladı hám qalǵan summa qaytpaydı.',
    cancel: 'Biykar etiw', closeYes: 'Jabıw', payYes: 'Dizimge alıw', forgiveYes: 'Waz keshiw', forgiveYesN: 'Waz keshiw ({n})',
  },
}

export default {
  name: 'DebtActionModal',
  props: {
    mode: { type: String, required: true, validator: (v) => ['close', 'pay', 'forgive'].indexOf(v) >= 0 },
    debts: { type: Array, default: () => [] },
    name: { type: String, default: '' },
    busy: { type: Boolean, default: false },
  },
  data() {
    return {
      selected: [],
      partial: false,
      amount: '',
    }
  },
  computed: {
    isForgive() { return this.mode === 'forgive' },
    t() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      return TEXTS[l] || TEXTS.uz
    },
    tone() {
      if (this.mode === 'forgive') return { soft: '#FFE4E6', fg: '#BE123C', btn: '#E11D48', icon: '🚫' }
      return { soft: '#DCFCE7', fg: '#166534', btn: '#16A34A', icon: this.mode === 'pay' ? '💳' : '✓' }
    },
    title() {
      if (this.mode === 'forgive') return this.t.forgiveTitle
      return this.mode === 'pay' ? this.t.payTitle : this.t.closeTitle
    },
    subtitle() {
      const tpl = this.mode === 'forgive' ? this.t.forgiveSub : (this.mode === 'pay' ? this.t.paySub : this.t.closeSub)
      return tpl.replace('{name}', this.name || '—')
    },
    selectedDebts() {
      return this.debts.filter((d) => this.selected.indexOf(this.keyOf(d)) >= 0)
    },
    /** close/pay: tanlov valyutasi (tanlanmagan bo'lsa — ro'yxatdagi birinchi qarz valyutasi) */
    selectedCurrency() {
      const d = this.selectedDebts[0] || this.debts[0]
      return (d && d.currency) || 'UZS'
    },
    /** "Barchasi" qamrovi: voz kechishda — hammasi; yopish/qaytarishda — joriy valyutadagilar */
    allPool() {
      if (this.isForgive) return this.debts
      return this.debts.filter((d) => (d.currency || 'UZS') === this.selectedCurrency)
    },
    allSelected() {
      return this.allPool.length > 0 && this.allPool.every((d) => this.isSelected(d))
    },
    selectedTotal() {
      return this.selectedDebts.reduce((s, d) => s + (Number(d.remaining_amount) || 0), 0)
    },
    amountDisplay: {
      get() { return this.fmtNum(this.amount) },
      set(v) { const r = String(v || '').replace(/\D/g, ''); this.amount = r ? Number(r) : '' },
    },
    amountOver() {
      const a = Number(this.amount) || 0
      return this.selectedDebts.length > 0 && a > 0 && a > this.selectedTotal + 0.0001
    },
    /** Taqsimot (faqat bir nechta qarz + qisman summa) — qarz kaliti → { pay, remainingAfter, closes } */
    previewMap() {
      if (this.isForgive || !this.partial || this.selectedDebts.length < 2) return {}
      const a = Number(this.amount) || 0
      if (!(a > 0) || this.amountOver) return {}
      const plan = allocatePayment(this.selectedDebts, a)
      const map = {}
      for (const x of plan.allocations) map[this.keyOf(x.debt)] = x
      return map
    },
    canConfirm() {
      if (!this.selectedDebts.length) return false
      if (this.isForgive || !this.partial) return true
      return Number(this.amount) > 0 && !this.amountOver
    },
    confirmText() {
      if (this.isForgive) return this.selectedDebts.length > 1 ? this.t.forgiveYesN.replace('{n}', this.selectedDebts.length) : this.t.forgiveYes
      return this.mode === 'pay' ? this.t.payYes : this.t.closeYes
    },
  },
  created() {
    // Bitta qarz bo'lsa — darhol tanlangan (ortiqcha bosish yo'q)
    if (this.debts.length === 1) this.selected = [this.keyOf(this.debts[0])]
  },
  methods: {
    keyOf(d) { return (d.is_mirror ? 'm' : 'o') + '-' + d.id },
    isSelected(d) { return this.selected.indexOf(this.keyOf(d)) >= 0 },
    toggle(d) {
      const k = this.keyOf(d)
      if (this.isSelected(d)) { this.selected = this.selected.filter((x) => x !== k); return }
      // Yopish/qaytarish — faqat bitta valyuta: boshqa valyutadagi qarz bosilsa tanlov o'sha valyutaga o'tadi
      if (!this.isForgive && this.selectedDebts.length && (d.currency || 'UZS') !== this.selectedCurrency) {
        this.selected = [k]
        this.amount = ''
        return
      }
      this.selected = [...this.selected, k]
    },
    toggleAll() {
      this.selected = this.allSelected ? [] : this.allPool.map((d) => this.keyOf(d))
    },
    previewOf(d) { return this.previewMap[this.keyOf(d)] || null },
    isOverdue(d) { return !!d.due_date && new Date(d.due_date) < new Date() },
    money(v, cur) { return formatMoneyCur(v, cur) },
    fmt(v) { return fmtDMY(v, '—') },
    fmtNum(v) {
      if (v === '' || v == null) return ''
      const n = Number(String(v).replace(/\s/g, '').replace(',', '.'))
      if (!isFinite(n)) return ''
      return String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },
    /** Qarzlar yig'indisi valyuta bo'yicha ("1 200 000 UZS · 500 USD") */
    totalsText(list) {
      const map = {}
      for (const d of list) { const c = d.currency || 'UZS'; map[c] = (map[c] || 0) + (Number(d.remaining_amount) || 0) }
      return Object.keys(map).map((c) => this.money(map[c], c)).join(' · ')
    },
    cancel() { if (!this.busy) this.$emit('cancel') },
    confirm() {
      if (this.busy || !this.canConfirm) return
      const amount = !this.isForgive && this.partial ? Number(this.amount) : null
      this.$emit('confirm', { debts: this.selectedDebts, amount })
    },
  },
}
</script>
