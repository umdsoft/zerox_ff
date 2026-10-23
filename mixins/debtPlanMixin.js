/**
 * 22.10 "Qarzdan chiqish": sahifalar uchun umumiy holat — GET /finance/debt-plan yuklash,
 * normalizatsiya va matn yordamchilari (sabab matni, oy nomi, pul).
 * Javob shartnomasi: DESIGN §3 → { plan, debts, incomes, result, setupDone }.
 */
import {
  normDebt, normSettings, unwrap, ymLabel, ymAdd, fmtSum, fmtMln, fmtPct,
  annualFromMonthly, apiErrorText, currentYm, num, langParams,
} from '@/utils/debtPlan'

export default {
  data() {
    return {
      planLoading: true,
      planError: false,
      planData: null,
    }
  },

  computed: {
    result() { return (this.planData && this.planData.result) || null },
    setupDone() {
      const d = this.planData || {}
      const p = d.plan || {}
      return !!(d.setupDone || d.setup_done || p.setupDone || p.setup_done)
    },
    settings() { return normSettings(this.planData && this.planData.plan) },
    planDebts() { return ((this.planData && this.planData.debts) || []).map(normDebt).filter(Boolean) },
    debtMap() {
      const m = {}
      this.planDebts.forEach((d) => { m[String(d.id)] = d })
      return m
    },
    schedule() { return (this.result && this.result.schedule) || [] },
    baseScenario() { return (this.result && this.result.scenarios && this.result.scenarios.base) || null },
    startYm() { return (this.schedule[0] && this.schedule[0].ym) || currentYm() },
    /** USD → UZS kursi: javobda bo'lsa o'shandan, aks holda qarzning UZS qoldig'idan */
    usdRate() {
      const d = this.planData || {}
      const fx = d.fx || (d.result && d.result.fx) || (d.plan && d.plan.fx) || {}
      const direct = num(fx.USD || d.usdRate || d.usd_rate)
      if (direct > 0) return direct
      const usd = this.planDebts.find((x) => x.currency === 'USD' && x.balanceUzs && x.balance)
      return usd ? usd.balanceUzs / usd.balance : 0
    },
  },

  methods: {
    async loadPlan(opts = {}) {
      this.planLoading = !opts.background || !this.planData
      this.planError = false
      try {
        const res = await this.$axios.$get('/finance/debt-plan', { silent: true, background: !!opts.background, params: langParams(this) })
        const data = unwrap(res)
        if (!data) throw new Error('empty')
        this.planData = data
        return data
      } catch (e) {
        this.planError = true
        return null
      } finally {
        this.planLoading = false
      }
    },

    /** Sozlash tugamagan bo'lsa — sozlash sahifasiga (true qaytaradi) */
    redirectIfNotSetup() {
      if (this.planData && !this.setupDone) {
        this.$router.replace(this.localePath({ name: 'finance-debt-plan-setup' }))
        return true
      }
      return false
    },

    ymText(ym) { return ymLabel(ym, this.$t.bind(this), this.$i18n.locale) },
    /** Monte-Karlo oy soni → sana (base bilan bir xil sanoq: finishYm ↔ months) */
    ymFromMonths(months) {
      const b = this.baseScenario
      if (b && b.finishYm && b.months != null) return ymAdd(b.finishYm, Number(months) - Number(b.months))
      return ymAdd(this.startYm, Number(months) - 1)
    },
    sum(v) { return fmtSum(v) },
    mln(v) { return fmtMln(v, this.$i18n.locale) },
    pct(v, d = 2) { return fmtPct(v, d, this.$i18n.locale) },
    debtTitle(id) {
      const d = this.debtMap[String(id)]
      if (d) return d.title
      if (id == null) return ''
      // Dvigatelning yetishmovchilik sababli "yangi qarz"i: 'new_debt_N'
      return String(id).startsWith('new_debt') ? this.$t('debt_plan.new_debt') : '—'
    },

    /**
     * order[].reasonKey → tushuntirish (DESIGN: "avval Mikroqarz: yillik 45%, eng qimmati shu").
     * Kalitlar (services/finance/debtPlan/order.js): highest_rate, rate, usd_devaluation,
     * zero_rate_smaller_balance, smallest_balance, manual_priority, dated_sinking, dated_overdue,
     * installment_no_extra, excluded. reasonParams: aprPct, balance, currency, devaluationPct,
     * prepayFeePct, priority, dueYm, monthsToDue, monthlyPayment.
     */
    reasonText(o) {
      if (!o) return ''
      const rp = o.reasonParams || {}
      const dec = (v) => (this.$i18n.locale === 'en' ? String(v) : String(v).replace('.', ','))
      const params = { ...rp }
      if (o.monthlyRate != null) {
        params.rate = this.pct(o.monthlyRate)
        params.annual = this.pct(annualFromMonthly(o.monthlyRate), 1)
      }
      if (rp.aprPct != null) params.apr = dec(rp.aprPct)
      if (rp.devaluationPct != null) params.devaluation = dec(rp.devaluationPct)
      if (rp.prepayFeePct != null) params.fee = dec(rp.prepayFeePct)
      if (rp.balance != null) params.balance = fmtSum(rp.balance) + ' ' + (rp.currency || 'UZS')
      if (rp.monthlyPayment != null) params.payment = fmtSum(rp.monthlyPayment)
      if (rp.dueYm) params.month = this.ymText(rp.dueYm)
      if (rp.monthsToDue != null) params.n = rp.monthsToDue
      params.title = this.debtTitle(o.debtId)
      const key = 'debt_plan.reason.' + o.reasonKey
      if (o.reasonKey && this.$te && this.$te(key)) return this.$t(key, params)
      return this.$t(o.monthlyRate != null ? 'debt_plan.reason.generic' : 'debt_plan.reason.generic_norate', params)
    },

    /** scenarios.*.events[] → matn */
    eventText(ev) {
      const p = { debt: this.debtTitle(ev.debtId), sum: fmtSum(ev.amount) + ' UZS', month: this.ymText(ev.ym) }
      const type = ev.type === 'shortfall' && ev.debtId == null ? 'shortfall_general' : ev.type
      const key = 'debt_plan.event.' + type
      return this.$te && this.$te(key) ? this.$t(key, p) : this.$t('debt_plan.event.shortfall', p)
    },

    toastError(err, fallbackKey = 'debt_plan.err.generic') {
      this.$toast && this.$toast.error(apiErrorText(err, this.$t(fallbackKey)))
    },
  },
}
