<template>
  <!-- 30.09 (doc1 17/19/20-rasm): kontragent sahifasidagi amallar endi "ENG OXIRGI aktiv qarz"ga
       emas, foydalanuvchi TANLAGAN qarz(lar)ga qo'llanadi:
         • close / pay — "To'liq" yoki "Qisman" (summa kiritiladi) — "Qarzni yopish" va "Qarzni qaytarish"
           BITTA amalga birlashtirildi (bo'sh/to'liq = yopish, qisman = to'lov);
         • forgive     — bir yoki bir nechta qarz (yoki "Barchasi") tanlanadi.
       01.10 (doc3 5/6-rasm): close / pay da ham BIR NECHTA (yoki barcha) qarz birga tanlanadi; kiritilgan
       summa AVVAL MUDDATI YAQIN qarzlarga taqsimlanadi, qoldiq muddati UZOQ qarzda qoladi (oldindan
       ko'rinadi).
       02.10 (sayt hujjati, 3–4-rasm): ILDIZ — tanlov BITTA VALYUTA bilan cheklangan edi: USD dagi (muddati
       o'tgan) qarz bosilsa UZS qarzlar tanlovdan tushar va "Barchasi" yashirinardi (USD da 1 ta qarz);
       "Barchasi" esa faqat joriy valyutadagilarni (UZS) qamrar, USD qarzni bosish tanlovni almashtirardi.
       Endi istalgan qarzlar (turli valyutada ham) birga tanlanadi, "Barchasi" HAMMASINI qamraydi; qisman
       to'lovda har valyuta uchun ALOHIDA summa kiritiladi (UZS va USD hech qachon qo'shilmaydi) va har biri
       o'z valyutasidagi qarzlar qoldig'idan oshmaydi. Ranglar inline (Tailwind v2 JIT o'chiq). -->
  <div class="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style="z-index: 120">
    <div class="absolute inset-0" style="background: rgba(17, 24, 39, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)" @click="cancel"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md overflow-hidden flex flex-col" style="max-height: 92vh">
      <div class="p-5 pb-3 text-center">
        <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" :style="'background:' + tone.soft + ';color:' + tone.fg">{{ tone.icon }}</div>
        <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500 mt-1.5 leading-relaxed">{{ subtitle }}</p>
      </div>

      <div class="px-5 overflow-y-auto" style="max-height: 52vh">
        <!-- "Barchasi" — ro'yxatdagi BARCHA qarzlar (02.10: valyutadan qat'i nazar) -->
        <button
          v-if="allPool.length > 1"
          type="button"
          class="w-full flex items-center justify-between gap-3 px-4 py-3 mb-2 rounded-xl border text-sm font-semibold transition-colors"
          :style="allSelected ? 'border-color:' + tone.btn + ';background:' + tone.soft + ';color:' + tone.fg : 'border-color:#E5E7EB;color:#374151'"
          :aria-pressed="allSelected ? 'true' : 'false'"
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
            :aria-pressed="isSelected(d) ? 'true' : 'false'"
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
          <!-- 02.10: har tanlangan valyuta uchun alohida summa (max = shu valyutadagi tanlangan qarzlar qoldig'i) -->
          <div v-if="partial" class="mt-3 space-y-3">
            <div v-for="cur in selectedCurrencies" :key="'amt-' + cur">
              <label class="block text-xs font-medium text-gray-500 mb-1">{{ mode === 'pay' ? t.payAmount : t.closeAmount }}<template v-if="selectedCurrencies.length > 1"> ({{ cur }})</template></label>
              <div class="relative">
                <input
                  :value="fmtNum(amounts[cur])"
                  type="text"
                  inputmode="numeric"
                  :placeholder="fmtNum(totalOf(cur))"
                  :aria-invalid="isOver(cur) ? 'true' : 'false'"
                  class="w-full border rounded-xl px-3 py-2.5 pr-16 text-sm outline-none focus:ring-2"
                  :class="isOver(cur) ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'"
                  @input="onAmountInput(cur, $event)"
                />
                <span class="absolute right-3 text-sm text-gray-500" style="top:50%;transform:translateY(-50%)">{{ cur }}</span>
              </div>
              <p v-if="isOver(cur)" class="text-xs text-red-600 mt-1.5">{{ t.over }} ({{ money(totalOf(cur), cur) }})</p>
            </div>
            <p v-if="selectedCurrencies.length > 1" class="text-xs text-gray-400">{{ t.multiCurHint }}</p>
            <p v-else-if="selectedDebts.length > 1" class="text-xs text-gray-400">{{ t.multiHint }}</p>
            <p v-else class="text-xs text-gray-400">{{ t.partHint }}</p>
          </div>
          <p v-else class="text-xs text-gray-400 mt-2">{{ t.fullHint }} {{ totalsText(selectedDebts) }}</p>
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
 *   - confirm({ debts: Object[], amount: number|null, amounts: Object<string, number|null> })
 *     `amounts` — valyuta → summa (null = shu valyutadagi tanlanganlarning butun qoldig'i); `amount` — tanlov
 *     bitta valyutada bo'lsa o'sha summa (eski chaqiruvchilar uchun), aks holda null.
 *     close/pay da bir valyutada bir nechta qarz bo'lsa — summa muddati yaqin qarzlardan boshlab taqsimlanadi
 *     (utils/debtAllocation; serverda POST /finance/debts/allocate-payment — har valyuta alohida so'rov).
 */
import { formatMoneyCur, fmtDMY } from '~/utils/helpers'
import { allocatePayment } from '~/utils/debtAllocation'

const CUR_RANK = { UZS: 0, USD: 1 }
const curOf = (d) => (d && d.currency) || 'UZS'
/** Valyutalar noyob va barqaror tartibda: UZS, USD, so'ng qolganlari (alifbo) */
function sortCurrencies(list) {
  const rank = (c) => (CUR_RANK[c] != null ? CUR_RANK[c] : 2)
  return [...new Set(list)].sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : a > b ? 1 : 0))
}

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
    multiCurHint: 'Har bir valyuta uchun summa alohida kiritiladi; summa avval muddati yaqin qarzlarga taqsimlanadi.',
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
    multiCurHint: 'Сумма указывается отдельно для каждой валюты; сначала гасятся долги с ближайшим сроком.',
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
    multiCurHint: 'Ҳар бир валюта учун сумма алоҳида киритилади; сумма аввал муддати яқин қарзларга тақсимланади.',
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
    multiCurHint: 'Enter the amount separately for each currency; it is applied to the debts due soonest first.',
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
    multiCurHint: 'Hár bir valyuta ushın summa bólek kiritiledi; summa aldın múddeti jaqın qarızlarǵa bólistiriledi.',
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
      // 02.10: qisman summa VALYUTA bo'yicha ({ UZS: 500000, USD: 20 }); '' — kiritilmagan
      amounts: {},
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
    /** Tanlangan qarzlar valyutalari (UZS, USD, …) — har biri uchun alohida summa/taqsimot */
    selectedCurrencies() {
      return sortCurrencies(this.selectedDebts.map(curOf))
    },
    /** 02.10 (3–4-rasm): "Barchasi" — ro'yxatdagi BARCHA qarzlar (ilgari faqat joriy valyutadagilar) */
    allPool() {
      return this.debts
    },
    allSelected() {
      return this.allPool.length > 0 && this.allPool.every((d) => this.isSelected(d))
    },
    /** Taqsimot (qisman summa + shu valyutada bir nechta qarz) — qarz kaliti → { pay, remainingAfter, closes } */
    previewMap() {
      if (this.isForgive || !this.partial) return {}
      const map = {}
      for (const cur of this.selectedCurrencies) {
        const list = this.selectedDebts.filter((d) => curOf(d) === cur)
        const a = Number(this.amounts[cur]) || 0
        if (list.length < 2 || !(a > 0) || this.isOver(cur)) continue
        for (const x of allocatePayment(list, a).allocations) map[this.keyOf(x.debt)] = x
      }
      return map
    },
    canConfirm() {
      if (!this.selectedDebts.length) return false
      if (this.isForgive || !this.partial) return true
      return this.selectedCurrencies.every((c) => Number(this.amounts[c]) > 0 && !this.isOver(c))
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
    /** 02.10: valyutadan qat'i nazar qo'shiladi/olib tashlanadi (ilgari boshqa valyuta tanlovni ALMASHTIRARDI) */
    toggle(d) {
      const k = this.keyOf(d)
      this.selected = this.isSelected(d) ? this.selected.filter((x) => x !== k) : [...this.selected, k]
      this.pruneAmounts()
    },
    toggleAll() {
      this.selected = this.allSelected ? [] : this.allPool.map((d) => this.keyOf(d))
      this.pruneAmounts()
    },
    /** Tanlovdan chiqib ketgan valyutaning summasi saqlanib qolmasin */
    pruneAmounts() {
      const keep = this.selectedCurrencies
      const next = {}
      for (const c of keep) if (this.amounts[c] !== undefined) next[c] = this.amounts[c]
      this.amounts = next
    },
    /** Shu valyutadagi tanlangan qarzlar jami qoldig'i */
    totalOf(cur) {
      return this.selectedDebts.filter((d) => curOf(d) === cur).reduce((s, d) => s + (Number(d.remaining_amount) || 0), 0)
    },
    isOver(cur) {
      const a = Number(this.amounts[cur]) || 0
      return a > 0 && a > this.totalOf(cur) + 0.0001
    },
    onAmountInput(cur, e) {
      const raw = String((e && e.target && e.target.value) || '').replace(/\D/g, '')
      this.amounts = { ...this.amounts, [cur]: raw ? Number(raw) : '' }
      // Kursor sakramasin: formatlangan qiymatni darhol qaytaramiz
      if (e && e.target) e.target.value = this.fmtNum(this.amounts[cur])
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
      for (const d of list) { const c = curOf(d); map[c] = (map[c] || 0) + (Number(d.remaining_amount) || 0) }
      return sortCurrencies(Object.keys(map)).map((c) => this.money(map[c], c)).join(' · ')
    },
    cancel() { if (!this.busy) this.$emit('cancel') },
    confirm() {
      if (this.busy || !this.canConfirm) return
      const usePartial = !this.isForgive && this.partial
      const amounts = {}
      for (const c of this.selectedCurrencies) amounts[c] = usePartial ? Number(this.amounts[c]) : null
      const single = this.selectedCurrencies.length === 1 ? amounts[this.selectedCurrencies[0]] : null
      this.$emit('confirm', { debts: this.selectedDebts, amount: single, amounts })
    },
  },
}
</script>
