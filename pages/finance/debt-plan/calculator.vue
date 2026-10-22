<template>
  <!-- 22.10 (egasi hujjati "Qarzdan chiqish", Ekranlar 6): "Agar" kalkulyatori — oylik qo'shimcha summa
       surgichi va bir martalik pul. POST /finance/debt-plan/simulate { whatIf } (saqlanmaydi);
       taqqoslash asosi — joriy reja (GET /finance/debt-plan → result.scenarios.base). -->
  <div class="dpk pb-10">
    <div class="flex items-center gap-3 mb-5">
      <PageBackButton :to="localePath({ name: 'finance-debt-plan' })" />
      <div class="min-w-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('debt_plan.calc_title') }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ $t('debt_plan.calc_subtitle') }}</p>
      </div>
    </div>

    <div v-if="planLoading && !planData" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">{{ $t('common.loading') }}</div>
    <div v-else-if="!baseScenario" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-gray-600 mb-4">{{ planError ? $t('debt_plan.err.load') : ((planData && planData.resultError && planData.resultError.message) || $t('debt_plan.not_feasible_short')) }}</p>
      <button type="button" class="dpk-btn" @click="loadPlan()">{{ $t('debt_plan.retry') }}</button>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-5 gap-5">
      <!-- Kirish -->
      <section class="xl:col-span-2 space-y-4">
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <div class="flex items-baseline justify-between gap-3">
            <label class="font-bold text-gray-900" for="dpk-extra">{{ $t('debt_plan.calc_extra') }}</label>
            <span class="text-xl font-extrabold text-emerald-700 whitespace-nowrap">+{{ sum(extraMonthly) }}</span>
          </div>
          <input id="dpk-extra" v-model.number="extraMonthly" type="range" min="0" :max="EXTRA_MAX" :step="EXTRA_STEP" class="dpk-range mt-4" :style="rangeStyle" />
          <div class="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>{{ mln(EXTRA_MAX) }}</span></div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button v-for="v in presets" :key="'p' + v" type="button" class="dpk-chip" :class="{ 'dpk-chip--on': extraMonthly === v }" @click="extraMonthly = v">+{{ mln(v) }}</button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5">
          <p class="font-bold text-gray-900">{{ $t('debt_plan.calc_oneoff') }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ $t('debt_plan.calc_oneoff_hint') }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label class="dpk-label">{{ $t('debt_plan.col.amount') }} (UZS)</label>
              <input v-model.number="oneOffAmount" type="number" min="0" step="100000" class="dpk-input" placeholder="0" />
            </div>
            <div>
              <label class="dpk-label">{{ $t('debt_plan.col.month') }}</label>
              <select v-model="oneOffYm" class="dpk-input">
                <option v-for="ym in monthOptions" :key="ym" :value="ym">{{ ymText(ym) }}</option>
              </select>
            </div>
          </div>
        </div>
        <button v-if="extraMonthly || oneOffAmount" type="button" class="text-sm font-semibold text-gray-500 hover:text-gray-700" @click="reset">↺ {{ $t('debt_plan.calc_reset') }}</button>
      </section>

      <!-- Natija -->
      <section class="xl:col-span-3 space-y-4">
        <div class="dpk-result rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-sm dpk-muted font-semibold uppercase tracking-wide">{{ $t('debt_plan.debt_free') }}</p>
            <p class="text-3xl lg:text-4xl font-extrabold mt-1">{{ shown && shown.finishYm ? ymText(shown.finishYm) : '—' }}</p>
            <p v-if="shown && !shown.finishYm && !simBusy" class="text-sm dpk-muted mt-1">{{ $t('debt_plan.never_finish') }}</p>
            <p class="text-sm dpk-muted mt-1">{{ $t('debt_plan.calc_was', { date: baseScenario.finishYm ? ymText(baseScenario.finishYm) : '—' }) }}<span v-if="simBusy"> · …</span></p>
            <div class="grid grid-cols-2 gap-3 mt-5">
              <div class="dpk-stat rounded-xl px-4 py-3">
                <p class="text-xs dpk-muted">{{ $t('debt_plan.calc_months_saved') }}</p>
                <p class="text-2xl font-extrabold mt-0.5">{{ monthsSaved > 0 ? $t('debt_plan.months_n', { n: monthsSaved }) : '0' }}</p>
              </div>
              <div class="dpk-stat rounded-xl px-4 py-3">
                <p class="text-xs dpk-muted">{{ $t('debt_plan.calc_cost_saved') }}</p>
                <p class="text-2xl font-extrabold mt-0.5">{{ sum(Math.max(0, costSaved)) }} <span class="text-xs dpk-muted">UZS</span></p>
              </div>
            </div>
            <p v-if="simError" class="dpk-warn mt-4 rounded-xl px-3 py-2 text-sm">{{ $t('debt_plan.err.simulate') }}</p>
            <p v-else-if="summaryText" class="mt-4 text-sm leading-relaxed">{{ summaryText }}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5">
          <h2 class="text-lg font-bold text-gray-900 mb-2">{{ $t('debt_plan.chart_title') }}</h2>
          <RemainingChart :series="chartSeries" :height="270" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import PageBackButton from '@/components/ui/PageBackButton.vue'
import RemainingChart from '@/components/finance/debtPlan/RemainingChart.vue'
import debtPlanMixin from '@/mixins/debtPlanMixin'
import { unwrap, ymAdd, num, currentYm } from '@/utils/debtPlan'

const EXTRA_MAX = 5000000
const EXTRA_STEP = 50000
const DEBOUNCE_MS = 450
const MONTH_OPTIONS = 24

