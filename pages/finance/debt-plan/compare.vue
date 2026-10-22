<template>
  <!-- 22.10 (egasi hujjati "Qarzdan chiqish", Ekranlar 5): usullarni solishtirish — algoritm rejasi,
       Qor ko'chkisi va o'z tartibim × 3 stsenariy. Har usul POST /finance/debt-plan/simulate { strategy }
       (bazaga yozmaydi). -->
  <div class="dpc pb-10">
    <div class="flex items-center gap-3 mb-5">
      <PageBackButton :to="localePath({ name: 'finance-debt-plan' })" />
      <div class="min-w-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('debt_plan.compare_title') }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ $t('debt_plan.compare_subtitle') }}</p>
      </div>
    </div>

    <div v-if="loading && !anyResult" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">{{ $t('common.loading') }}</div>
    <div v-else-if="!anyResult" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-gray-600 mb-4">{{ $t('debt_plan.err.load') }}</p>
      <button type="button" class="dpc-btn" @click="load">{{ $t('debt_plan.retry') }}</button>
    </div>

    <template v-else>
      <!-- Jadval: usul × stsenariy -->
      <section class="bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
        <div class="overflow-x-auto">
          <table class="w-full text-sm dpc-table">
            <thead>
              <tr class="bg-gray-50 text-left text-xs text-gray-500">
                <th class="px-5 py-3 font-semibold">{{ $t('debt_plan.col.method') }}</th>
                <th v-for="sc in scenarios" :key="'h' + sc" class="px-5 py-3 font-semibold">
                  {{ $t('debt_plan.scenario.' + sc) }}
                  <span class="block font-normal text-gray-400">{{ $t('debt_plan.scenario_hint.' + sc) }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="st in strategies" :key="st" :class="{ 'dpc-row--current': st === settings.strategy }">
                <td class="px-5 py-4 align-top">
                  <p class="font-bold text-gray-900">{{ $t('debt_plan.strategy.' + st) }}</p>
                  <p class="text-xs text-gray-500 mt-0.5 max-w-xs">{{ $t('debt_plan.strategy_hint.' + st) }}</p>
                  <span v-if="st === settings.strategy" class="inline-block mt-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">{{ $t('debt_plan.current') }}</span>
                </td>
                <td v-for="sc in scenarios" :key="st + sc" class="px-5 py-4 align-top">
                  <template v-if="cell(st, sc)">
                    <p class="font-extrabold text-gray-900" :class="{ 'dpc-best': isBest(st, sc) }">{{ cell(st, sc).finishYm ? ymText(cell(st, sc).finishYm) : '—' }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ cell(st, sc).months ? $t('debt_plan.in_months', { n: cell(st, sc).months }) : $t('debt_plan.not_feasible_short') }}</p>
                    <p class="text-xs text-gray-700 mt-1">{{ $t('debt_plan.cost_short', { sum: mln(cell(st, sc).cost) }) }}</p>
                    <p v-if="cell(st, sc).events && cell(st, sc).events.length" class="text-xs text-red-600 mt-1">{{ $t('debt_plan.events_count', { n: cell(st, sc).events.length }) }}</p>
                  </template>
                  <span v-else-if="errors[st]" class="text-xs text-red-500">{{ $t('debt_plan.err.simulate') }}</span>
                  <span v-else class="text-xs text-gray-300">…</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="savingVsSnowball" class="px-5 py-3 bg-emerald-50 text-sm text-emerald-900 border-t border-emerald-100">{{ savingVsSnowball }}</p>
      </section>

      <!-- Yopilish tartibi -->
      <h2 class="text-lg font-bold text-gray-900 mb-3">{{ $t('debt_plan.closing_order') }}</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section v-for="st in strategies" :key="'o' + st" class="bg-white rounded-2xl shadow-sm p-5">
          <h3 class="font-bold text-gray-900 mb-3">{{ $t('debt_plan.strategy.' + st) }}</h3>
          <ol v-if="closingOrder(st).length" class="space-y-2">
            <li v-for="(c, i) in closingOrder(st)" :key="st + c.debtId" class="flex items-center gap-3">
              <span class="dpc-n">{{ i + 1 }}</span>
              <span class="flex-1 min-w-0 truncate text-sm text-gray-800">{{ debtTitle(c.debtId) }}</span>
              <span class="text-xs text-gray-500 whitespace-nowrap">{{ ymText(c.ym) }}</span>
            </li>
          </ol>
          <p v-else class="text-sm text-gray-400">{{ st === 'manual' ? $t('debt_plan.manual_hint') : '—' }}</p>
        </section>
      </div>
    </template>
  </div>
