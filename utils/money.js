/**
 * wave B: backend `utils/money.js` (round2/toCents) bilan AYNAN bir xil yaxlitlash — server bilan solishtiriladigan
 * summalar uchun (Number.EPSILON: 1.005 -> 1.01; NaN/±Infinity -> 0). `debtAllocation.js` shu qoidani o'zida takrorlaydi
 * (import'siz yuklanishi kerak).
 */
export function round2(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function toCents(v) {
  return Math.round(round2(v) * 100)
}
