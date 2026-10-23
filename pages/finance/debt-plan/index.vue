<template>
  <!-- 22.10 (egasi hujjati "Qarzdan chiqish", Ekranlar 2–3): asosiy panel. Hisob backendda
       (GET /finance/debt-plan → result), bu yerda faqat ko'rsatish va "To'ladim". -->
  <div class="dp-page pb-10">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
      <div class="flex items-center gap-3 min-w-0">
        <PageBackButton :to="localePath({ name: 'finance' })" />
        <div class="min-w-0">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{{ $t('debt_plan.title') }}</h1>
          <p class="text-gray-500 text-sm mt-0.5">{{ $t('debt_plan.subtitle') }}</p>
        </div>
      </div>
      <div v-if="result || (planData && setupDone)" class="flex flex-wrap gap-2">
        <nuxt-link v-if="result" :to="localePath({ name: 'finance-debt-plan-calculator' })" class="dp-btn dp-btn--ghost">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          {{ $t('debt_plan.nav_calculator') }}
        </nuxt-link>
        <nuxt-link v-if="result" :to="localePath({ name: 'finance-debt-plan-compare' })" class="dp-btn dp-btn--ghost">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
          {{ $t('debt_plan.nav_compare') }}
        </nuxt-link>
        <!-- 23.10 (egasi hujjati 22.10, 12-rasm): reja sozlamalarini TAHRIRLASH — doim ko'rinadi (reja tuzilmagan bo'lsa ham) -->
        <nuxt-link :to="localePath({ name: 'finance-debt-plan-setup' })" class="dp-btn dp-btn--edit">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          {{ $t('debt_plan.nav_edit_settings') }}
        </nuxt-link>
      </div>
    </div>

    <div v-if="planLoading && !planData" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">{{ $t('common.loading') }}</div>

    <div v-else-if="planError && !planData" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-gray-600 mb-4">{{ $t('debt_plan.err.load') }}</p>
      <button type="button" class="dp-btn dp-btn--primary" @click="loadAll">{{ $t('debt_plan.retry') }}</button>
    </div>

    <div v-else-if="planData && !activeDebts.length" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-lg font-bold text-gray-900">{{ $t('debt_plan.empty_title') }}</p>
      <p class="text-gray-500 mt-1 mb-5">{{ $t('debt_plan.empty_text') }}</p>
      <nuxt-link :to="localePath({ name: 'finance-debts-add', query: { type: 'borrowed' } })" class="dp-btn dp-btn--primary">{{ $t('debt_plan.add_debt') }}</nuxt-link>
    </div>

    <div v-else-if="planData && !result" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-lg font-bold text-gray-900">{{ $t('debt_plan.not_feasible_short') }}</p>
      <p class="text-gray-500 mt-1 mb-5">{{ (planData.resultError && planData.resultError.message) || $t('debt_plan.err.load') }}</p>
      <nuxt-link :to="localePath({ name: 'finance-debt-plan-setup' })" class="dp-btn dp-btn--primary">{{ $t('debt_plan.fix_data') }}</nuxt-link>
    </div>

    <template v-else-if="result">
      <!-- HERO: qarzsiz bo'lish sanasi (asosiy va'da) -->
      <section class="dp-hero rounded-2xl p-5 lg:p-7 text-white relative overflow-hidden mb-5">
        <div class="dp-hero__glow"></div>
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div class="lg:col-span-2 min-w-0">
            <p class="text-sm font-medium dp-muted uppercase tracking-wide">{{ $t('debt_plan.debt_free') }}</p>
            <p v-if="baseScenario && baseScenario.finishYm" class="text-4xl lg:text-5xl font-extrabold mt-1 leading-tight">{{ ymText(baseScenario.finishYm) }}</p>
            <template v-else>
              <p class="text-3xl font-extrabold mt-1">{{ $t('debt_plan.not_feasible_short') }}</p>
              <p class="text-sm dp-muted mt-2 max-w-xl">{{ $t('debt_plan.never_finish') }}</p>
            </template>
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span v-if="baseScenario && baseScenario.months" class="dp-chip">{{ $t('debt_plan.in_months', { n: baseScenario.months }) }}</span>
              <span v-if="p90Ym" class="dp-chip">{{ $t('debt_plan.p90', { date: ymText(p90Ym) }) }}</span>
              <span class="dp-chip">{{ $t('debt_plan.strategy_label') }}: <b class="ml-1">{{ $t('debt_plan.strategy.' + settings.strategy) }}</b></span>
            </div>
            <p v-if="scenarioRange" class="text-sm dp-muted mt-3">{{ scenarioRange }}</p>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div class="dp-hero-stat rounded-xl px-4 py-3">
              <p class="text-xs dp-muted">{{ $t('debt_plan.interest_fx') }}</p>
              <p class="text-xl font-bold mt-0.5">{{ sum(totals.interestAndFx) }} <span class="text-xs font-semibold dp-muted">UZS</span></p>
            </div>
            <div v-if="result.monteCarlo && result.monteCarlo.pNewDebt != null" class="dp-hero-stat rounded-xl px-4 py-3">
              <p class="text-xs dp-muted">{{ $t('debt_plan.p_new_debt') }}</p>
              <p class="text-xl font-bold mt-0.5">{{ Math.round(result.monteCarlo.pNewDebt * 100) }}%</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Katta raqamlar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500">
          <p class="text-sm text-gray-500">{{ $t('debt_plan.total_debt') }}</p>
          <p class="text-3xl font-extrabold text-gray-900 mt-1 leading-tight">{{ sum(totals.totalDebt) }} <span class="text-sm font-semibold text-gray-400">UZS</span></p>
          <p class="text-xs text-gray-400 mt-1">{{ $t('debt_plan.debts_count', { n: activeDebts.length }) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500">
          <p class="text-sm text-gray-500">{{ $t('debt_plan.this_month_pay') }}</p>
          <p class="text-3xl font-extrabold text-gray-900 mt-1 leading-tight">{{ sum(monthTotal) }} <span class="text-sm font-semibold text-gray-400">UZS</span></p>
          <p class="text-xs text-gray-400 mt-1">{{ $t('debt_plan.required_part', { sum: sum(totals.monthlyRequired) }) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-emerald-500">
          <p class="text-sm text-gray-500">{{ $t('debt_plan.safe_today') }}</p>
          <template v-if="dailyLimit && dailyLimit.amount != null">
            <p class="text-3xl font-extrabold mt-1 leading-tight" :class="dailyLimit.amount > 0 ? 'text-emerald-700' : 'text-red-600'">{{ sum(dailyLimit.amount) }} <span class="text-sm font-semibold text-gray-400">UZS</span></p>
            <p class="text-xs text-gray-400 mt-1">
              <span v-if="dailyLimit.until">{{ $t('debt_plan.until', { date: fmtDay(dailyLimit.until) }) }}</span>
              <span v-if="dailyExplain"> · {{ dailyExplain }}</span>
            </p>
          </template>
          <p v-else-if="dailyLimitError" class="text-sm text-gray-400 mt-2">{{ $t('debt_plan.err.daily') }}</p>
          <p v-else class="text-sm text-gray-300 mt-2">{{ $t('common.loading') }}</p>
        </div>
      </div>

      <!-- Qoplash ogohlantirishi (F9) va yetishmovchilik hodisalari -->
      <section v-if="coverageVerdict !== 'ok' || events.length" class="rounded-2xl p-4 lg:p-5 mb-5 border" :class="coverageVerdict === 'infeasible' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'">
        <div class="flex gap-3">
          <svg class="w-6 h-6 flex-shrink-0 mt-0.5" :class="coverageVerdict === 'infeasible' ? 'text-red-600' : 'text-amber-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="min-w-0 flex-1">
            <h2 class="font-bold" :class="coverageVerdict === 'infeasible' ? 'text-red-800' : 'text-amber-900'">{{ $t('debt_plan.coverage.' + coverageVerdict + '_title') }}</h2>
            <p class="text-sm mt-1 leading-relaxed" :class="coverageVerdict === 'infeasible' ? 'text-red-700' : 'text-amber-800'">
              {{ $t('debt_plan.coverage.' + coverageVerdict + '_text', { q: qText }) }}
            </p>
            <ul v-if="events.length" class="mt-3 space-y-1.5">
              <li v-for="(ev, i) in events" :key="'ev' + i" class="flex flex-wrap items-baseline gap-x-2 text-sm">
                <span class="dp-ev-badge">{{ $t('debt_plan.scenario.' + ev.scenario) }}</span>
                <span class="text-gray-800">{{ eventText(ev) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <!-- Qoldiq grafigi -->
        <section class="xl:col-span-2 bg-white rounded-2xl p-5 lg:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 class="text-lg font-bold text-gray-900">{{ $t('debt_plan.chart_title') }}</h2>
            <p class="text-xs text-gray-400">UZS · {{ $t('debt_plan.scenario.base') }}</p>
          </div>
          <RemainingChart v-if="chartSeries[0].points.length > 1" :series="chartSeries" :height="290" />
          <p v-else class="text-center text-gray-400 py-16">{{ $t('debt_plan.no_schedule') }}</p>
        </section>

        <!-- Shu oy to'lovlari -->
        <section class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <header class="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">{{ $t('debt_plan.month_payments') }}</h2>
            <span v-if="thisMonth" class="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">{{ ymText(thisMonth.ym) }}</span>
          </header>
          <ul v-if="monthPayments.length" class="divide-y divide-gray-100 flex-1">
            <li v-for="p in monthPayments" :key="p.key" class="px-5 py-3 flex items-center gap-3">
              <div class="dp-day flex-shrink-0">
                <span class="dp-day__num">{{ p.day || '—' }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <nuxt-link :to="detailPath(p.debtId)" class="font-semibold text-gray-900 hover:text-emerald-700 truncate block">{{ debtTitle(p.debtId) }}</nuxt-link>
                <p class="text-xs mt-0.5">
                  <span class="dp-type" :class="'dp-type--' + p.type">{{ $t('debt_plan.pay_type.' + p.type) }}</span>
                  <span class="text-gray-900 font-bold ml-1.5">{{ sum(p.amount) }}</span>
                </p>
              </div>
              <span v-if="isPaid(p)" class="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1.5 flex-shrink-0">✓ {{ $t('debt_plan.paid') }}</span>
              <button v-else-if="p.type !== 'saving'" type="button" class="dp-btn dp-btn--pay flex-shrink-0" @click="openPay(p)">{{ $t('debt_plan.i_paid') }}</button>
            </li>
          </ul>
          <p v-else class="text-center text-gray-400 py-10 px-5 text-sm">{{ $t('debt_plan.no_payments_month') }}</p>
          <footer v-if="thisMonth && (thisMonth.living || thisMonth.buffer != null)" class="px-5 py-3 bg-gray-50 text-xs text-gray-500 space-y-0.5">
            <p v-if="thisMonth.living">{{ $t('debt_plan.living_line', { L: sum(thisMonth.living.L), F: sum(thisMonth.living.F) }) }}</p>
            <p v-if="thisMonth.buffer != null">{{ $t('debt_plan.buffer_line', { sum: sum(thisMonth.buffer) }) }}</p>
          </footer>
        </section>
      </div>

      <!-- Yopish navbati -->
      <section class="mb-5">
        <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 class="text-lg font-bold text-gray-900">{{ $t('debt_plan.order_title') }}</h2>
          <p class="text-xs text-gray-500">{{ $t('debt_plan.order_hint.' + settings.strategy) }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          <nuxt-link v-for="(o, i) in orderCards" :key="'o' + o.debtId" :to="detailPath(o.debtId)" class="dp-order block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition" :class="{ 'dp-order--target': i === 0 }">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span class="dp-rank flex-shrink-0" :class="{ 'dp-rank--target': i === 0 }">{{ i + 1 }}</span>
                <div class="min-w-0">
                  <p class="font-bold text-gray-900 truncate">{{ o.debt.title }}</p>
                  <p class="text-xs text-gray-500">{{ o.debt.kind ? $t('debt_plan.kind.' + o.debt.kind) : $t('debt_plan.kind_unset') }}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="font-extrabold text-gray-900">{{ sum(o.debt.balance) }} <span class="text-xs font-semibold text-gray-400">{{ o.debt.currency }}</span></p>
                <p v-if="o.monthlyRate != null" class="text-xs text-gray-500">{{ $t('debt_plan.rate_month', { r: pct(o.monthlyRate) }) }}</p>
              </div>
            </div>
            <div v-if="o.progress != null" class="dp-bar mt-4"><div class="dp-bar__fill" :style="{ width: Math.max(2, o.progress) + '%' }"></div></div>
            <div class="flex justify-between text-xs text-gray-500" :class="o.progress != null ? 'mt-1.5' : 'mt-3'">
              <span v-if="o.progress != null">{{ $t('debt_plan.paid_pct', { p: o.progress }) }}</span>
              <span v-else>{{ o.debt.apr ? $t('debt_plan.apr_short', { apr: o.debt.apr }) : '' }}</span>
              <span v-if="o.closedYm">{{ $t('debt_plan.closes', { date: ymText(o.closedYm) }) }}</span>
            </div>
            <p class="text-sm text-gray-700 mt-3 leading-relaxed">{{ reasonText(o) }}</p>
            <p v-if="o.next" class="text-xs text-gray-500 mt-2">
              {{ $t('debt_plan.next_payment', { date: (o.next.day ? o.next.day + ' · ' : '') + ymText(o.next.ym), sum: sum(o.next.amount) }) }}
            </p>
            <span v-if="i === 0" class="dp-target-badge">{{ $t('debt_plan.target') }}</span>
          </nuxt-link>
        </div>
        <div v-if="excludedDebts.length" class="mt-4 bg-gray-50 rounded-2xl p-4">
          <p class="text-sm font-semibold text-gray-600 mb-2">{{ $t('debt_plan.excluded_title') }}</p>
          <div class="flex flex-wrap gap-2">
            <nuxt-link v-for="d in excludedDebts" :key="'x' + d.id" :to="detailPath(d.id)" class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:border-gray-300">
              {{ d.title }} · {{ sum(d.balance) }} {{ d.currency }}
            </nuxt-link>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">{{ $t('debt_plan.contracts_note') }}</p>
      </section>
    </template>

    <ConfirmModal
      v-if="payRow"
      :title="$t('debt_plan.pay_confirm_title', { debt: debtTitle(payRow.debtId) })"
      :message="$t('debt_plan.pay_confirm_text')"
      :confirm-text="$t('debt_plan.i_paid')"
      tone="success"
      icon="✓"
      :busy="payBusy"
      @cancel="payRow = null"
      @confirm="submitPay"
    >
      <label class="block text-xs font-semibold text-gray-500 mb-1">{{ $t('debt_plan.pay_amount') }} ({{ payCurrency }})</label>
      <MoneyInput v-model="payAmount" input-class="dp-pay-input" placeholder="0" />
      <p v-if="payCurrency !== 'UZS'" class="text-xs text-gray-400 mt-1">{{ $t('debt_plan.pay_fx_hint', { sum: sum(payRow.amount) }) }}</p>
    </ConfirmModal>
  </div>
</template>

<script>
import PageBackButton from '@/components/ui/PageBackButton.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import RemainingChart from '@/components/finance/debtPlan/RemainingChart.vue'
import MoneyInput from '@/components/finance/debtPlan/MoneyInput.vue'
import debtPlanMixin from '@/mixins/debtPlanMixin'
import { currentYm, unwrap, todayIso, num, langParams } from '@/utils/debtPlan'
import { fmtDMY } from '@/utils/helpers'

export default {
  name: 'DebtPlanDashboard',
  components: { PageBackButton, ConfirmModal, RemainingChart, MoneyInput },
  mixins: [debtPlanMixin],
  middleware: 'auth',

  data() {
    return {
      dailyLimit: null,
      dailyLimitError: false,
      payRow: null,
      payAmount: '',
      payBusy: false,
      paidKeys: {},
      monthData: null,
    }
  },

  head() {
    return { title: this.$t('debt_plan.title') }
  },

  computed: {
    totals() { return (this.result && this.result.totals) || { totalDebt: 0, monthlyRequired: 0, interestAndFx: 0 } },
    activeDebts() { return this.planDebts.filter((d) => !d.excluded && d.status !== 'completed' && d.balance > 0) },
    excludedDebts() { return this.planDebts.filter((d) => d.excluded && d.status !== 'completed') },
    coverageVerdict() {
      const c = this.result && this.result.coverage
      if (this.result && this.result.feasible === false) return 'infeasible'
      return (c && c.verdict) || 'ok'
    },
    qText() {
      const c = (this.result && this.result.coverage) || {}
      if (c.q == null) return '—'
      const s = Number(c.q).toFixed(2)
      return this.$i18n.locale === 'en' ? s : s.replace('.', ',')
    },
    events() {
      const sc = (this.result && this.result.scenarios) || {}
      const out = []
      ;['base', 'conservative'].forEach((name) => {
        ((sc[name] && sc[name].events) || []).forEach((ev) => out.push({ ...ev, scenario: name }))
      })
      return out.slice(0, 8)
    },
    p90Ym() {
      const mc = this.result && this.result.monteCarlo
      return mc && mc.p90 ? this.ymFromMonths(mc.p90) : null
    },
    scenarioRange() {
      const sc = (this.result && this.result.scenarios) || {}
      if (!sc.optimistic || !sc.conservative || !sc.optimistic.finishYm || !sc.conservative.finishYm) return ''
      return this.$t('debt_plan.range', { from: this.ymText(sc.optimistic.finishYm), to: this.ymText(sc.conservative.finishYm) })
    },
    thisMonth() {
      const ym = currentYm()
      return this.schedule.find((s) => s.ym === ym) || this.schedule[0] || null
    },
    /**
     * Shu oy to'lovlari: GET /finance/debt-plan/month (qarz valyutasidagi summa + shu oy haqiqatda
     * to'langan) bo'lsa o'shandan, aks holda result.schedule dan. To'langan summa qarzning
     * qatorlariga tartib bilan (kechikkan → majburiy → qo'shimcha) taqsimlanadi.
     */
    monthPayments() {
      const src = (this.monthData && this.monthData.payments) || (this.thisMonth && this.thisMonth.payments) || []
      const ym = (this.monthData && this.monthData.ym) || (this.thisMonth && this.thisMonth.ym) || ''
      const ORDER = { overdue: 0, required: 1, extra: 2, saving: 3 }
      const paidLeft = {}
      const rows = src
        .filter((p) => num(p.amount) > 0 && !p.isNewDebt)
        .map((p, i) => ({ ...p, key: `${ym}-${p.debtId}-${p.type}-${i}` }))
        .sort((a, b) => (ORDER[a.type] ?? 9) - (ORDER[b.type] ?? 9))
      rows.forEach((r) => {
        const k = String(r.debtId)
        if (paidLeft[k] === undefined) paidLeft[k] = num(r.paidThisMonth)
        const need = r.amountOrig != null ? num(r.amountOrig) : num(r.amount)
        r.paidPart = r.type === 'saving' ? 0 : Math.min(paidLeft[k], need)
        if (r.type !== 'saving') paidLeft[k] -= r.paidPart
        r.isPaid = r.type !== 'saving' && need > 0 && r.paidPart >= need * 0.99
      })
      return rows.sort((a, b) => (a.day || 99) - (b.day || 99))
    },
    dailyExplain() {
      const e = this.dailyLimit && this.dailyLimit.explanation
      if (!e || typeof e !== 'object') return typeof e === 'string' ? e : ''
      return this.$t('debt_plan.daily_expl', { days: e.daysUntilIncome || 0, sum: this.sum(e.paymentsUntilIncome || 0) })
    },
    monthTotal() { return this.monthPayments.reduce((s, p) => s + num(p.amount), 0) },
    chartSeries() {
      return [{
        name: this.$t('debt_plan.remaining'),
        color: '#10B981',
        points: this.schedule.map((s) => ({ ym: s.ym, value: num(s.totalRemaining) })),
      }]
    },
    orderCards() {
      const closed = (this.baseScenario && this.baseScenario.closed) || {}
      const order = (this.result && this.result.order) || []
      return order
        .map((o) => {
          const debt = this.debtMap[String(o.debtId)]
          if (!debt) return null
          const progress = debt.hasAmount ? Math.max(0, Math.min(100, Math.round((1 - debt.balance / debt.amount) * 100))) : null
          return { ...o, debt, progress, closedYm: closed[o.debtId] || closed[String(o.debtId)] || null, next: this.nextPayment(o.debtId) }
        })
        .filter(Boolean)
    },
    payCurrency() {
      const d = this.payRow && this.debtMap[String(this.payRow.debtId)]
      return (d && d.currency) || 'UZS'
    },
  },

  watch: {
    '$i18n.locale'() { this.loadDaily() },
  },

  mounted() {
    this.loadAll()
  },

  methods: {
    async loadAll() {
      const data = await this.loadPlan()
      if (!data || this.redirectIfNotSetup()) return
      this.loadDaily()
      this.loadMonth()
    },
    async loadMonth() {
      try {
        const res = await this.$axios.$get('/finance/debt-plan/month', { silent: true, background: true, params: langParams(this, { ym: currentYm() }) })
        const d = unwrap(res)
        this.monthData = d && d.inPlan ? d : null
      } catch (e) {
        this.monthData = null // jadvaldan (result.schedule) ko'rsatiladi
      }
    },
    async loadDaily() {
      this.dailyLimitError = false
      try {
        const res = await this.$axios.$get('/finance/debt-plan/daily-limit', { silent: true, background: true, params: { lang: this.$i18n.locale } })
        const d = unwrap(res)
        this.dailyLimit = d ? { amount: d.amount == null ? null : num(d.amount), until: d.until, explanation: d.explanation } : null
        if (!d) this.dailyLimitError = true
      } catch (e) {
        this.dailyLimitError = true
      }
    },
    nextPayment(debtId) {
      for (const s of this.schedule) {
        const p = (s.payments || []).find((x) => String(x.debtId) === String(debtId) && num(x.amount) > 0 && x.type !== 'saving')
        if (p) return { ym: s.ym, day: p.day, amount: p.amount }
      }
      return null
    },
    detailPath(id) { return this.localePath({ name: 'finance-debt-plan-debts-id', params: { id } }) },
    fmtDay(d) { return fmtDMY(d) },
    isPaid(p) {
      return !!p.isPaid || !!this.paidKeys[p.key]
    },
    openPay(p) {
      const d = this.debtMap[String(p.debtId)]
      let amount = p.amountOrig != null ? num(p.amountOrig) : num(p.amount)
      if (p.amountOrig == null && d && d.currency === 'USD') amount = this.usdRate > 0 ? Math.round((amount / this.usdRate) * 100) / 100 : ''
      if (amount !== '' && p.paidPart) amount = Math.max(0, amount - p.paidPart)
      if (d && amount !== '' && amount > d.balance) amount = d.balance
      this.payAmount = amount === '' ? '' : String(Math.round(amount * 100) / 100)
      this.payRow = p
    },
    async submitPay() {
      const amount = num(this.payAmount)
      if (!(amount > 0)) {
        this.$toast && this.$toast.error(this.$t('debt_plan.err.amount'))
        return
      }
      const row = this.payRow
      this.payBusy = true
      try {
        const res = await this.$api.addDebtPayment(row.debtId, { amount, payment_date: todayIso() })
        if (res && res.data && res.data.success === false) throw new Error(res.data.message || 'fail')
        this.paidKeys = { ...this.paidKeys, [row.key]: true }
        this.payRow = null
        this.$toast && this.$toast.success(this.$t('debt_plan.paid_ok'))
        await this.loadPlan({ background: true })
        this.loadDaily()
        this.loadMonth()
      } catch (e) {
        this.toastError(e, 'debt_plan.err.pay')
      } finally {
        this.payBusy = false
      }
    },
  },
}
</script>

<style scoped>
/* Tailwind v2 (JIT off) — maxsus ranglar/gradientlar shu yerda */
.dp-hero { background: linear-gradient(135deg, #059669 0%, #047857 45%, #0f766e 100%); box-shadow: 0 18px 40px -18px rgba(5, 150, 105, 0.55); }
.dp-hero__glow { position: absolute; width: 360px; height: 360px; right: -90px; top: -160px; border-radius: 9999px; background: rgba(255, 255, 255, 0.09); }
.dp-muted { color: rgba(255, 255, 255, 0.82); }
.dp-chip { display: inline-flex; align-items: center; background: rgba(255, 255, 255, 0.16); border: 1px solid rgba(255, 255, 255, 0.24); border-radius: 10px; padding: 5px 11px; font-size: 13px; }
.dp-hero-stat { background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.18); }

.dp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: 12px; padding: 9px 14px; font-size: 14px; font-weight: 600; transition: background .15s, border-color .15s, transform .15s; white-space: nowrap; }
.dp-btn--ghost { background: #fff; border: 1px solid #e5e7eb; color: #374151; }
.dp-btn--ghost:hover { border-color: #10b981; color: #047857; }
.dp-btn--primary { background: #059669; color: #fff; }
.dp-btn--edit { background: #ecfdf5; border: 1px solid #6ee7b7; color: #047857; }
.dp-btn--edit:hover { background: #d1fae5; border-color: #10b981; }
.dp-btn--primary:hover { background: #047857; }
.dp-btn--pay { background: #ecfdf5; color: #047857; padding: 7px 12px; font-size: 13px; }
.dp-btn--pay:hover { background: #d1fae5; }

.dp-ev-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .02em; color: #6b7280; background: rgba(255,255,255,.7); border-radius: 6px; padding: 1px 6px; }

.dp-day { width: 40px; height: 40px; border-radius: 12px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
.dp-day__num { font-size: 15px; font-weight: 800; color: #334155; }
.dp-type { display: inline-block; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 1px 6px; }
.dp-type--required { background: #eff6ff; color: #1d4ed8; }
.dp-type--extra { background: #ecfdf5; color: #047857; }
.dp-type--saving { background: #fef3c7; color: #92400e; }
.dp-type--overdue { background: #fee2e2; color: #b91c1c; }

.dp-order { position: relative; }
.dp-order:hover { box-shadow: 0 12px 28px -14px rgba(15, 23, 42, 0.25); transform: translateY(-1px); }
.dp-order--target { border-color: #6ee7b7; box-shadow: 0 0 0 1px #6ee7b7; }
.dp-rank { width: 34px; height: 34px; border-radius: 10px; background: #f1f5f9; color: #475569; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.dp-rank--target { background: #059669; color: #fff; }
.dp-target-badge { position: absolute; top: -10px; left: 18px; font-size: 11px; font-weight: 700; background: #059669; color: #fff; border-radius: 9999px; padding: 2px 10px; }
.dp-bar { height: 8px; border-radius: 9999px; background: #f1f5f9; overflow: hidden; }
.dp-bar__fill { height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #34d399, #059669); transition: width .5s ease; }

.dp-pay-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px 12px; font-size: 16px; font-weight: 700; outline: none; }
.dp-pay-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
</style>
