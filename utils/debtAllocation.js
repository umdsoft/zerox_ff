/**
 * ZeroX — bir nechta shaxsiy qarzga BITTA summani taqsimlash (01.10, doc3 5/6-rasm; 31.10 iqtisodiy tartib).
 *
 * Backend (`services/personalDebtAllocation.service.js` + `personalDebtAllocationOrder.js`) bilan AYNAN bir xil
 * qoida ('economic_v1') — oynadagi oldindan ko'rish (preview) va backend hali yangilanmagan bo'lsa (404)
 * ketma-ket zaxira yo'li uchun:
 *  1) muddati O'TGAN (status 'overdue' yoki due_date < bugun), eng eskisi birinchi   → reason 'overdue'
 *  2) muddati yaqin (30 kun ichida), eng yaqini birinchi                             → 'due_now'
 *  3) qolgani: samarali oylik narx r_eff kamayish tartibida, teng bo'lsa kichik qoldiq → 'highest_rate';
 *     foizsizlar (0% muddatli/sanali ham) oxirida, muddati yaqini birinchi            → 'zero_rate'
 *  r_eff = (1+r)(1+δ)/(1+f)^(1/h) − 1 (dvigatel debtPlan/rates formulasi).
 *  - summa jami qoldiqdan oshmaydi; null — hammasi to'liq yopiladi;
 *  - hisob tiyinlarda (kasr xatoliklari yo'q). Valyuta tekshiruvi chaqiruvchida (bitta valyuta).
 *
 * @module utils/debtAllocation
 */

export const ORDER_RULE = 'economic_v1'
const DUE_SOON_DAYS = 30
const DEFAULT_DEVALUATION_PCT = 8
const TASHKENT_OFFSET_MS = 5 * 3600 * 1000
const DAY_MS = 86400000
const RATE_EPS = 1e-9

const toCents = (v) => Math.round((Number(v) || 0) * 100)
const fromCents = (c) => Math.round(c) / 100

function dateRank(v) {
  if (v == null || v === '') return Number.POSITIVE_INFINITY
  const t = new Date(v).getTime()
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY
}

/** Eski tartib (muddati yaqin → uzoq). Endi taqsimotda ishlatilmaydi; boshqa joylar uchun saqlangan. */
export function compareByDue(a, b) {
  const byDue = dateRank(a.due_date) - dateRank(b.due_date)
  if (byDue) return byDue
  const byStart = dateRank(a.start_date || a.created_at) - dateRank(b.start_date || b.created_at)
  if (byStart) return byStart
  return (Number(a.id) || 0) - (Number(b.id) || 0)
}

/** DB Date / ISO(Z) → Toshkent sanasi; 'YYYY-MM-DD[ HH:mm:ss]' → o'sha sana. */
export function ymdOf(v) {
  if (v == null || v === '') return null
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) && !/(Z|[+-]\d{2}:?\d{2})$/.test(v.trim())) return v.slice(0, 10)
  const t = new Date(v).getTime()
  return Number.isFinite(t) ? new Date(t + TASHKENT_OFFSET_MS).toISOString().slice(0, 10) : null
}

const dayNum = (ymd) => Math.floor(Date.parse(`${ymd}T00:00:00Z`) / DAY_MS)
export const todayTashkent = (nowMs = Date.now()) => new Date(nowMs + TASHKENT_OFFSET_MS).toISOString().slice(0, 10)

/** debtPlan/rates.js bilan bir xil formulalar. */
function prepayHorizon(termMonths, mode) {
  const n = Math.max(Number(termMonths) || 12, 1)
  return mode === 'lower_payment' ? (n + 1) / 2 : n
}

export function effectiveMonthlyRate(d, devaluationPct = DEFAULT_DEVALUATION_PCT) {
  const apr = Number(d.interest_rate) || 0
  const usd = String(d.currency || 'UZS').toUpperCase() === 'USD'
  const delta = usd ? Math.pow(1 + (Number(devaluationPct) || 0) / 100, 1 / 12) - 1 : 0
  const fee = (Number(d.prepay_fee_pct) || 0) / 100
  const term = Number(d.term_months) > 0 ? Number(d.term_months) : 12
  const h = Math.max(prepayHorizon(term, d.prepay_mode), 1)
  return ((1 + apr / 1200) * (1 + delta)) / Math.pow(1 + fee, 1 / h) - 1
}

const TIER_RANK = { overdue: 0, due_now: 1, rest: 2 }
const REASON_OF = { overdue: 'overdue', due_now: 'due_now' }
const idOf = (d) => Number(d.id) || 0
const dayOrInf = (ymd) => (ymd ? dayNum(ymd) : Number.POSITIVE_INFINITY)

/** Qarz qismlari (sentda). tranche — serverdan (GET /finance/debts/allocation-params); yo'q bo'lsa faqat sanaga ko'ra. */
function splitDebt(d, todayDay, tranche) {
  const due = ymdOf(d.due_date)
  const dueDay = due ? dayNum(due) : null
  const remC = Math.max(0, toCents(d.remaining_amount))
  let ovdC
  let dueC
  let since = due
  let dueOn = due
  if (tranche) {
    ovdC = Math.min(remC, Math.max(0, toCents(tranche.overdue)))
    dueC = Math.min(remC - ovdC, Math.max(0, toCents(tranche.due_now)))
    since = tranche.overdue_since || due
    dueOn = tranche.due_on || due
  } else {
    const isOverdue = d.status === 'overdue' || (dueDay !== null && dueDay < todayDay)
    const isSoon = !isOverdue && dueDay !== null && dueDay - todayDay <= DUE_SOON_DAYS
    ovdC = isOverdue ? remC : 0
    dueC = isSoon ? remC : 0
  }
  return { remC, ovdC, dueC, restC: remC - ovdC - dueC, since, dueOn }
}

