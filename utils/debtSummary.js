/**
 * ZeroX — Shaxsiy qarzlar bo'yicha SVOD (jami / qaytarilgan / jarayonda / voz kechilgan).
 *
 * 30.09 (doc1 11- va 15-rasm): "Berilgan qarz" ro'yxat sahifasi tepasida SVOD, Shaxsiy qarz bosh
 * sahifasida yakunlangan qarzlar bloki va hisobot sahifasi — BIR XIL hisob-kitob (DRY). Ilgari
 * shunga o'xshash mantiq faqat kontragent sahifasida (`group/_key.vue` → `sideTotals`) bor edi.
 *
 * Qoidalar:
 *  - `payments` ichidagi `__increase__` (qo'shimcha qarz) va `__forgive__` (voz kechish) yozuvlari
 *    TO'LOV EMAS — "qaytarilgan"ga qo'shilmaydi.
 *  - Jami = qarzning joriy `amount`i (qo'shimcha qarzlar bilan).
 *  - Jarayonda = ochiq (active | overdue) qarzlarning qoldig'i.
 *  - Voz kechilgan = tugallangan qarzdagi to'lanmagan qism (jami − qaytarilgan − qoldiq, manfiy emas).
 *  - Valyutalar ALOHIDA (UZS, USD...) — hech qachon qo'shib yuborilmaydi.
 *
 * @module utils/debtSummary
 */

const MARKER_RE = /^__(increase|forgive)__/
const FORGIVE_RE = /^__forgive__/

/** 'active' yoki 'overdue' — ochiq qarz */
export function isOpenDebt(d) {
  return !!d && (d.status === 'active' || d.status === 'overdue')
}

/** Voz kechilgan (tugallangan) qarz — `__forgive__` marker yoki eski izoh ("Kechirilgan"). */
export function isForgivenDebt(d) {
  if (!d || d.status !== 'completed') return false
  const pays = Array.isArray(d.payments) ? d.payments : []
  if (pays.some((p) => FORGIVE_RE.test(String((p && p.notes) || '')))) return true
  return /Kechirilgan|voz kechildi/i.test(String(d.notes || ''))
}

/**
 * Qarz bo'yicha HAQIQIY to'lovlar yig'indisi (markerlarsiz).
 * 02.10 (sayt hujjati, 2-rasm): "Qaytarilgan" qarz summasidan OSHMAYDI. 24.09 gacha backend qoldiqdan katta
 * to'lovni qabul qilib, to'lov qatoriga to'liq summani yozardi (qarz 500 000 — to'lovlar 640 000). Endi barcha
 * kirish nuqtalari buni rad etadi; eski yozuvlar o'zgartirilmaydi, ko'rsatishda qarz summasi bilan cheklanadi.
 */
export function paidOfDebt(d) {
  if (!d) return 0
  if (Array.isArray(d.payments)) {
    const sum = d.payments
      .filter((p) => !MARKER_RE.test(String((p && p.notes) || '')))
      .reduce((s, p) => s + (Number(p && p.amount) || 0), 0)
    const total = Number(d.amount) || 0
    return total > 0 ? Math.min(sum, total) : sum
  }
  if (d.paid_amount != null) return Number(d.paid_amount) || 0
  if (isForgivenDebt(d)) return 0
  return Math.max(0, (Number(d.amount) || 0) - (Number(d.remaining_amount) || 0))
}

const CUR_RANK = { UZS: 0, USD: 1 }
function rank(c) { return CUR_RANK[c] != null ? CUR_RANK[c] : 2 }

/**
 * Qarzlar ro'yxati bo'yicha valyuta kesimidagi svod.
 * @param {Array<Object>} debts
 * @returns {{ rows: Array<{currency:string,total:number,paid:number,left:number,forgiven:number}>,
 *             count:number, openCount:number, closedCount:number, forgivenCount:number }}
 *          `rows` bo'sh bo'lsa ham kamida bitta UZS qatori qaytadi (UI "0 UZS" ko'rsatadi).
 */
export function summarizeDebts(debts) {
  const map = {}
  let openCount = 0
  let closedCount = 0
  let forgivenCount = 0 // 01.10 (doc3 3-rasm): yakunlangan qarzlar hisobotida "Voz kechilgan" kartasi
  for (const d of debts || []) {
    if (!d) continue
    const cur = d.currency || 'UZS'
    if (!map[cur]) map[cur] = { currency: cur, total: 0, paid: 0, left: 0, forgiven: 0 }
    const row = map[cur]
    const total = Number(d.amount) || 0
    const paid = paidOfDebt(d)
    const open = isOpenDebt(d)
    const left = open ? (Number(d.remaining_amount) || 0) : 0
    row.total += total
    row.paid += paid
    row.left += left
    if (!open) row.forgiven += Math.max(0, total - paid - left)
    if (open) openCount += 1
    else if (d.status === 'completed') closedCount += 1
    if (isForgivenDebt(d)) forgivenCount += 1
  }
  const rows = Object.values(map).sort((a, b) => rank(a.currency) - rank(b.currency))
  return {
    rows: rows.length ? rows : [{ currency: 'UZS', total: 0, paid: 0, left: 0, forgiven: 0 }],
    count: (debts || []).filter(Boolean).length,
    openCount,
    closedCount,
    forgivenCount,
  }
}

const PAGE_LIMIT = 100 // backend maksimumi (VULN-L8)
const MAX_PAGES = 10

/**
 * Shaxsiy qarzlarni sahifalab TO'LIQ yuklash (o'z qarzlarim + ko'zgu/do'kon qarzlari).
 * Backend bir so'rovda ko'pi bilan 100 ta o'z qarzini qaytaradi — hisobot/svod eski qarzlarni
 * yo'qotmasligi uchun sahifalar ketma-ket olinadi (ko'pi bilan MAX_PAGES). Ko'zgu qarzlar
 * sahifalanmaydi — birinchi javobdan olinadi va id bo'yicha takrorlanmaydi.
 *
 * @param {{ getPersonalDebts: Function }} api  `this.$api`
 * @param {Object} params  { type?, status? }
 * @returns {Promise<Array<Object>>} created_at bo'yicha kamayish tartibida
 */
export async function fetchAllPersonalDebts(api, params = {}) {
  const own = []
  let mirrors = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const res = await api.getPersonalDebts({ ...params, limit: PAGE_LIMIT, page })
    const body = res && res.data
    if (!body || !body.success) break
    const rows = body.data || []
    own.push(...rows)
    if (page === 1) mirrors = body.mirror_debts || []
    if (rows.length < PAGE_LIMIT) break
  }
  const seen = new Set()
  const list = []
  for (const d of [...own, ...mirrors]) {
    const key = (d.is_shop_debt ? 's' : (d.is_mirror ? 'm' : 'o')) + '-' + d.id
    if (seen.has(key)) continue
    seen.add(key)
    list.push(d)
  }
  return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
}
