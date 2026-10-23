/**
 * 22.10 (egasi hujjati "Qarzdan chiqish"): sayt sahifalari uchun umumiy yordamchilar.
 * Hisob-kitob BACKENDDA (services/finance/debtPlan) — bu yerda faqat normalizatsiya va formatlash.
 *
 * Backend javoblari snake_case (DB qatorlari) yoki camelCase (dvigatel) bo'lishi mumkin —
 * normalizatorlar ikkalasini ham o'qiydi, sahifalar faqat camelCase bilan ishlaydi.
 */

export const DEBT_KINDS = ['annuity', 'differentiated', 'card', 'installment', 'dated', 'open']
export const RELIABILITY_OPTIONS = [1, 0.8, 0.5]
export const STRATEGIES = ['optimal', 'snowball', 'manual']
export const SCENARIOS = ['conservative', 'base', 'optimistic']
export const ALL_MONTHS_MASK = 4095

const MONTH_KEYS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

function pick(obj, ...keys) {
  if (!obj) return undefined
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k]
  }
  return undefined
}

export function num(v, fallback = 0) {
  if (v === null || v === undefined || v === '') return fallback
  const n = Number(String(v).replace(/\s/g, '').replace(',', '.'))
  return isFinite(n) ? n : fallback
}

function numOrNull(v) {
  if (v === null || v === undefined || v === '') return null
  const n = num(v, NaN)
  return isFinite(n) ? n : null
}

/** Shaxsiy qarz (+ reja maydonlari) → yagona ko'rinish */
export function normDebt(d) {
  if (!d) return null
  // GET /finance/debt-plan → debts[] (dvigatel ko'rinishi) boshlang'ich summani bermaydi — progress
  // faqat `amount` bor bo'lsa ko'rsatiladi (qarz tafsilotida GET /finance/debts/:id dan olinadi).
  const rawAmount = pick(d, 'amount', 'originalAmount', 'original_amount')
  const amount = rawAmount === undefined ? null : num(rawAmount)
  const balance = num(pick(d, 'balance', 'remaining_amount', 'remainingAmount', 'remaining'), amount || 0)
  return {
    id: pick(d, 'id', 'debtId', 'debt_id'),
    title: pick(d, 'title', 'source_name', 'sourceName', 'name') || '—',
    currency: String(pick(d, 'currency') || 'UZS').toUpperCase(),
    amount,
    hasAmount: amount !== null && amount > 0,
    balance,
    balanceUzs: numOrNull(pick(d, 'remainingUzs', 'balanceUzs', 'balance_uzs', 'remaining_uzs')),
    kindInferred: !!d.kindInferred,
    status: pick(d, 'status') || 'active',
    kind: pick(d, 'kind', 'debt_kind', 'debtKind') || null,
    apr: numOrNull(pick(d, 'apr', 'interest_rate', 'interestRate')),
    termMonths: numOrNull(pick(d, 'termMonths', 'term_months')),
    minPayment: numOrNull(pick(d, 'minPayment', 'min_payment')),
    cardMinPct: numOrNull(pick(d, 'cardMinPct', 'card_min_pct')),
    cardMinAbs: numOrNull(pick(d, 'cardMinAbs', 'card_min_abs')),
    prepayFeePct: numOrNull(pick(d, 'prepayFeePct', 'prepay_fee_pct')),
    prepayMode: pick(d, 'prepayMode', 'prepay_mode') || 'shorten_term',
    penaltyPct: numOrNull(pick(d, 'penaltyPct', 'penalty_pct')),
    paymentDay: numOrNull(pick(d, 'paymentDay', 'payment_day')),
    priority: numOrNull(pick(d, 'priority', 'plan_priority', 'planPriority')),
    excluded: !!(d.excluded || d.plan_excluded || d.planExcluded),
    receivedAmount: numOrNull(pick(d, 'receivedAmount', 'received_amount')),
    dueDate: pick(d, 'dueDate', 'due_date') ? String(pick(d, 'dueDate', 'due_date')).slice(0, 10) : null,
    paidThisMonth: !!(d.paidThisMonth || d.paid_this_month),
  }
}

