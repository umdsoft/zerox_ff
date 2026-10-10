/**
 * Do'kon (savdo faoliyati) nomi qoidalari — yaratish va tahrirlash oynalari uchun YAGONA manba.
 * (10.10: SavdoFaoliyatModal'dan ajratildi — tahrirlash oynasi ham aynan shu qoidalarni ishlatadi.)
 *
 * Nom qarz oluvchilarga yuboriladigan SMS'da chiqadi: lotin harflari, raqamlar, probel, defis,
 * nuqta VA oddiy apostrof (') — GSM-7 xavfsiz (SMS UCS-2 ga o'tmaydi, 1 ta bo'lib qoladi).
 */
export const SHOP_NAME_MAX_LEN = 28

const ALLOWED_RE = /^[A-Za-z0-9 .\-']+$/

// Apostrof-oilasi (okina ʻ, ʼ, jingalak ' ', backtick `, ´, ′) — kiritishda oddiy ' ga aylantiriladi.
const APOSTROPHE_LIKE = /[ʻʼ‘’`´′ʹ‵]/g

// Aniq taqiqlangan belgilar — UX uchun aniq xato xabari.
const BANNED_CHARS = ['—', '(', ')', ',', '№', '"', '“', '”', '|']

/** Apostrof-variantlarini oddiy ' ga aylantiradi va uzunlikni cheklaydi. */
export function normalizeShopName(raw) {
  const v = String(raw == null ? '' : raw).replace(APOSTROPHE_LIKE, "'")
  return v.length > SHOP_NAME_MAX_LEN ? v.slice(0, SHOP_NAME_MAX_LEN) : v
}

/**
 * Nom tekshiruvi. Bo'sh nom — xato EMAS (majburiylik alohida tekshiriladi).
 * @returns {{code: ''|'len'|'banned'|'nonLatin', char?: string}}
 */
export function checkShopName(raw) {
  const v = String(raw || '')
  if (!v) return { code: '' }
  if (v.length > SHOP_NAME_MAX_LEN) return { code: 'len' }
  const bad = BANNED_CHARS.find((c) => v.indexOf(c) !== -1)
  if (bad) return { code: 'banned', char: bad }
  if (!ALLOWED_RE.test(v)) return { code: 'nonLatin' }
  return { code: '' }
}
