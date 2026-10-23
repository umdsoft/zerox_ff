<template>
  <!-- 22.10 "Qarzdan chiqish" sozlash 2-qadami: bitta daromad oqimi (summa, qaysi oylarda, kun, ishonchlilik). -->
  <div class="ie bg-white rounded-2xl border border-gray-200 p-4 lg:p-5">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
      <div class="md:col-span-5">
        <label class="ie-label">{{ $t('debt_plan.inc.title') }}</label>
        <input :value="value.title" type="text" maxlength="100" class="ie-input" :placeholder="$t('debt_plan.inc.title_ph')" @input="set('title', $event.target.value)" />
      </div>
      <div class="md:col-span-4">
        <label class="ie-label">{{ $t('debt_plan.inc.amount') }}</label>
        <div class="ie-input-wrap">
          <MoneyInput :value="value.amount" input-class="ie-input ie-input--sfx" placeholder="0" @input="set('amount', $event == null ? '' : $event)" />
          <span class="ie-suffix">{{ value.currency }}</span>
        </div>
      </div>
      <div class="md:col-span-2">
        <label class="ie-label">{{ $t('debt_plan.inc.currency') }}</label>
        <select :value="value.currency" class="ie-input" @change="set('currency', $event.target.value)">
          <option value="UZS">UZS</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div class="md:col-span-1 flex md:items-end md:justify-end">
        <button type="button" class="ie-remove" :title="$t('common.delete')" :aria-label="$t('common.delete')" @click="$emit('remove')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>

    <div class="mt-4">
      <label class="ie-label">{{ $t('debt_plan.inc.when') }}</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="m in modes" :key="m" type="button" class="ie-seg" :class="{ 'ie-seg--on': value.mode === m }" @click="set('mode', m)">{{ $t('debt_plan.inc.mode_' + m) }}</button>
      </div>
      <div v-if="value.mode === 'months'" class="flex flex-wrap gap-1.5 mt-3">
        <button v-for="m in 12" :key="'m' + m" type="button" class="ie-chip" :class="{ 'ie-chip--on': value.months.includes(m) }" @click="toggleMonth(m)">{{ shortMonth(m) }}</button>
      </div>
      <div v-if="value.mode === 'oneoff'" class="mt-3 max-w-xs">
        <input :value="value.oneOffDate" type="date" class="ie-input" @input="set('oneOffDate', $event.target.value)" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4">
      <div v-if="value.mode !== 'oneoff'" class="md:col-span-3">
        <label class="ie-label">{{ $t('debt_plan.inc.day') }}</label>
        <select :value="value.dayOfMonth" class="ie-input" @change="set('dayOfMonth', Number($event.target.value))">
          <option v-for="d in 31" :key="'d' + d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div :class="value.mode !== 'oneoff' ? 'md:col-span-9' : 'md:col-span-12'">
        <label class="ie-label">{{ $t('debt_plan.inc.reliability') }}</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button v-for="r in reliabilities" :key="'r' + r" type="button" class="ie-rel text-left" :class="{ 'ie-rel--on': value.reliability === r }" @click="set('reliability', r)">
            <span class="block text-sm font-semibold text-gray-900">{{ $t('debt_plan.inc.rel_' + relKey(r)) }}</span>
            <span class="block text-xs text-gray-500 mt-0.5">{{ $t('debt_plan.inc.rel_' + relKey(r) + '_hint') }}</span>
          </button>
        </div>
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-600 mt-3">{{ error }}</p>
  </div>
</template>

<script>
import { RELIABILITY_OPTIONS, fmtSum, monthName } from '@/utils/debtPlan'
import MoneyInput from '@/components/finance/debtPlan/MoneyInput.vue'

export default {
  name: 'IncomeEditor',
  components: { MoneyInput },
  props: {
    value: { type: Object, required: true },
    error: { type: String, default: '' },
  },
  data() {
    return { modes: ['monthly', 'months', 'oneoff'], reliabilities: RELIABILITY_OPTIONS }
  },
  methods: {
    // 23.10: bir tikdagi ikki o'zgarish birinchisini o'chirmasin (DebtPlanFields bilan bir xil)
    set(field, v) {
      const next = { ...(this.pendingValue || this.value), [field]: v }
      this.pendingValue = next
      this.$nextTick(() => { this.pendingValue = null })
      this.$emit('input', next)
    },
    toggleMonth(m) {
      const has = this.value.months.includes(m)
      const months = has ? this.value.months.filter((x) => x !== m) : [...this.value.months, m].sort((a, b) => a - b)
      this.set('months', months)
    },
    shortMonth(m) { return monthName(m, this.$t.bind(this)).slice(0, 3) },
    relKey(r) { return r === 1 ? 'sure' : (r === 0.8 ? 'usual' : 'maybe') },
    fmt: fmtSum,
  },
}
</script>

<style scoped>
.ie-label { display: block; font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 4px; }
.ie-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 9px 12px; font-size: 14px; background: #fff; outline: none; }
.ie-input-wrap { position: relative; }
.ie-input--sfx { padding-right: 52px; }
.ie-suffix { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #9ca3af; font-weight: 600; pointer-events: none; }
.ie-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
.ie-remove { width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; border: 1px solid #e5e7eb; }
.ie-remove:hover { color: #e11d48; border-color: #fecdd3; background: #fff1f2; }
.ie-seg { border: 1px solid #e5e7eb; border-radius: 10px; padding: 7px 12px; font-size: 13px; font-weight: 600; color: #4b5563; background: #fff; }
.ie-seg--on { border-color: #10b981; background: #ecfdf5; color: #047857; }
.ie-chip { min-width: 52px; border: 1px solid #e5e7eb; border-radius: 9999px; padding: 5px 10px; font-size: 13px; color: #4b5563; background: #fff; }
.ie-chip--on { border-color: #059669; background: #059669; color: #fff; }
.ie-rel { border: 1px solid #e5e7eb; border-radius: 12px; padding: 9px 12px; background: #fff; transition: border-color .15s; }
.ie-rel:hover { border-color: #d1d5db; }
.ie-rel--on { border-color: #10b981; background: #ecfdf5; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.18); }
</style>
