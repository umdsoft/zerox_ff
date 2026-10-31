<template>
  <!-- 22.10 (egasi hujjati "Qarzdan chiqish", Ekranlar 4): qarz tafsiloti — to'lovlar tarixi
       (GET /finance/debts/:id → payments), rejadagi kelgusi to'lovlar (result.schedule),
       reja maydonlarini tahrirlash (PATCH /finance/debts/:id/plan), rejadan chiqarish va qo'lda tartib. -->
  <div class="dpd pb-10">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
      <div class="flex items-center gap-3 min-w-0">
        <PageBackButton :to="localePath({ name: 'finance-debt-plan' })" />
        <div class="min-w-0">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{{ debt ? debt.title : $t('debt_plan.title') }}</h1>
          <p v-if="debt" class="text-sm text-gray-500 mt-0.5">
            {{ debt.kind ? $t('debt_plan.kind.' + debt.kind) : $t('debt_plan.kind_unset') }}
            <span v-if="isClosed" class="ml-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">✓ {{ $t('debt_plan.closed') }}</span>
            <span v-else-if="debt.excluded" class="ml-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">{{ $t('debt_plan.f.excluded_on') }}</span>
          </p>
        </div>
      </div>
      <nuxt-link v-if="debt" :to="localePath({ name: 'finance-debts-id', params: { id: debt.id } })" class="dpd-link">{{ $t('debt_plan.open_in_debts') }} →</nuxt-link>
    </div>

    <div v-if="(planLoading && !planData) || (historyLoading && planData && !debt)" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">{{ $t('common.loading') }}</div>
    <div v-else-if="(planError && !planData) || (planData && !debt)" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-gray-600 mb-4">{{ planData && !debt ? $t('debt_plan.err.debt_not_found') : $t('debt_plan.err.load') }}</p>
      <button type="button" class="dpd-btn" @click="loadAll">{{ $t('debt_plan.retry') }}</button>
    </div>

    <template v-else-if="debt">
      <!-- Raqamlar -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <p class="text-sm text-gray-500">{{ $t('debt_plan.balance') }}</p>
          <p class="text-2xl font-extrabold text-gray-900 mt-1">{{ sum(debt.balance) }} <span class="text-xs font-semibold text-gray-400">{{ debt.currency }}</span></p>
          <div class="dpd-bar mt-3"><div class="dpd-bar__fill" :style="{ width: Math.max(2, progress) + '%' }"></div></div>
          <p class="text-xs text-gray-400 mt-1">{{ $t('debt_plan.paid_pct', { p: progress }) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <p class="text-sm text-gray-500">{{ $t('debt_plan.closes_label') }}</p>
          <p class="text-2xl font-extrabold text-gray-900 mt-1">{{ closedYm ? ymText(closedYm) : '—' }}</p>
          <p v-if="rank" class="text-xs text-gray-400 mt-1">{{ $t('debt_plan.rank', { n: rank }) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <p class="text-sm text-gray-500">{{ $t('debt_plan.eff_rate') }}</p>
          <p class="text-2xl font-extrabold text-gray-900 mt-1">{{ orderItem && orderItem.monthlyRate != null ? pct(orderItem.monthlyRate) + '%' : '—' }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ $t('debt_plan.per_month') }}<span v-if="debt.apr != null"> · {{ $t('debt_plan.apr_short', { apr: debt.apr }) }}</span></p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <p class="text-sm text-gray-500">{{ $t('debt_plan.planned_total') }}</p>
          <p class="text-2xl font-extrabold text-gray-900 mt-1">{{ sum(plannedTotal) }} <span class="text-xs font-semibold text-gray-400">UZS</span></p>
          <p class="text-xs text-gray-400 mt-1">{{ $t('debt_plan.payments_count', { n: upcoming.length }) }}</p>
        </div>
      </div>

      <p v-if="orderItem" class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5 text-sm text-emerald-900 leading-relaxed">{{ reasonText(orderItem) }}</p>

      <div class="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-5">
        <!-- Kelgusi to'lovlar -->
        <section class="xl:col-span-3 bg-white rounded-2xl shadow-sm overflow-hidden">
          <header class="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">{{ $t('debt_plan.upcoming') }}</h2>
            <span class="text-xs text-gray-400">UZS · {{ $t('debt_plan.scenario.base') }}</span>
          </header>
          <div v-if="upcoming.length" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs text-gray-500 bg-gray-50">
                  <th class="px-5 py-2.5 font-semibold">{{ $t('debt_plan.col.month') }}</th>
                  <th class="px-3 py-2.5 font-semibold">{{ $t('debt_plan.col.day') }}</th>
                  <th class="px-3 py-2.5 font-semibold">{{ $t('debt_plan.col.type') }}</th>
                  <th class="px-5 py-2.5 font-semibold text-right">{{ $t('debt_plan.col.amount') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="r in visibleUpcoming" :key="r.key">
                  <td class="px-5 py-2.5 text-gray-900 whitespace-nowrap">{{ ymText(r.ym) }}</td>
                  <td class="px-3 py-2.5 text-gray-600">{{ r.day || '—' }}</td>
                  <td class="px-3 py-2.5"><span class="dpd-type" :class="'dpd-type--' + r.type">{{ $t('debt_plan.pay_type.' + r.type) }}</span></td>
                  <td class="px-5 py-2.5 text-right font-semibold text-gray-900 whitespace-nowrap">{{ sum(r.amount) }}</td>
                </tr>
              </tbody>
            </table>
            <button v-if="upcoming.length > 12" type="button" class="w-full py-3 text-sm font-semibold text-emerald-700 hover:bg-gray-50" @click="showAll = !showAll">
              {{ showAll ? $t('debt_plan.show_less') : $t('debt_plan.show_all', { n: upcoming.length }) }}
            </button>
          </div>
          <p v-else class="text-center text-gray-400 py-10 text-sm">{{ debt.excluded ? $t('debt_plan.excluded_no_schedule') : $t('debt_plan.no_schedule') }}</p>
        </section>

        <!-- Reja maydonlari -->
        <section class="xl:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <h2 class="text-lg font-bold text-gray-900 mb-4">{{ $t('debt_plan.plan_fields') }}</h2>
          <DebtPlanFields v-if="form" v-model="form" plan-controls />
          <div class="flex justify-end gap-2 mt-5">
            <button v-if="formDirty" type="button" class="dpd-btn dpd-btn--ghost" :disabled="saving" @click="resetForm">{{ $t('common.cancel') }}</button>
            <button type="button" class="dpd-btn" :disabled="saving || !formDirty" @click="saveForm">{{ saving ? $t('common.loading') : $t('common.save') }}</button>
          </div>
        </section>
      </div>

      <!-- To'lovlar tarixi -->
      <section class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <header class="px-5 pt-5 pb-3"><h2 class="text-lg font-bold text-gray-900">{{ $t('debt_plan.history') }}</h2></header>
        <p v-if="historyLoading" class="text-center text-gray-400 py-8 text-sm">{{ $t('common.loading') }}</p>
        <p v-else-if="historyError" class="text-center text-gray-400 py-8 text-sm">{{ $t('debt_plan.err.history') }}</p>
        <ul v-else-if="history.length" class="divide-y divide-gray-100">
          <li v-for="p in history" :key="'h' + p.id" class="px-5 py-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-semibold text-gray-900">{{ fmtDate(p.payment_date || p.created_at) }}</p>
              <p v-if="p.notes" class="text-xs text-gray-400 truncate">{{ p.notes }}</p>
            </div>
            <span class="font-bold text-emerald-700 whitespace-nowrap">− {{ sum(p.amount) }} {{ debt.currency }}</span>
          </li>
        </ul>
        <p v-else class="text-center text-gray-400 py-8 text-sm">{{ $t('debt_plan.no_history') }}</p>
      </section>
    </template>
  </div>
</template>

<script>
import PageBackButton from '@/components/ui/PageBackButton.vue'
import DebtPlanFields from '@/components/finance/debtPlan/DebtPlanFields.vue'
import debtPlanMixin from '@/mixins/debtPlanMixin'
import { debtPlanPayload, normDebt, num, debtFieldErrors, langParams } from '@/utils/debtPlan'
import { fmtDMY } from '@/utils/helpers'
import { patchDebtsPlan } from '@/api/debtPlan';

const MARKER_RE = /^__(increase|forgive)__/

export default {
  name: 'DebtPlanDebtDetail',
  components: { PageBackButton, DebtPlanFields },
  mixins: [debtPlanMixin],
  middleware: 'auth',

  data() {
    return {
      form: null,
      saving: false,
      showAll: false,
      history: [],
      rawDebt: null,
      historyLoading: true,
      historyError: false,
    }
  },

  head() {
    return { title: (this.debt && this.debt.title) || this.$t('debt_plan.title') }
  },

  computed: {
    debtId() { return String(this.$route.params.id) },
    // Yopilgan qarz rejada (debts[]) bo'lmaydi — u holda GET /finance/debts/:id dagi ma'lumot
    debt() {
      if (this.debtMap[this.debtId]) return this.debtMap[this.debtId]
      return this.rawDebt && this.rawDebt.type === 'borrowed' ? normDebt(this.rawDebt) : null
    },
    isClosed() { return !!this.debt && (this.debt.status === 'completed' || this.debt.balance <= 0) },
    // Boshlang'ich summa faqat GET /finance/debts/:id da bor (reja javobida yo'q)
    progress() {
      const total = num(this.rawDebt && this.rawDebt.amount)
      if (!this.debt || !(total > 0)) return 0
      return Math.max(0, Math.min(100, Math.round((1 - this.debt.balance / total) * 100)))
    },
    order() { return (this.result && this.result.order) || [] },
    orderItem() { return this.order.find((o) => String(o.debtId) === this.debtId) || null },
    rank() {
      const i = this.order.findIndex((o) => String(o.debtId) === this.debtId)
      return i >= 0 ? i + 1 : null
    },
    closedYm() {
      const c = (this.baseScenario && this.baseScenario.closed) || {}
      return c[this.debtId] || null
    },
    upcoming() {
      const out = []
      this.schedule.forEach((s) => {
        ;(s.payments || []).forEach((p, i) => {
          if (String(p.debtId) === this.debtId && num(p.amount) > 0) out.push({ ...p, ym: s.ym, key: `${s.ym}-${p.type}-${i}` })
        })
      })
      return out
    },
    visibleUpcoming() { return this.showAll ? this.upcoming : this.upcoming.slice(0, 12) },
    plannedTotal() { return this.upcoming.reduce((s, r) => s + num(r.amount), 0) },
    formDirty() {
      if (!this.form || !this.debt) return false
      return JSON.stringify(debtPlanPayload(this.form)) !== JSON.stringify(debtPlanPayload(this.debt))
    },
  },

  watch: {
    debt: {
      handler(d) { if (d && !this.formDirty) this.form = { ...d } },
      immediate: true,
    },
  },

  mounted() {
    this.loadAll()
  },

  methods: {
    loadAll() {
      this.loadPlan()
      this.loadHistory()
    },
    async loadHistory() {
      this.historyLoading = true
      this.historyError = false
      try {
        const res = await this.$api.getDebtById(this.debtId)
        const d = res && res.data && res.data.data
        this.rawDebt = d || null
        const pays = ((d && d.payments) || []).filter((p) => !MARKER_RE.test(String(p.notes || '')))
        this.history = pays.slice().sort((a, b) => new Date(b.payment_date || b.created_at) - new Date(a.payment_date || a.created_at))
      } catch (e) {
        this.historyError = true
      } finally {
        this.historyLoading = false
      }
    },
    resetForm() { this.form = { ...this.debt } },
    async saveForm() {
      if (!this.form.kind && !this.form.excluded) {
        this.$toast && this.$toast.error(this.$t('debt_plan.f.kind_required'))
        return
      }
      // 23.10 (egasi hujjati 22.10, 13-rasm): chegaradan tashqari qiymat serverga yuborilmaydi
      const errs = Object.values(debtFieldErrors(this.form))
      if (errs.length) {
        this.$toast && this.$toast.error(this.$t(errs[0]))
        return
      }
      this.saving = true
      try {
        await patchDebtsPlan(this.$axios, this.debtId, debtPlanPayload(this.form), { silent: true, params: langParams(this) })
        this.$toast && this.$toast.success(this.$t('debt_plan.saved'))
        await this.loadPlan({ background: true })
        this.form = this.debt ? { ...this.debt } : this.form
      } catch (e) {
        this.toastError(e, 'debt_plan.err.save')
      } finally {
        this.saving = false
      }
    },
    fmtDate(d) { return fmtDMY(d) },
  },
}
</script>

<style scoped>
.dpd-link { font-size: 14px; font-weight: 600; color: #047857; }
.dpd-link:hover { color: #065f46; }
.dpd-btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; padding: 10px 18px; font-size: 14px; font-weight: 700; background: #059669; color: #fff; transition: background .15s; }
.dpd-btn:hover:not(:disabled) { background: #047857; }
.dpd-btn:disabled { opacity: .55; cursor: not-allowed; }
.dpd-btn--ghost { background: #fff; color: #374151; border: 1px solid #e5e7eb; }
.dpd-btn--ghost:hover:not(:disabled) { background: #f9fafb; }
.dpd-bar { height: 8px; border-radius: 9999px; background: #f1f5f9; overflow: hidden; }
.dpd-bar__fill { height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #34d399, #059669); }
.dpd-type { display: inline-block; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 2px 7px; }
.dpd-type--required { background: #eff6ff; color: #1d4ed8; }
.dpd-type--extra { background: #ecfdf5; color: #047857; }
.dpd-type--saving { background: #fef3c7; color: #92400e; }
.dpd-type--overdue { background: #fee2e2; color: #b91c1c; }
</style>