/** Debt → PATCH /finance/debts/:id/plan tanasi (DESIGN §3 — snake_case) */
export function debtPlanPayload(d) {
  const n = (v) => (v === null || v === undefined || v === '' ? null : num(v, null))
  return {
    debt_kind: d.kind || null,
    min_payment: n(d.minPayment),
    // 23.10: 0 = "kiritilmagan" (server 0 ni rad etardi → sozlash 1-qadamda to'xtardi)
    term_months: n(d.termMonths) || null,
    card_min_pct: n(d.cardMinPct),
    card_min_abs: n(d.cardMinAbs),
    prepay_fee_pct: n(d.prepayFeePct) || 0,
    prepay_mode: d.prepayMode || 'shorten_term',
    penalty_pct: n(d.penaltyPct) || 0,
    payment_day: n(d.paymentDay) || null,
    plan_priority: n(d.priority) || null,
    plan_excluded: !!d.excluded,
    received_amount: n(d.receivedAmount),
    interest_rate: n(d.apr),
  }
}

/** Reja sozlamalari → camelCase */
export function normSettings(p) {
  const s = p || {}
  return {
    strategy: pick(s, 'strategy') || 'optimal',
    fixedExpense: num(pick(s, 'fixedExpense', 'fixed_expense')),
    livingMedian: num(pick(s, 'livingMedian', 'living_median')),
    livingMad: numOrNull(pick(s, 'livingMad', 'living_mad')),
    historyMonths: num(pick(s, 'historyMonths', 'history_months')),
    livingConfidence: num(pick(s, 'livingConfidence', 'living_confidence'), 0.8),
    freeMoney: numOrNull(pick(s, 'freeMoney', 'free_money')),
    freeMoneyPct: num(pick(s, 'freeMoneyPct', 'free_money_pct'), 5),
    survivalPct: num(pick(s, 'survivalPct', 'survival_pct'), 70),
    bufferTarget: numOrNull(pick(s, 'bufferTarget', 'buffer_target')),
    bufferCurrent: num(pick(s, 'bufferCurrent', 'buffer_current')),
    devaluationPct: num(pick(s, 'devaluationPct', 'devaluation_pct'), 8),
    inflationPct: num(pick(s, 'inflationPct', 'inflation_pct'), 10),
    incomeGrowthPct: num(pick(s, 'incomeGrowthPct', 'income_growth_pct'), 0),
  }
}

let incomeSeq = 0
/** Daromad oqimi → tahrirlash ko'rinishi */
export function normIncome(i) {
  const x = i || {}
  const oneOff = pick(x, 'oneOffDate', 'one_off_date')
  const oneOffYm = pick(x, 'oneOffYm', 'one_off_ym')
  const day = num(pick(x, 'dayOfMonth', 'day_of_month', 'day'), 1) || 1
  const mask = num(pick(x, 'monthsMask', 'months_mask'), ALL_MONTHS_MASK)
  let mode = 'monthly'
  if (oneOff || oneOffYm) mode = 'oneoff'
  else if (mask !== ALL_MONTHS_MASK) mode = 'months'
  const rel = num(pick(x, 'reliability'), 1)
  incomeSeq += 1
  const relOption = nearestReliability(rel)
  return {
    key: 'inc-' + incomeSeq,
    id: pick(x, 'id') || null,
    title: pick(x, 'title', 'name', 'description') || '',
    amount: num(pick(x, 'amount')) || '',
    currency: String(pick(x, 'currency') || 'UZS').toUpperCase(),
    mode,
    months: monthsFromMask(mask),
    oneOffDate: oneOff ? String(oneOff).slice(0, 10) : (oneOffYm ? `${oneOffYm}-${String(Math.min(day, 28)).padStart(2, '0')}` : ''),
    dayOfMonth: day,
    reliability: relOption,
    // F10 avto-moslashgan aniq qiymat (masalan 0,62) — foydalanuvchi variantni o'zgartirmasa saqlanadi
    reliabilityRaw: rel,
    reliabilityAuto: !!(x.reliabilityAuto || x.reliability_auto),
    scheduledIncomeId: pick(x, 'scheduledIncomeId', 'scheduled_income_id') || null,
  }
}

function nearestReliability(rel) {
  return RELIABILITY_OPTIONS.reduce((best, o) => (Math.abs(o - rel) < Math.abs(best - rel) ? o : best), 1)
}

/** Tahrirlash ko'rinishi → PUT /finance/debt-plan dagi incomes[] elementi (validator: snake_case) */
export function incomePayload(i) {
  const oneOff = i.mode === 'oneoff' ? (i.oneOffDate || null) : null
  const out = {
    title: String(i.title || '').trim().slice(0, 100),
    amount: num(i.amount),
    currency: i.currency || 'UZS',
    months_mask: i.mode === 'months' ? maskFromMonths(i.months) : ALL_MONTHS_MASK, // bir martalikda backend sanadan oladi
    one_off_date: oneOff,
    day_of_month: oneOff ? Number(oneOff.slice(8, 10)) : Math.min(31, Math.max(1, Math.round(num(i.dayOfMonth, 1)))),
    reliability: i.reliabilityRaw != null && nearestReliability(i.reliabilityRaw) === i.reliability ? i.reliabilityRaw : i.reliability,
    // PUT daromadlarni TO'LIQ almashtiradi — avto-moslashuv belgisi yo'qolmasin (F10, oylik cron)
    reliability_auto: !!i.reliabilityAuto,
  }
  if (i.scheduledIncomeId) out.scheduled_income_id = Number(i.scheduledIncomeId)
  return out
}

