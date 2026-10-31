/**
 * wave C: pages/price/index.vue — to'lov / tarif sotib olish uchun sof (pure) funksiyalar.
 * Qiymatlar va URL formatlari sahifadagi avvalgi kod bilan AYNAN bir xil (tests/priceCheckout.test.js, tests/priceUtils.test.js).
 */

export const CLICK_SERVICE_ID = 24899;
export const CLICK_MERCHANT_ID = 17375;
export const PAYME_MERCHANT_ID = '62fa657ea12ad7a48f4b2dd9';
export const MIN_TOPUP_AMOUNT = 1000;
export const DEFAULT_ORIGIN = 'https://zerox.uz';

export const PLAN_OFFERS = {
  start: { price: 99000, smsCount: 500, label: 'Start' },
  premium: { price: 199000, smsCount: 1100, label: 'Premium' },
};

/** `plan === 'premium'` bo'lmasa — Start narxi (avvalgi sahifa mantig'i); `plan` qiymati o'zgarishsiz saqlanadi. */
export function planPurchaseTarget(plan) {
  const offer = plan === 'premium' ? PLAN_OFFERS.premium : PLAN_OFFERS.start;
  return { plan, price: offer.price, smsCount: offer.smsCount, label: offer.label };
}

export function addonPurchaseTarget(pkg) {
  return { kind: 'addon', packageName: pkg.name, price: pkg.price, smsCount: pkg.sms, label: `${pkg.sms} SMS` };
}

/** Top-up qaytish manzili: joriy domen origin'i + /price (encode QILINMAYDI). */
export function topupReturnUrl(origin) {
  return `${origin || DEFAULT_ORIGIN}/price`;
}

/** mobil-hisob eventClick formati: return_url raw (encode yo'q). */
export function buildClickTopupUrl({ uid, amount, returnUrl }) {
  const str = `service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount}&transaction_param=${uid}&return_url=${returnUrl}`;
  return `https://my.click.uz/services/pay?${  str}`;
}

/** mobil-hisob eventPayme formati: summa tiyinda, base64 (`btoa` — brauzer). */
export function buildPaymeTopupUrl({ uid, amount, returnUrl }) {
  const tiyin = amount * 100;
  const str = `m=${PAYME_MERCHANT_ID};ac.user_id=${uid};a=${tiyin};c=${returnUrl}`;
  return `https://checkout.paycom.uz/${  btoa(str)}`;
}

/** Top-up so'rovi yaroqlimi (uid bor, summa >= 1000). */
export function isValidTopup(uid, amount) {
  return Boolean(uid) && amount >= MIN_TOPUP_AMOUNT;
}

/** Hisob yetishmasa — to'ldirish summasi (kamida 1000). */
export function topupAmountForShortfall(shortfall) {
  return Math.max(MIN_TOPUP_AMOUNT, shortfall);
}

/** SS-SEC (2026-09-25): to'lov havolasi faqat https bo'lsa ochiladi. */
export function isSafePaymentUrl(url) {
  return /^https:\/\//i.test(String(url || ''));
}

// ---- sana yordamchilari (sahifa metodlari shularga delegatsiya qiladi) ----

export function toDate(value) {
  if (!value) {return null;}
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 29.09: tarif sanasi — 29.09.2026 (bo'sh/noto'g'ri -> '—'; brauzer vaqti bo'yicha). */
export function fmtTariffDate(value) {
  const d = toDate(value);
  if (!d) {return '—';}
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** +1 kalendar oy (oy oxiri qisqartiriladi) — backend utils/subscriptionPeriod.addOneMonth bilan bir xil */
export function addOneMonth(value) {
  const src = toDate(value) || new Date();
  const d = new Date(src.getTime());
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return d;
}
