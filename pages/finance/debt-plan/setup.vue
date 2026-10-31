<template>
  <!-- 22.10 (egasi hujjati "Qarzdan chiqish", Ekranlar 1): 3 qadamli sozlash — qarzlar, daromadlar,
       xarajat va bufer. Takliflar: GET /finance/debt-plan/suggestions; saqlash: PATCH /finance/debts/:id/plan
       (har qarz) + PUT /finance/debt-plan (setupDone). Oxirida natija: "N oyda qarzsiz bo'lasiz". -->
  <div class="dps pb-10">
    <div class="flex items-center gap-3 mb-5">
      <PageBackButton :to="localePath({ name: setupWasDone ? 'finance-debt-plan' : 'finance' })" />
      <div class="min-w-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ setupWasDone ? $t('debt_plan.edit_title') : $t('debt_plan.setup_title') }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ setupWasDone ? $t('debt_plan.edit_subtitle') : $t('debt_plan.setup_subtitle') }}</p>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">{{ $t('common.loading') }}</div>

    <div v-else-if="loadError" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-gray-600 mb-4">{{ $t('debt_plan.err.load') }}</p>
      <button type="button" class="dps-btn dps-btn--primary" @click="load">{{ $t('debt_plan.retry') }}</button>
    </div>

    <template v-else>
      <!-- 23.10 (egasi hujjati 22.10, 12-rasm): TAHRIRLASH rejimi — joriy reja ma'lumotlari yuklangan,
           istalgan qadamga o'tish mumkin, "Saqlash" PUT bilan almashtiradi (reja boshlanishi saqlanadi). -->
      <div v-if="setupWasDone && step <= 3" class="dps-edit flex items-start gap-3 rounded-2xl px-4 py-3 mb-4">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        <p class="text-sm leading-relaxed">{{ $t('debt_plan.edit_banner') }}</p>
      </div>
      <!-- Qadamlar -->
      <ol class="dps-steps grid grid-cols-3 gap-2 lg:gap-4 mb-5">
        <li v-for="s in 3" :key="'s' + s" class="dps-step rounded-xl px-3 py-3 lg:px-4" :class="[stepClass(s), { 'dps-step--nav': setupWasDone && step !== s }]" @click="goStep(s)">
          <span class="dps-step__n">{{ step > s ? '✓' : s }}</span>
          <span class="min-w-0">
            <span class="block text-sm font-bold truncate">{{ $t('debt_plan.step' + s) }}</span>
            <span class="hidden md:block text-xs opacity-75 truncate">{{ $t('debt_plan.step' + s + '_hint') }}</span>
          </span>
        </li>
      </ol>

      <!-- 1-qadam: qarzlar -->
      <section v-if="step === 1">
        <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4 text-sm text-gray-700 leading-relaxed">{{ $t('debt_plan.step1_intro') }}</div>
        <div v-if="!debts.length" class="bg-white rounded-2xl p-10 shadow-sm text-center">
          <p class="font-bold text-gray-900">{{ $t('debt_plan.empty_title') }}</p>
          <p class="text-gray-500 mt-1">{{ $t('debt_plan.empty_text') }}</p>
        </div>
        <div class="space-y-3">
          <article v-for="(d, i) in debts" :key="'d' + d.id" class="bg-white rounded-2xl shadow-sm border overflow-hidden" :class="d.excluded ? 'border-gray-100 opacity-75' : (missingKind(d) ? 'border-amber-300' : 'border-gray-100')">
            <header class="px-5 py-4 flex flex-wrap items-center gap-3 cursor-pointer" @click="toggleOpen(d.id)">
              <div class="min-w-0 flex-1">
                <p class="font-bold text-gray-900 truncate">{{ d.title }}</p>
                <p class="text-sm text-gray-500">{{ sum(d.balance) }} {{ d.currency }}<span v-if="d.dueDate"> · {{ $t('debt_plan.f.due_short', { date: fmtDate(d.dueDate) }) }}</span></p>
              </div>
              <span v-if="d.kind && d.kindInferred && !dirty[d.id]" class="text-xs font-semibold bg-amber-50 text-amber-700 rounded-lg px-2.5 py-1" :title="$t('debt_plan.kind_inferred_hint')">{{ $t('debt_plan.kind.' + d.kind) }} · {{ $t('debt_plan.kind_inferred') }}</span>
              <span v-else-if="d.kind" class="text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg px-2.5 py-1">{{ $t('debt_plan.kind.' + d.kind) }}</span>
              <span v-else-if="!d.excluded" class="text-xs font-semibold bg-amber-50 text-amber-700 rounded-lg px-2.5 py-1">{{ $t('debt_plan.kind_unset') }}</span>
              <label class="inline-flex items-center gap-2 text-sm text-gray-600" @click.stop>
                <input type="checkbox" :checked="!d.excluded" class="w-4 h-4" @change="updateDebt(i, { ...d, excluded: !$event.target.checked })" />
                {{ $t('debt_plan.include') }}
              </label>
              <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'dps-rot': openId === d.id }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </header>
            <div v-if="openId === d.id && !d.excluded" class="px-5 pb-5 pt-1 border-t border-gray-100">
              <DebtPlanFields :value="d" class="mt-4" @input="updateDebt(i, $event)" />
            </div>
          </article>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <nuxt-link :to="localePath({ name: 'finance-debts-add', query: { type: 'borrowed' } })" class="text-sm font-semibold text-emerald-700 hover:text-emerald-800">+ {{ $t('debt_plan.add_debt') }}</nuxt-link>
          <p class="text-xs text-gray-400">{{ $t('debt_plan.contracts_note') }}</p>
        </div>
      </section>

      <!-- 2-qadam: daromadlar -->
      <section v-if="step === 2">
        <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4 text-sm text-gray-700 leading-relaxed">{{ $t('debt_plan.step2_intro') }}</div>
        <div class="space-y-3">
          <IncomeEditor v-for="(inc, i) in incomes" :key="inc.key" :value="inc" :error="incomeErrors[i] || ''" @input="updateIncome(i, $event)" @remove="removeIncome(i)" />
        </div>
        <div v-if="!incomes.length" class="bg-white rounded-2xl p-8 shadow-sm text-center text-gray-500">{{ $t('debt_plan.inc.empty') }}</div>
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
          <button type="button" class="dps-btn dps-btn--ghost" @click="addIncome">+ {{ $t('debt_plan.inc.add') }}</button>
          <p class="text-sm text-gray-600">{{ $t('debt_plan.inc.guaranteed_total') }}: <b class="text-gray-900">{{ sum(guaranteedMonthly) }} UZS</b></p>
        </div>
      </section>

      <!-- 3-qadam: xarajat va bufer -->
      <section v-if="step === 3" class="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div class="xl:col-span-2 space-y-4">
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="font-bold text-gray-900 mb-3">{{ $t('debt_plan.exp.title') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.fixed') }}</label>
                <MoneyInput v-model="settings.fixedExpense" input-class="dps-input" placeholder="0" />
                <p class="text-xs text-gray-500 mt-1">{{ $t('debt_plan.exp.fixed_hint') }}</p>
              </div>
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.living') }}</label>
                <MoneyInput v-model="settings.livingMedian" input-class="dps-input" placeholder="0" />
                <p class="text-xs text-gray-500 mt-1">{{ settings.historyMonths >= 3 ? $t('debt_plan.exp.living_hint', { n: settings.historyMonths }) : $t('debt_plan.exp.living_no_history') }}</p>
              </div>
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.free') }}</label>
                <div class="flex gap-2 mb-2">
                  <button type="button" class="dps-seg" :class="{ 'dps-seg--on': freeMode === 'pct' }" @click="freeMode = 'pct'">%</button>
                  <button type="button" class="dps-seg" :class="{ 'dps-seg--on': freeMode === 'sum' }" @click="freeMode = 'sum'">UZS</button>
                </div>
                <input v-if="freeMode === 'pct'" v-model.number="settings.freeMoneyPct" type="number" min="0" max="30" step="0.5" class="dps-input" />
                <MoneyInput v-else v-model="settings.freeMoney" input-class="dps-input" placeholder="0" />
                <p class="text-xs text-gray-500 mt-1">{{ $t('debt_plan.exp.free_hint') }}</p>
              </div>
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.buffer') }}</label>
                <MoneyInput v-model="settings.bufferTarget" input-class="dps-input" :placeholder="sum(defaultBuffer)" />
                <p class="text-xs text-gray-500 mt-1">{{ $t('debt_plan.exp.buffer_hint', { sum: sum(defaultBuffer) }) }}</p>
              </div>
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.buffer_current') }}</label>
                <MoneyInput v-model="settings.bufferCurrent" input-class="dps-input" placeholder="0" />
              </div>
            </div>
            <button type="button" class="text-sm font-semibold text-gray-500 hover:text-gray-700 mt-4" @click="advanced = !advanced">{{ advanced ? '−' : '+' }} {{ $t('debt_plan.exp.advanced') }}</button>
            <div v-if="advanced" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.mad') }}</label>
                <MoneyInput v-model="settings.livingMad" input-class="dps-input" placeholder="0" />
                <p class="text-xs text-gray-500 mt-1">{{ $t('debt_plan.exp.mad_hint') }}</p>
              </div>
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.devaluation') }}</label>
                <input v-model.number="settings.devaluationPct" type="number" min="0" max="100" step="0.5" class="dps-input" />
              </div>
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.inflation') }}</label>
                <input v-model.number="settings.inflationPct" type="number" min="0" max="100" step="0.5" class="dps-input" />
              </div>
              <div>
                <label class="dps-label">{{ $t('debt_plan.exp.income_growth') }}</label>
                <input v-model.number="settings.incomeGrowthPct" type="number" min="-50" max="100" step="0.5" class="dps-input" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="font-bold text-gray-900 mb-3">{{ $t('debt_plan.strategy_title') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button v-for="s in strategies" :key="s" type="button" class="dps-card text-left" :class="{ 'dps-card--on': settings.strategy === s }" @click="settings.strategy = s">
                <span class="block font-bold text-gray-900">{{ $t('debt_plan.strategy.' + s) }}</span>
                <span class="block text-xs text-gray-500 mt-1 leading-relaxed">{{ $t('debt_plan.strategy_hint.' + s) }}</span>
              </button>
            </div>
          </div>
        </div>

        <aside class="bg-white rounded-2xl shadow-sm p-5 h-fit">
          <h2 class="font-bold text-gray-900 mb-3">{{ $t('debt_plan.exp.summary') }}</h2>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between gap-3"><dt class="text-gray-500">{{ $t('debt_plan.inc.guaranteed_total') }}</dt><dd class="font-semibold text-gray-900">{{ sum(guaranteedMonthly) }}</dd></div>
            <div class="flex justify-between gap-3"><dt class="text-gray-500">{{ $t('debt_plan.exp.fixed') }}</dt><dd class="font-semibold text-gray-900">− {{ sum(settings.fixedExpense) }}</dd></div>
            <div class="flex justify-between gap-3"><dt class="text-gray-500">{{ $t('debt_plan.exp.living') }}</dt><dd class="font-semibold text-gray-900">− {{ sum(settings.livingMedian) }}</dd></div>
            <div class="flex justify-between gap-3 pt-2 border-t border-gray-100"><dt class="text-gray-700 font-semibold">{{ $t('debt_plan.exp.left_for_debts') }}</dt><dd class="font-extrabold" :class="leftForDebts >= 0 ? 'text-emerald-700' : 'text-red-600'">{{ sum(leftForDebts) }}</dd></div>
          </dl>
          <p class="text-xs text-gray-400 mt-3 leading-relaxed">{{ $t('debt_plan.exp.summary_hint') }}</p>
        </aside>
      </section>

      <!-- 4: natija -->
      <section v-if="step === 4" class="dps-result rounded-2xl p-6 lg:p-10 text-white text-center relative overflow-hidden">
        <template v-if="resultBase && resultBase.months">
          <p class="text-sm uppercase tracking-wide dps-muted font-semibold">{{ $t('debt_plan.result_kicker') }}</p>
          <p class="text-4xl lg:text-6xl font-extrabold mt-2">{{ $t('debt_plan.result_months', { n: resultBase.months }) }}</p>
          <p class="text-lg lg:text-xl mt-2 dps-muted">{{ $t('debt_plan.result_date', { date: ymText(resultBase.finishYm) }) }}</p>
          <p v-if="resultP90" class="text-sm mt-1 dps-muted">{{ $t('debt_plan.p90', { date: ymText(resultP90) }) }}</p>
          <p v-if="resultVerdict !== 'ok'" class="dps-warn inline-block mt-4 rounded-xl px-4 py-2 text-sm">{{ $t('debt_plan.coverage.' + resultVerdict + '_title') }}</p>
        </template>
        <template v-else>
          <p class="text-3xl font-extrabold">{{ $t('debt_plan.not_feasible_short') }}</p>
          <p class="mt-2 dps-muted">{{ resultError && resultError.message ? resultError.message : (result ? $t('debt_plan.never_finish') : $t('debt_plan.coverage.infeasible_text', { q: '—' })) }}</p>
          <button type="button" class="dps-btn dps-btn--white mt-4" @click="step = 1">{{ $t('debt_plan.fix_data') }}</button>
        </template>
        <div class="mt-6">
          <nuxt-link :to="localePath({ name: 'finance-debt-plan' })" class="dps-btn dps-btn--white">{{ $t('debt_plan.open_plan') }}</nuxt-link>
        </div>
      </section>

      <!-- Navigatsiya -->
      <div v-if="step <= 3" class="flex items-center justify-between gap-3 mt-6">
        <button v-if="step > 1" type="button" class="dps-btn dps-btn--ghost" :disabled="saving" @click="step -= 1">{{ $t('common.back') }}</button>
        <span v-else></span>
        <button type="button" class="dps-btn dps-btn--primary" :disabled="saving" @click="next">
          {{ saving ? $t('common.loading') : (step === 3 ? (setupWasDone ? $t('common.save') : $t('debt_plan.build_plan')) : $t('common.next')) }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import PageBackButton from '@/components/ui/PageBackButton.vue'
import DebtPlanFields from '@/components/finance/debtPlan/DebtPlanFields.vue'
import IncomeEditor from '@/components/finance/debtPlan/IncomeEditor.vue'
import MoneyInput from '@/components/finance/debtPlan/MoneyInput.vue'
import {
  normDebt, normSettings, normIncome, incomePayload, debtPlanPayload, unwrap, STRATEGIES,
  ymLabel, ymAdd, fmtSum, num, apiErrorText, debtFieldErrors, langParams,
} from '@/utils/debtPlan'
import { fmtDMY } from '@/utils/helpers'
import { putDebtPlan, patchDebtsPlan, getDebtPlanSuggestions, getDebtPlan } from '@/api/debtPlan';

const DEFAULT_USD = 12600 // faqat ekrandagi taxminiy jami uchun; hisob backendda MB kursi bilan

export default {
  name: 'DebtPlanSetup',
  components: { PageBackButton, DebtPlanFields, IncomeEditor, MoneyInput },
  middleware: 'auth',

  data() {
    return {
      loading: true,
      loadError: false,
      saving: false,
      step: 1,
      setupWasDone: false,
      debts: [],
      dirty: {},
      openId: null,
      incomes: [],
      incomeErrors: [],
      settings: normSettings(null),
      freeMode: 'pct',
      advanced: false,
      strategies: STRATEGIES,
      usdRate: DEFAULT_USD,
      result: null,
      resultError: null,
    }
  },

  head() {
    return { title: this.setupWasDone ? this.$t('debt_plan.edit_title') : this.$t('debt_plan.setup_title') }
  },

  computed: {
    guaranteedMonthly() {
      return this.incomes.reduce((s, i) => {
        if (i.reliability !== 1 || i.mode === 'oneoff') return s
        const amt = num(i.amount) * (i.currency === 'USD' ? this.usdRate : 1)
        const share = i.mode === 'monthly' ? 1 : (i.months.length / 12)
        return s + amt * share
      }, 0)
    },
    defaultBuffer() { return num(this.settings.fixedExpense) + num(this.settings.livingMedian) },
    leftForDebts() { return this.guaranteedMonthly - num(this.settings.fixedExpense) - num(this.settings.livingMedian) },
    resultBase() { return this.result && this.result.scenarios && this.result.scenarios.base },
    resultP90() {
      const mc = this.result && this.result.monteCarlo
      const b = this.resultBase
      if (!mc || !mc.p90 || !b || !b.finishYm) return null
      return ymAdd(b.finishYm, mc.p90 - b.months)
    },
    resultVerdict() {
      if (!this.result) return 'ok'
      if (this.result.feasible === false) return 'infeasible'
      return (this.result.coverage && this.result.coverage.verdict) || 'ok'
    },
  },

  mounted() {
    this.load()
  },

  methods: {
    async load() {
      this.loading = true
      this.loadError = false
      try {
        const [planRes, sugRes] = await Promise.all([
          getDebtPlan(this.$axios, { silent: true, params: langParams(this) }).catch(() => null),
          getDebtPlanSuggestions(this.$axios, { silent: true }),
        ])
        const plan = unwrap(planRes) || {}
        const sug = unwrap(sugRes) || {}
        const p = plan.plan || {}
        this.setupWasDone = !!(plan.setupDone || plan.setup_done || p.setupDone || p.setup_done)
        const fx = (plan.fx && plan.fx.USD) || (sug.fx && sug.fx.USD)
        if (num(fx) > 0) this.usdRate = num(fx)

        const rawDebts = (plan.debts && plan.debts.length ? plan.debts : sug.debts) || []
        this.debts = rawDebts.map(normDebt).filter((d) => d && d.status !== 'completed' && d.balance > 0)
        const firstMissing = this.debts.find((d) => !d.kind && !d.excluded)
        this.openId = firstMissing ? firstMissing.id : null

        const rawIncomes = this.setupWasDone && plan.incomes && plan.incomes.length ? plan.incomes : (sug.incomes || [])
        this.incomes = rawIncomes.map(normIncome)
        if (!this.incomes.length) this.incomes = [normIncome({ reliability: 1 })]

        const s = normSettings(p)
        if (!this.setupWasDone) {
          // suggestions: fixedExpense { total, items }, living { median, mad, historyMonths, estimated }
          const fe = sug.fixedExpense
          const lv = sug.living || {}
          s.fixedExpense = num(fe && typeof fe === 'object' ? fe.total : fe)
          if (lv.median != null) s.livingMedian = num(lv.median)
          s.livingMad = lv.mad != null ? num(lv.mad) : null
          s.historyMonths = num(lv.historyMonths)
        }
        this.settings = s
        this.freeMode = s.freeMoney != null && s.freeMoney > 0 ? 'sum' : 'pct'
        // 23.10: tahrirlashda avval o'zgartirilgan "qo'shimcha" sozlamalar darhol ko'rinsin
        this.advanced = this.setupWasDone && (s.livingMad != null || s.devaluationPct !== 8 || s.inflationPct !== 10 || s.incomeGrowthPct !== 0)
      } catch (e) {
        this.loadError = true
      } finally {
        this.loading = false
      }
    },

    stepClass(s) {
      if (this.step === s) return 'dps-step--on'
      if (this.step > s) return 'dps-step--done'
      return 'dps-step--off'
    },
    // 23.10: yangi sozlashda faqat ortga; TAHRIRLASHda istalgan qadamga (1-qadamdan chiqishda o'zgargan
    // qarzlar avval saqlanadi, 2-qadamdan oldinga — daromadlar tekshiriladi).
    async goStep(s) {
      if (this.saving || this.step > 3 || s === this.step) return
      if (s < this.step) { this.step = s; return }
      if (!this.setupWasDone) return
      if (this.step === 1) {
        const ok = await this.saveDebts(s)
        if (!ok) return
      }
      if (this.step === 2 && !this.validateIncomes()) return
      this.step = s
    },
    toggleOpen(id) { this.openId = this.openId === id ? null : id },
    missingKind(d) { return !d.excluded && !d.kind },
    updateDebt(i, d) {
      this.debts = this.debts.map((x, j) => (j === i ? d : x))
      this.dirty = { ...this.dirty, [d.id]: true }
    },
    updateIncome(i, inc) {
      this.incomes = this.incomes.map((x, j) => (j === i ? inc : x))
      this.incomeErrors = this.incomeErrors.map((e, j) => (j === i ? '' : e))
    },
    addIncome() { this.incomes = [...this.incomes, normIncome({ reliability: 0.8 })] },
    removeIncome(i) {
      this.incomes = this.incomes.filter((x, j) => j !== i)
      this.incomeErrors = this.incomeErrors.filter((x, j) => j !== i)
    },

    async next() {
      if (this.step === 1) return this.saveDebts()
      if (this.step === 2) {
        if (this.validateIncomes()) this.step = 3
        return
      }
      if (this.step === 3) return this.savePlan()
    },

    async saveDebts(target = 2) {
      const missing = this.debts.find((d) => this.missingKind(d))
      if (missing) {
        this.openId = missing.id
        this.$toast && this.$toast.error(this.$t('debt_plan.err.kind_missing', { debt: missing.title }))
        return false
      }
      // 23.10: chegaradan tashqari qiymat serverga yuborilmaydi — qarz ochiladi, xato maydon ostida
      const invalid = this.debts.find((d) => Object.keys(debtFieldErrors(d)).length)
      if (invalid) {
        this.openId = invalid.id
        const key = Object.values(debtFieldErrors(invalid))[0]
        this.$toast && this.$toast.error(`${invalid.title}: ${this.$t(key)}`)
        return false
      }
      // Avtomatik aniqlangan tur ham (kindInferred) shu yerda tasdiqlanib saqlanadi
      const changed = this.debts.filter((d) => this.dirty[d.id] || (d.kindInferred && !d.excluded))
      this.saving = true
      try {
        await Promise.all(changed.map((d) => patchDebtsPlan(this.$axios, d.id, debtPlanPayload(d), { silent: true, params: langParams(this) })))
        this.dirty = {}
        this.debts = this.debts.map((d) => (changed.includes(d) ? { ...d, kindInferred: false } : d))
        this.step = target
        return true
      } catch (e) {
        this.$toast && this.$toast.error(apiErrorText(e, this.$t('debt_plan.err.save')))
        return false
      } finally {
        this.saving = false
      }
    },

    validateIncomes() {
      const errs = this.incomes.map((i) => {
        if (!String(i.title || '').trim()) return this.$t('debt_plan.err.inc_title')
        if (!(num(i.amount) > 0)) return this.$t('debt_plan.err.inc_amount')
        if (i.mode === 'months' && !i.months.length) return this.$t('debt_plan.err.inc_months')
        if (i.mode === 'oneoff' && !i.oneOffDate) return this.$t('debt_plan.err.inc_date')
        return ''
      })
      this.incomeErrors = errs
      if (!this.incomes.length) {
        this.$toast && this.$toast.error(this.$t('debt_plan.err.inc_none'))
        return false
      }
      return errs.every((e) => !e)
    },

    settingsPayload() {
      const s = this.settings
      const n = (v) => (v === '' || v == null ? null : num(v))
      // validator (backend/validators/debtPlan.validator.js): snake_case, noma'lum maydon — 400
      return {
        strategy: s.strategy,
        fixed_expense: num(s.fixedExpense),
        living_median: n(s.livingMedian),
        living_mad: n(s.livingMad),
        history_months: Math.max(0, Math.round(num(s.historyMonths))),
        living_confidence: Math.min(0.99, Math.max(0.51, num(s.livingConfidence, 0.8))),
        free_money: this.freeMode === 'sum' ? n(s.freeMoney) : null,
        free_money_pct: Math.min(50, Math.max(0, num(s.freeMoneyPct, 5))),
        survival_pct: num(s.survivalPct, 70),
        buffer_target: n(s.bufferTarget),
        buffer_current: num(s.bufferCurrent),
        devaluation_pct: num(s.devaluationPct, 8),
        inflation_pct: num(s.inflationPct, 10),
        income_growth_pct: num(s.incomeGrowthPct),
      }
    },

    async savePlan() {
      if (!(num(this.settings.livingMedian) > 0)) {
        this.$toast && this.$toast.error(this.$t('debt_plan.err.living'))
        return
      }
      this.saving = true
      try {
        const body = { ...this.settingsPayload(), incomes: this.incomes.map(incomePayload), setup_done: true }
        // PUT javobi — GET /finance/debt-plan bilan bir xil (yangi natija bilan)
        const res = await putDebtPlan(this.$axios, body, { silent: true, params: langParams(this) })
        const data = unwrap(res) || {}
        this.result = data.result || null
        this.resultError = data.resultError || null
        if (this.setupWasDone && this.$toast) this.$toast.success(this.$t('debt_plan.saved'))
        this.step = 4
      } catch (e) {
        this.$toast && this.$toast.error(apiErrorText(e, this.$t('debt_plan.err.save')))
      } finally {
        this.saving = false
      }
    },

    ymText(ym) { return ymLabel(ym, this.$t.bind(this), this.$i18n.locale) },
    sum: fmtSum,
    fmtDate(d) { return fmtDMY(d) },
  },
}
</script>

<style scoped>
.dps-label { display: block; font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 4px; }
.dps-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 9px 12px; font-size: 14px; background: #fff; outline: none; }
.dps-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
.dps-step { display: flex; align-items: center; gap: 10px; cursor: default; border: 1px solid transparent; transition: background .15s; }
.dps-step__n { width: 30px; height: 30px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0; font-size: 14px; }
.dps-step--on { background: #059669; color: #fff; box-shadow: 0 10px 24px -12px rgba(5, 150, 105, 0.7); }
.dps-step--on .dps-step__n { background: rgba(255, 255, 255, 0.22); }
.dps-step--done { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; cursor: pointer; }
.dps-step--done .dps-step__n { background: #059669; color: #fff; }
.dps-step--off { background: #fff; color: #6b7280; border-color: #e5e7eb; }
.dps-step--off .dps-step__n { background: #f3f4f6; }
.dps-rot { transform: rotate(180deg); }
.dps-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: 12px; padding: 11px 20px; font-size: 14px; font-weight: 700; transition: background .15s, border-color .15s; }
.dps-btn:disabled { opacity: .6; cursor: not-allowed; }
.dps-btn--primary { background: #059669; color: #fff; min-width: 160px; }
.dps-btn--primary:hover:not(:disabled) { background: #047857; }
.dps-btn--ghost { background: #fff; border: 1px solid #e5e7eb; color: #374151; }
.dps-btn--ghost:hover:not(:disabled) { border-color: #10b981; color: #047857; }
.dps-btn--white { background: #fff; color: #047857; }
.dps-btn--white:hover { background: #ecfdf5; }
.dps-seg { border: 1px solid #e5e7eb; border-radius: 10px; padding: 5px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background: #fff; }
.dps-seg--on { border-color: #10b981; background: #ecfdf5; color: #047857; }
.dps-card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 12px 14px; background: #fff; transition: border-color .15s; }
.dps-card:hover { border-color: #d1d5db; }
.dps-card--on { border-color: #10b981; background: #ecfdf5; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.18); }
.h-fit { height: fit-content; }
.dps-edit { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
.dps-step--nav { cursor: pointer; }
.dps-step--off.dps-step--nav:hover { border-color: #10b981; color: #047857; }
.dps-result { background: linear-gradient(135deg, #059669 0%, #047857 45%, #0f766e 100%); box-shadow: 0 18px 40px -18px rgba(5, 150, 105, 0.55); }
.dps-muted { color: rgba(255, 255, 255, 0.85); }
.dps-warn { background: rgba(254, 243, 199, 0.95); color: #92400e; }
</style>