</template>

<script>
import PageBackButton from '@/components/ui/PageBackButton.vue'
import debtPlanMixin from '@/mixins/debtPlanMixin'
import { STRATEGIES, SCENARIOS, unwrap, num } from '@/utils/debtPlan'

export default {
  name: 'DebtPlanCompare',
  components: { PageBackButton },
  mixins: [debtPlanMixin],
  middleware: 'auth',

  data() {
    return { strategies: STRATEGIES, scenarios: SCENARIOS, sims: {}, errors: {}, loading: true }
  },

  head() {
    return { title: this.$t('debt_plan.compare_title') }
  },

  computed: {
    anyResult() { return Object.keys(this.sims).length > 0 },
    savingVsSnowball() {
      const a = this.cell('optimal', 'base')
      const b = this.cell('snowball', 'base')
      if (!a || !b) return ''
      const dm = num(b.months) - num(a.months)
      const dc = num(b.cost) - num(a.cost)
      if (dm <= 0 && dc <= 0) return ''
      return this.$t('debt_plan.vs_snowball', { months: Math.max(0, dm), sum: this.mln(Math.max(0, dc)) })
    },
  },

  mounted() {
    this.load()
  },

  methods: {
    async load() {
      this.loading = true
      this.errors = {}
      // Qarz nomlari va joriy usul uchun reja (fon), keyin har usul alohida simulyatsiya
      const planP = this.loadPlan({ background: true })
      await Promise.all(this.strategies.map((st) => this.simulate(st)))
      await planP
      this.loading = false
      this.redirectIfNotSetup()
    },
    async simulate(strategy) {
      try {
        const res = await this.$axios.$post('/finance/debt-plan/simulate', { strategy }, { silent: true })
        const d = unwrap(res)
        const r = d && d.result !== undefined ? d.result : d // javob: { startYm, result }
        if (!r) throw new Error('empty')
        this.sims = { ...this.sims, [strategy]: r }
      } catch (e) {
        this.errors = { ...this.errors, [strategy]: true }
      }
    },
    cell(st, sc) {
      const r = this.sims[st]
      return (r && r.scenarios && r.scenarios[sc]) || null
    },
    isBest(st, sc) {
      const mine = this.cell(st, sc)
      if (!mine || !mine.months) return false // 600 oyda ham tugamasa — "eng yaxshi" emas
      return this.strategies.every((o) => {
        const c = this.cell(o, sc)
        return !c || !c.months || num(mine.months) < num(c.months) || (num(mine.months) === num(c.months) && num(mine.cost) <= num(c.cost))
      })
    },
    closingOrder(st) {
      const base = this.cell(st, 'base')
      const closed = (base && base.closed) || {}
      return Object.keys(closed)
        .map((debtId) => ({ debtId, ym: closed[debtId] }))
        .sort((a, b) => String(a.ym).localeCompare(String(b.ym)))
    },
  },
}
</script>

<style scoped>
.dpc-btn { display: inline-flex; border-radius: 12px; padding: 10px 18px; font-size: 14px; font-weight: 700; background: #059669; color: #fff; }
.dpc-row--current { background: #f0fdf4; }
.dpc-best { color: #047857; }
.dpc-best::after { content: ' ★'; color: #f59e0b; font-size: 12px; }
.dpc-n { width: 24px; height: 24px; border-radius: 8px; background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dpc-table th, .dpc-table td { min-width: 150px; }
</style>