export default {
  name: 'DebtPlanCalculator',
  components: { PageBackButton, RemainingChart },
  mixins: [debtPlanMixin],
  middleware: 'auth',

  data() {
    return {
      EXTRA_MAX,
      EXTRA_STEP,
      presets: [500000, 1000000, 2000000],
      extraMonthly: 0,
      oneOffAmount: null,
      oneOffYm: currentYm(),
      sim: null,
      simBusy: false,
      simError: false,
      timer: null,
      reqSeq: 0,
    }
  },

  head() {
    return { title: this.$t('debt_plan.calc_title') }
  },

  computed: {
    isWhatIf() { return num(this.extraMonthly) > 0 || num(this.oneOffAmount) > 0 },
    simBase() { return (this.sim && this.sim.scenarios && this.sim.scenarios.base) || null },
    shown() { return this.isWhatIf ? (this.simBase || null) : this.baseScenario },
    monthsSaved() { return this.isWhatIf && this.simBase ? num(this.baseScenario.months) - num(this.simBase.months) : 0 },
    costSaved() { return this.isWhatIf && this.simBase ? num(this.baseScenario.cost) - num(this.simBase.cost) : 0 },
    monthOptions() {
      const start = this.startYm
      return Array.from({ length: MONTH_OPTIONS }, (_, i) => ymAdd(start, i))
    },
    rangeStyle() {
      const p = Math.round((num(this.extraMonthly) / EXTRA_MAX) * 100)
      return { background: `linear-gradient(90deg, #10b981 ${p}%, #e5e7eb ${p}%)` }
    },
    summaryText() {
      if (!this.isWhatIf || !this.simBase) return ''
      if (this.monthsSaved <= 0 && this.costSaved <= 0) return this.$t('debt_plan.calc_no_gain')
      return this.$t('debt_plan.calc_summary', { months: Math.max(0, this.monthsSaved), sum: this.mln(Math.max(0, this.costSaved)) })
    },
    chartSeries() {
      const base = { name: this.$t('debt_plan.calc_series_plan'), color: '#94A3B8', points: this.schedule.map((s) => ({ ym: s.ym, value: num(s.totalRemaining) })) }
      if (!this.isWhatIf || !this.sim || !this.sim.schedule) return [{ ...base, color: '#10B981' }]
      const alt = { name: this.$t('debt_plan.calc_series_new'), color: '#10B981', points: this.sim.schedule.map((s) => ({ ym: s.ym, value: num(s.totalRemaining) })) }
      return [alt, { ...base, dashed: true }]
    },
  },

  watch: {
    extraMonthly() { this.schedule_() },
    oneOffAmount() { this.schedule_() },
    oneOffYm() { if (num(this.oneOffAmount) > 0) this.schedule_() },
    startYm(v) { if (!this.monthOptions.includes(this.oneOffYm)) this.oneOffYm = v },
  },

  async mounted() {
    await this.loadPlan()
    this.redirectIfNotSetup()
  },

  beforeDestroy() {
    clearTimeout(this.timer)
  },

  methods: {
    reset() {
      this.extraMonthly = 0
      this.oneOffAmount = null
    },
    schedule_() {
      clearTimeout(this.timer)
      if (!this.isWhatIf) {
        this.sim = null
        this.simError = false
        return
      }
      this.timer = setTimeout(this.runSim, DEBOUNCE_MS)
    },
    async runSim() {
      const seq = ++this.reqSeq
      this.simBusy = true
      this.simError = false
      const whatIf = { extraMonthly: Math.max(0, Math.round(num(this.extraMonthly))) }
      if (num(this.oneOffAmount) > 0) whatIf.oneOff = { ym: this.oneOffYm, amount: Math.round(num(this.oneOffAmount)) }
      try {
        const res = await this.$axios.$post('/finance/debt-plan/simulate', { whatIf }, { silent: true, background: true })
        if (seq !== this.reqSeq) return
        const d = unwrap(res)
        const r = d && d.result !== undefined ? d.result : d // javob: { startYm, result }
        if (!r) throw new Error('empty')
        this.sim = r
      } catch (e) {
        if (seq === this.reqSeq) this.simError = true
      } finally {
        if (seq === this.reqSeq) this.simBusy = false
      }
    },
  },
}
</script>

<style scoped>
.dpk-btn { display: inline-flex; border-radius: 12px; padding: 10px 18px; font-size: 14px; font-weight: 700; background: #059669; color: #fff; }
.dpk-label { display: block; font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 4px; }
.dpk-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 9px 12px; font-size: 14px; background: #fff; outline: none; }
.dpk-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
.dpk-range { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 9999px; outline: none; cursor: pointer; }
.dpk-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 9999px; background: #fff; border: 3px solid #059669; box-shadow: 0 2px 6px rgba(5, 150, 105, 0.35); }
.dpk-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 9999px; background: #fff; border: 3px solid #059669; }
.dpk-chip { border: 1px solid #e5e7eb; border-radius: 9999px; padding: 5px 12px; font-size: 13px; font-weight: 600; color: #374151; background: #fff; }
.dpk-chip:hover { border-color: #10b981; }
.dpk-chip--on { border-color: #059669; background: #059669; color: #fff; }
.dpk-result { background: linear-gradient(135deg, #059669 0%, #047857 45%, #0f766e 100%); box-shadow: 0 18px 40px -18px rgba(5, 150, 105, 0.55); }
.dpk-muted { color: rgba(255, 255, 255, 0.82); }
.dpk-stat { background: rgba(255, 255, 255, 0.13); border: 1px solid rgba(255, 255, 255, 0.2); }
.dpk-warn { background: rgba(254, 243, 199, 0.95); color: #92400e; }
</style>
