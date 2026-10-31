/**
 * Sayt `utils/debtAllocation.js` ('economic_v1') parity tekshiruvi — backend bilan umumiy fixture.
 * Ishga tushirish:  node scripts/checkDebtAllocation.js   (yoki: npm run check:allocation)
 * Nomuvofiqlik bo'lsa chiqish kodi 1. Fixture backend/tests/unit/fixtures/debt_allocation_economic.json
 * nusxasi (scripts/fixtures/) — o'zgarsa uchala joyni (backend, sayt, mobil) yangilang.
 */
const fs = require('fs')
const path = require('path')

const src = fs.readFileSync(path.join(__dirname, '../utils/debtAllocation.js'), 'utf8').replace(/export (function|const) /g, '$1 ')
// eslint-disable-next-line no-new-func
const { allocatePayment } = new Function(`${src}; return { allocatePayment };`)()
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/debt_allocation_economic.json'), 'utf8'))

let failed = 0
for (const c of fixture.cases) {
  const r = allocatePayment(c.debts, c.amount, { today: fixture.today, ...(c.opts || {}) })
  const got = {
    order: r.allocations.map((a) => a.debt.id),
    reasons: r.allocations.map((a) => a.reason),
    pays: r.allocations.map((a) => a.pay),
    paid: r.paid,
    total: r.total,
  }
  const ok = JSON.stringify(got) === JSON.stringify(c.expected) && r.order_rule === 'economic_v1'
  if (!ok) {
    failed += 1
    console.error(`FAIL: ${c.name}\n  expected ${JSON.stringify(c.expected)}\n  got      ${JSON.stringify(got)}`)
  }
}
console.log(`debtAllocation parity: ${fixture.cases.length - failed}/${fixture.cases.length} OK`)
process.exit(failed ? 1 : 0)