function entriesOf(d, todayDay, devaluationPct, tranche) {
  const rate = effectiveMonthlyRate(d, devaluationPct)
  const zero = rate <= RATE_EPS || ((Number(d.interest_rate) || 0) === 0 && (d.debt_kind === 'installment' || d.debt_kind === 'dated'))
  const sp = splitDebt(d, todayDay, tranche)
  const base = { d, rate, zero, remC: sp.remC, dueDay: dayOrInf(ymdOf(d.due_date)) }
  const out = []
  if (sp.ovdC > 0) out.push({ ...base, tier: 'overdue', capC: sp.ovdC, key: dayOrInf(sp.since) })
  if (sp.dueC > 0) out.push({ ...base, tier: 'due_now', capC: sp.dueC, key: dayOrInf(sp.dueOn) })
  if (sp.restC > 0 || out.length === 0) out.push({ ...base, tier: 'rest', capC: sp.restC, key: base.dueDay })
  return out
}

function compareEntries(a, b) {
  if (a.tier !== b.tier) return TIER_RANK[a.tier] - TIER_RANK[b.tier]
  const byKeyThenRem = () => (a.key - b.key) || (a.remC - b.remC) || (idOf(a.d) - idOf(b.d))
  if (a.tier !== 'rest') return byKeyThenRem()
  if (a.zero !== b.zero) return a.zero ? 1 : -1
  if (a.zero) return byKeyThenRem()
  if (Math.abs(a.rate - b.rate) > RATE_EPS) return b.rate - a.rate
  return (a.remC - b.remC) || (a.key - b.key) || (idOf(a.d) - idOf(b.d))
}

/**
 * opts: { today?, devaluationPct?, tranches?: { [id]: { overdue, due_now, overdue_since, due_on } } }
 * @returns {Array<{ debt:Object, tier:string, capC:number, reason:string }>}
 */
export function economicEntries(debts, opts = {}) {
  const todayDay = dayNum(opts.today || todayTashkent())
  const dev = opts.devaluationPct == null ? DEFAULT_DEVALUATION_PCT : opts.devaluationPct
  const tranches = opts.tranches || {}
  const all = []
  for (const d of debts || []) all.push(...entriesOf(d, todayDay, dev, tranches[d.id] || tranches[String(d.id)] || null))
  return all.sort(compareEntries).map((e) => ({
    debt: e.d, tier: e.tier, capC: e.capC, reason: REASON_OF[e.tier] || (e.zero ? 'zero_rate' : 'highest_rate'),
  }))
}

/** @returns {Array<{ debt:Object, reason:string }>} iqtisodiy tartibdagi qarzlar (birinchi qatnashgan qismi bo'yicha). */
export function economicOrder(debts, opts = {}) {
  const seen = new Set()
  const out = []
  for (const e of economicEntries(debts, opts)) {
    if (seen.has(e.debt)) continue
    seen.add(e.debt)
    out.push({ debt: e.debt, reason: e.reason })
  }
  return out
}

/**
 * @param {Array<Object>} debts  { id, remaining_amount, due_date?, status?, currency?, interest_rate?, ... }
 * @param {number|null} amount   null — hammasi yopiladi
 * @param {Object} [opts]        { today?, devaluationPct?, tranches? } — serverdan olingan params
 * @returns {{ total:number, paid:number, over:boolean, order_rule:string,
 *   allocations: Array<{ debt:Object, pay:number, remainingAfter:number, closes:boolean, reason:string }> }}
 *   `over` — summa jami qoldiqdan oshgan (allocations bo'sh qaytadi).
 */
export function allocatePayment(debts, amount, opts = {}) {
  const entries = economicEntries(debts, opts)
  const order = economicOrder(debts, opts)
  const totalC = (debts || []).reduce((s, d) => s + Math.max(0, toCents(d.remaining_amount)), 0)
  const full = amount == null || amount === ''
  const wantC = full ? totalC : Math.max(0, toCents(amount))
  if (wantC > totalC) return { total: fromCents(totalC), paid: fromCents(wantC), over: true, order_rule: ORDER_RULE, allocations: [] }
  let leftC = wantC
  const paidC = new Map()
  for (const e of entries) {
    const payC = Math.min(e.capC, leftC)
    leftC -= payC
    paidC.set(e.debt, (paidC.get(e.debt) || 0) + payC)
  }
  const allocations = order.map(({ debt: d, reason }) => {
    const remC = Math.max(0, toCents(d.remaining_amount))
    const payC = paidC.get(d) || 0
    return { debt: d, pay: fromCents(payC), remainingAfter: fromCents(remC - payC), closes: payC > 0 && remC - payC <= 0, reason }
  })
  return { total: fromCents(totalC), paid: fromCents(wantC), over: false, order_rule: ORDER_RULE, allocations }
}
