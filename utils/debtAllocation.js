/**
 * ZeroX — bir nechta shaxsiy qarzga BITTA summani taqsimlash (01.10, doc3 5/6-rasm).
 *
 * Backend (`services/personalDebtAllocation.service.js`) bilan AYNAN bir xil qoida — oynadagi oldindan
 * ko'rish (preview) va backend hali yangilanmagan bo'lsa (404) ketma-ket zaxira yo'li uchun:
 *  - tartib: muddati yaqin → uzoq (muddatsizlar oxirida), so'ng qarz sanasi, so'ng id;
 *  - summa jami qoldiqdan oshmaydi; null — hammasi to'liq yopiladi;
 *  - hisob tiyinlarda (kasr xatoliklari yo'q). Valyuta tekshiruvi chaqiruvchida (bitta valyuta).
 *
 * @module utils/debtAllocation
 */

const toCents = (v) => Math.round((Number(v) || 0) * 100)
const fromCents = (c) => Math.round(c) / 100

function dateRank(v) {
  if (v == null || v === '') return Number.POSITIVE_INFINITY
  const t = new Date(v).getTime()
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY
}

/** Muddati yaqin → uzoq; muddatsizlar oxirida; teng bo'lsa eski qarz va kichik id oldin. */
export function compareByDue(a, b) {
  const byDue = dateRank(a.due_date) - dateRank(b.due_date)
  if (byDue) return byDue
  const byStart = dateRank(a.start_date || a.created_at) - dateRank(b.start_date || b.created_at)
  if (byStart) return byStart
  return (Number(a.id) || 0) - (Number(b.id) || 0)
}

/**
 * @param {Array<Object>} debts  { id, remaining_amount, due_date?, start_date? }
 * @param {number|null} amount   null — hammasi yopiladi
 * @returns {{ total:number, paid:number, over:boolean,
 *   allocations: Array<{ debt:Object, pay:number, remainingAfter:number, closes:boolean }> }}
 *   `over` — summa jami qoldiqdan oshgan (allocations bo'sh qaytadi).
 */
export function allocatePayment(debts, amount) {
  const sorted = [...(debts || [])].sort(compareByDue)
  const totalC = sorted.reduce((s, d) => s + Math.max(0, toCents(d.remaining_amount)), 0)
  const full = amount == null || amount === ''
  const wantC = full ? totalC : Math.max(0, toCents(amount))
  if (wantC > totalC) return { total: fromCents(totalC), paid: fromCents(wantC), over: true, allocations: [] }
  let leftC = wantC
  const allocations = sorted.map((d) => {
    const remC = Math.max(0, toCents(d.remaining_amount))
    const payC = Math.min(remC, leftC)
    leftC -= payC
    return { debt: d, pay: fromCents(payC), remainingAfter: fromCents(remC - payC), closes: payC > 0 && remC - payC <= 0 }
  })
  return { total: fromCents(totalC), paid: fromCents(wantC), over: false, allocations }
}