export function monthsFromMask(mask) {
  const out = []
  for (let m = 0; m < 12; m++) if (mask & (1 << m)) out.push(m + 1)
  return out
}

export function maskFromMonths(months) {
  return (months || []).reduce((acc, m) => acc | (1 << (m - 1)), 0)
}

/** 'YYYY-MM' + n oy */
export function ymAdd(ym, n) {
  const [y, m] = String(ym || '').split('-').map(Number)
  if (!y || !m) return null
  const idx = y * 12 + (m - 1) + Math.round(n || 0)
  const yy = Math.floor(idx / 12)
  const mm = (idx % 12) + 1
  return `${yy}-${String(mm).padStart(2, '0')}`
}

export function currentYm(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** '2027-09' → "2027-yil sentabr" / "сентябрь 2027" / "September 2027" */
export function ymLabel(ym, t, locale) {
  const [y, m] = String(ym || '').split('-').map(Number)
  if (!y || !m) return '—'
  const name = String(t('months.' + MONTH_KEYS[m - 1]) || '')
  if (locale === 'en') return `${name} ${y}`
  if (locale === 'ru') return `${name.toLowerCase()} ${y}`
  if (locale === 'kr') return `${y} йил ${name.toLowerCase()}`
  if (locale === 'kaa') return `${y}-jıl ${name.toLowerCase()}`
  return `${y}-yil ${name.toLowerCase()}`
}

/** '2027-09' → "sen 2027" (grafik o'qi uchun qisqa) */
export function ymShort(ym, t) {
  const [y, m] = String(ym || '').split('-').map(Number)
  if (!y || !m) return ''
  const name = String(t('months.' + MONTH_KEYS[m - 1]) || '')
  return `${name.slice(0, 3)} ${String(y).slice(2)}`
}

export function monthName(m, t) {
  return String(t('months.' + MONTH_KEYS[(m - 1 + 12) % 12]) || '')
}

/** 1 234 567 (butun so'm) */
export function fmtSum(v) {
  const n = Math.round(num(v))
  const s = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (n < 0 ? '−' : '') + s
}

/** 8 150 000 → "8,15 mln" (en: "8.15M") */
export function fmtMln(v, locale) {
  const n = num(v)
  const abs = Math.abs(n)
  const unit = { uz: 'mln', kaa: 'mln', kr: 'млн', ru: 'млн', en: 'M' }[locale] || 'mln'
  const kUnit = { uz: 'ming', kaa: 'mıń', kr: 'минг', ru: 'тыс.', en: 'K' }[locale] || 'ming'
  const sep = locale === 'en' ? '.' : ','
  if (abs >= 1e6) {
    const s = (n / 1e6).toFixed(abs >= 1e8 ? 0 : 2).replace(/\.?0+$/, '').replace('.', sep)
    return locale === 'en' ? s + unit : `${s} ${unit}`
  }
  if (abs >= 1e3) {
    const s = String(Math.round(n / 1e3))
    return locale === 'en' ? s + kUnit : `${s} ${kUnit}`
  }
  return String(Math.round(n))
}

/** Oylik stavka (0.0375) → foiz matni "3,75" */
export function fmtPct(v, digits = 2, locale = 'uz') {
  const n = num(v) * 100
  const s = n.toFixed(digits).replace(/\.?0+$/, '')
  return locale === 'en' ? s : s.replace('.', ',')
}

/** Oylik stavka → yillik ekvivalent (murakkab) */
export function annualFromMonthly(r) {
  return Math.pow(1 + num(r), 12) - 1
}

/** F2: annuitet oylik to'lovi */
export function annuityPayment(P, aprPct, n) {
  const p = num(P), r = num(aprPct) / 1200, k = Math.round(num(n))
  if (!(p > 0) || !(k > 0)) return null
  if (r === 0) return p / k
  return (p * r) / (1 - Math.pow(1 + r, -k))
}

/**
 * 23.10 (egasi hujjati 22.10, 11/13-rasmlar): texnik (dasturchi uchun) xabarmi — masalan
 * "term_months — 1..600 oralig'ida", "incomes[0].amount — majburiy", "Noma'lum maydon: x_y".
 * Bunday matn foydalanuvchiga KO'RSATILMAYDI (o'rniga tushunarli fallback).
 */
export function isTechnicalMessage(msg) {
  const s = String(msg || '')
  if (!s) return true
  if (/[a-z]+_[a-z_]+/.test(s)) return true // snake_case maydon nomi
  if (/\w+\[\d+\]\./.test(s)) return true // incomes[0].amount
  if (/\d+\.\.-?\d+/.test(s)) return true // 1..600
  if (/^(Request failed|Network Error|timeout of)/i.test(s)) return true
  return false
}

/** API xatosidan foydalanuvchiga ko'rsatiladigan matn (texnik matn → fallback) */
export function apiErrorText(err, fallback) {
  const d = err && err.response && err.response.data
  const msg = d && (typeof d.message === 'string' ? d.message : (typeof d.error === 'string' ? d.error : ''))
  return msg && !isTechnicalMessage(msg) ? msg : fallback
}

/** 23.10: so'rov tili (query ?lang=) — backend xato matnlarini shu tilda qaytaradi (custom header CORS preflight'ni buzadi). */
export function langParams(vm, extra) {
  const locale = (vm && vm.$i18n && vm.$i18n.locale) || 'uz'
  return { ...(extra || {}), lang: locale }
}

/**
 * 23.10: qarz reja maydonlarini serverga yuborishdan OLDIN tekshirish (backend validators/debtPlan.validator.js
 * chegaralari bilan bir xil). Natija: { maydon: 'debt_plan.err.<kalit>' } — bo'sh obyekt = xato yo'q.
 */
export function debtFieldErrors(d) {
  const out = {}
  if (!d || d.excluded) return out
  const val = (v) => (v === null || v === undefined || v === '' ? null : Number(v))
  const isInt = (n) => Number.isInteger(n)
  const term = val(d.termMonths)
  if (term !== null && term !== 0 && (!isInt(term) || term < 1 || term > 600)) out.termMonths = 'debt_plan.err.term_range'
  const pr = val(d.priority)
  if (pr !== null && pr !== 0 && (!isInt(pr) || pr < 1 || pr > 999)) out.priority = 'debt_plan.err.priority_range'
  const apr = val(d.apr)
  if (apr !== null && (!(apr >= 0) || apr > 999.99)) out.apr = 'debt_plan.err.apr_range'
  ;['cardMinPct', 'prepayFeePct', 'penaltyPct'].forEach((k) => {
    const v = val(d[k])
    if (v !== null && (!(v >= 0) || v > 100)) out[k] = 'debt_plan.err.pct_range'
  })
  ;['minPayment', 'cardMinAbs', 'receivedAmount'].forEach((k) => {
    const v = val(d[k])
    if (v !== null && (!(v >= 0) || v > 1e13)) out[k] = 'debt_plan.err.money_range'
  })
  return out
}

/** `{ success, data }` javobidan data (yoki to'g'ridan-to'g'ri obyekt) */
export function unwrap(res) {
  if (!res) return null
  if (res.success === false) return null
  if (Object.prototype.hasOwnProperty.call(res, 'data') && Object.prototype.hasOwnProperty.call(res, 'success')) return res.data
  return res
}

export function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 23.10: "1234567.5" → "1 234 567.5" (MoneyInput uchun; kasr qismi saqlanadi) */
export function groupDigits(raw) {
  const s = String(raw == null ? '' : raw)
  if (!s) return ''
  const neg = s.startsWith('-')
  const body = neg ? s.slice(1) : s
  const [int, frac] = body.split('.')
  const g = (int || '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (neg ? '-' : '') + g + (frac !== undefined ? '.' + frac : '')
}

/** 23.10: foydalanuvchi matnidan toza raqamli satr — bo'shliqlar olib tashlanadi, vergul → nuqta, `decimals` xona kasr. */
export function cleanMoney(text, decimals = 2) {
  let s = String(text == null ? '' : text).replace(/[\s ]/g, '').replace(/,/g, '.')
  s = s.replace(/[^\d.]/g, '')
  const dot = s.indexOf('.')
  if (dot >= 0) {
    const frac = s.slice(dot + 1).replace(/\./g, '').slice(0, decimals)
    s = decimals > 0 ? s.slice(0, dot) + '.' + frac : s.slice(0, dot)
  }
  return s.replace(/^0+(?=\d)/, '')
}
