<template>
  <!-- 22.10 "Qarzdan chiqish": bitta qarzning reja maydonlari (sozlash 1-qadami va qarz tafsiloti).
       Qaysi maydon ko'rinishi qarz turiga bog'liq (DESIGN §1: kind). v-model: `value` → `input` (yangi obyekt). -->
  <div class="dpf">
    <label class="dpf-label">{{ $t('debt_plan.f.kind') }}</label>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      <button
        v-for="k in kinds"
        :key="k"
        type="button"
        class="dpf-kind text-left rounded-xl border px-3 py-2.5 transition"
        :class="value.kind === k ? 'dpf-kind--on' : 'border-gray-200 hover:border-gray-300 bg-white'"
        @click="set('kind', k)"
      >
        <span class="block text-sm font-semibold text-gray-900">{{ $t('debt_plan.kind.' + k) }}</span>
      </button>
    </div>
    <p v-if="value.kind" class="text-xs text-gray-500 mt-2 leading-relaxed">{{ $t('debt_plan.kind_hint.' + value.kind) }}</p>
    <p v-else class="text-xs text-amber-700 mt-2">{{ $t('debt_plan.f.kind_required') }}</p>

    <div v-if="value.kind" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
      <div v-if="show('apr')">
        <label class="dpf-label">{{ $t('debt_plan.f.apr') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.apr" type="number" min="0" max="500" step="0.1" class="dpf-input" placeholder="0" @input="setNum('apr', $event)" />
          <span class="dpf-suffix">%</span>
        </div>
      </div>
      <div v-if="show('termMonths')">
        <label class="dpf-label">{{ $t('debt_plan.f.term') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.termMonths" type="number" min="1" max="600" step="1" class="dpf-input" @input="setNum('termMonths', $event)" />
          <span class="dpf-suffix">{{ $t('debt_plan.months_short') }}</span>
        </div>
      </div>
      <div v-if="show('minPayment')">
        <label class="dpf-label">{{ $t('debt_plan.f.min_payment') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.minPayment" type="number" min="0" step="1000" class="dpf-input" :placeholder="annuityHint ? fmt(annuityHint) : ''" @input="setNum('minPayment', $event)" />
          <span class="dpf-suffix">{{ value.currency }}</span>
        </div>
        <p v-if="annuityHint && !value.minPayment" class="text-xs text-gray-500 mt-1">{{ $t('debt_plan.f.min_payment_auto', { sum: fmt(annuityHint) + ' ' + value.currency }) }}</p>
      </div>
      <div v-if="show('cardMinPct')">
        <label class="dpf-label">{{ $t('debt_plan.f.card_min_pct') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.cardMinPct" type="number" min="0" max="100" step="0.5" class="dpf-input" placeholder="5" @input="setNum('cardMinPct', $event)" />
          <span class="dpf-suffix">%</span>
        </div>
      </div>
      <div v-if="show('cardMinAbs')">
        <label class="dpf-label">{{ $t('debt_plan.f.card_min_abs') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.cardMinAbs" type="number" min="0" step="1000" class="dpf-input" @input="setNum('cardMinAbs', $event)" />
          <span class="dpf-suffix">{{ value.currency }}</span>
        </div>
      </div>
      <div v-if="show('paymentDay')">
        <label class="dpf-label">{{ $t('debt_plan.f.payment_day') }}</label>
        <select :value="value.paymentDay || ''" class="dpf-input" @change="setNum('paymentDay', $event)">
          <option value="">—</option>
          <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div v-if="show('prepayFeePct')">
        <label class="dpf-label">{{ $t('debt_plan.f.prepay_fee') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.prepayFeePct" type="number" min="0" max="50" step="0.5" class="dpf-input" placeholder="0" @input="setNum('prepayFeePct', $event)" />
          <span class="dpf-suffix">%</span>
        </div>
      </div>
      <div v-if="show('prepayMode')">
        <label class="dpf-label">{{ $t('debt_plan.f.prepay_mode') }}</label>
        <select :value="value.prepayMode || 'shorten_term'" class="dpf-input" @change="set('prepayMode', $event.target.value)">
          <option value="shorten_term">{{ $t('debt_plan.f.prepay_shorten') }}</option>
          <option value="lower_payment">{{ $t('debt_plan.f.prepay_lower') }}</option>
        </select>
      </div>
      <div v-if="show('receivedAmount')">
        <label class="dpf-label">{{ $t('debt_plan.f.received') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.receivedAmount" type="number" min="0" step="1000" class="dpf-input" @input="setNum('receivedAmount', $event)" />
          <span class="dpf-suffix">{{ value.currency }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ $t('debt_plan.f.received_hint') }}</p>
      </div>
      <div v-if="show('penaltyPct')">
        <label class="dpf-label">{{ $t('debt_plan.f.penalty') }}</label>
        <div class="dpf-input-wrap">
          <input :value="value.penaltyPct" type="number" min="0" max="100" step="0.1" class="dpf-input" placeholder="0" @input="setNum('penaltyPct', $event)" />
          <span class="dpf-suffix">%</span>
        </div>
      </div>
      <div v-if="value.kind === 'dated'" class="sm:col-span-2">
        <label class="dpf-label">{{ $t('debt_plan.f.due_date') }}</label>
        <p class="dpf-static">{{ value.dueDate ? fmtDate(value.dueDate) : $t('debt_plan.f.due_missing') }}</p>
      </div>
    </div>

    <p v-if="neverCloses" class="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
      {{ $t('debt_plan.f.never_closes') }}
    </p>

    <!-- Qarz tafsilotida: "O'zim tanlayman" tartibi va rejadan chiqarish -->
    <div v-if="planControls" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
      <div>
        <label class="dpf-label">{{ $t('debt_plan.f.priority') }}</label>
        <input :value="value.priority" type="number" min="1" max="99" step="1" class="dpf-input" @input="setNum('priority', $event)" />
        <p class="text-xs text-gray-500 mt-1">{{ $t('debt_plan.f.priority_hint') }}</p>
      </div>
      <div>
        <label class="dpf-label">{{ $t('debt_plan.f.excluded') }}</label>
        <button
          type="button"
          class="dpf-toggle mt-1 inline-flex items-center gap-3"
          role="switch"
          :aria-checked="value.excluded ? 'true' : 'false'"
          @click="set('excluded', !value.excluded)"
        >
          <span class="dpf-toggle__track" :class="{ 'dpf-toggle__track--on': value.excluded }"><span class="dpf-toggle__dot"></span></span>
          <span class="text-sm text-gray-700">{{ value.excluded ? $t('debt_plan.f.excluded_on') : $t('debt_plan.f.excluded_off') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { DEBT_KINDS, annuityPayment, fmtSum } from '@/utils/debtPlan'
import { fmtDMY } from '@/utils/helpers'

// Har tur uchun ko'rinadigan maydonlar (spec "Kredit turlari va formulalar" jadvali)
const FIELDS = {
  annuity: ['apr', 'termMonths', 'minPayment', 'paymentDay', 'prepayFeePct', 'prepayMode', 'receivedAmount', 'penaltyPct'],
  differentiated: ['apr', 'termMonths', 'minPayment', 'paymentDay', 'prepayFeePct', 'penaltyPct'],
  card: ['apr', 'cardMinPct', 'cardMinAbs', 'paymentDay', 'penaltyPct'],
  installment: ['termMonths', 'minPayment', 'paymentDay'],
  dated: ['apr'],
  open: ['apr'],
}

export default {
  name: 'DebtPlanFields',
  props: {
    value: { type: Object, required: true },
    planControls: { type: Boolean, default: false },
  },
  data() {
    return { kinds: DEBT_KINDS }
  },
  computed: {
    annuityHint() {
      if (this.value.kind !== 'annuity') return null
      const a = annuityPayment(this.value.balance, this.value.apr || 0, this.value.termMonths)
      return a ? Math.round(a) : null
    },
    // F3 sharti: A ≤ P·r bo'lsa qarz hech qachon yopilmaydi — kiritish xatosi
    neverCloses() {
      if (this.value.kind !== 'annuity' || !this.value.minPayment || !this.value.apr) return false
      return Number(this.value.minPayment) <= Number(this.value.balance) * (Number(this.value.apr) / 1200)
    },
  },
  methods: {
    show(field) { return (FIELDS[this.value.kind] || []).includes(field) },
    set(field, v) { this.$emit('input', { ...this.value, [field]: v }) },
    setNum(field, ev) {
      const raw = ev && ev.target ? ev.target.value : ev
      const v = raw === '' || raw == null ? null : Number(raw)
      this.set(field, isFinite(v) ? v : null)
    },
    fmt: fmtSum,
    fmtDate(d) { return fmtDMY(d) },
  },
}
</script>

<style scoped>
.dpf-label { display: block; font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 4px; }
.dpf-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 9px 12px; font-size: 14px; background: #fff; color: #111827; outline: none; transition: border-color .15s, box-shadow .15s; }
.dpf-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
.dpf-input-wrap { position: relative; }
.dpf-input-wrap .dpf-input { padding-right: 52px; }
.dpf-suffix { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #9ca3af; font-weight: 600; pointer-events: none; }
.dpf-static { font-size: 14px; color: #111827; padding: 9px 0; }
.dpf-kind--on { border-color: #10b981; background: #ecfdf5; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.18); }
.dpf-toggle__track { position: relative; width: 44px; height: 24px; border-radius: 9999px; background: #e5e7eb; transition: background .2s; flex-shrink: 0; }
.dpf-toggle__track--on { background: #f43f5e; }
.dpf-toggle__dot { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 9999px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.2); transition: transform .2s; }
.dpf-toggle__track--on .dpf-toggle__dot { transform: translateX(20px); }
</style>
