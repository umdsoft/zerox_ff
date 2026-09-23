/**
 * cardBin.js — plastik karta yordamchilari (SS10, 2026-09-20).
 *
 * NEGA: do'kon (savdo_faoliyat) kartasini web'dan kiritish qo'shildi. Backend
 * `helper/cardBin.js` XALQARO sxemalarni (Visa/Mastercard/Amex/Diners/JCB/
 * Discover) rad etadi. Shu qoidani klient tomonda AYNAN takrorlaymiz — aks holda
 * foydalanuvchi faqat 400 xatosidan keyin bilardi.
 *
 * ⚠️ Deny-list (allow-list EMAS): Uzcard/Humo BIN'lari vaqti-vaqti bilan
 * kengayadi (8600, 9860, 5614, 6262, ...), xalqaro diapazonlar esa barqaror.
 * UnionPay (62) ATAYLAB kiritilmadi — Uzcard 6262 bilan to'qnashardi.
 *
 * @module utils/cardBin
 */

/** Faqat raqamlar, 16 tagacha. */
export function digitsOf(raw) {
  return String(raw == null ? '' : raw).replace(/\D/g, '').slice(0, 16);
}

/**
 * Karta raqamini 4 talik guruhlab chiqarish.
 * @example fmtCard4('9860190104756696') // "9860 1901 0475 6696"
 */
export function fmtCard4(raw) {
  const d = digitsOf(raw);
  if (!d) return '';
  return d.replace(/(.{4})(?=.)/g, '$1 ');
}

const INTERNATIONAL = [
  { name: 'Visa', test: (d) => d.startsWith('4') },
  {
    name: 'Mastercard',
    test: (d) => {
      const p2 = Number(d.slice(0, 2));
      const p4 = Number(d.slice(0, 4));
      return (p2 >= 51 && p2 <= 55) || (p4 >= 2221 && p4 <= 2720);
    },
  },
  { name: 'American Express', test: (d) => d.startsWith('34') || d.startsWith('37') },
  {
    name: 'Diners Club',
    test: (d) => {
      const p3 = Number(d.slice(0, 3));
      return (p3 >= 300 && p3 <= 305) || d.startsWith('36') || d.startsWith('38');
    },
  },
  {
    name: 'JCB',
    test: (d) => {
      const p4 = Number(d.slice(0, 4));
      return p4 >= 3528 && p4 <= 3589;
    },
  },
  {
    name: 'Discover',
    test: (d) => {
      const p3 = Number(d.slice(0, 3));
      return d.startsWith('6011') || (p3 >= 644 && p3 <= 649) || d.startsWith('65');
    },
  },
];

/** Xalqaro sxema nomi yoki null (null = mahalliy, qabul qilinadi). */
export function internationalScheme(raw) {
  const d = digitsOf(raw);
  if (d.length < 2) return null;
  const hit = INTERNATIONAL.find((s) => s.test(d));
  return hit ? hit.name : null;
}

/** Bo'sh qiymat ham ruxsat (rekvizitni o'chirish uchun). */
export function isLocalCard(raw) {
  const d = digitsOf(raw);
  if (!d) return true;
  return internationalScheme(d) === null;
}

/**
 * Mahalliy to'lov tizimi nomi (faqat KO'RSATISH uchun, validatsiya emas).
 * Noma'lum BIN'da bo'sh satr qaytaradi — yolg'on nom yozmaymiz.
 */
export function cardBrand(raw) {
  const d = digitsOf(raw);
  if (d.length < 4) return '';
  const p4 = d.slice(0, 4);
  if (p4 === '9860') return 'Humo';
  if (p4 === '8600' || p4 === '5614' || p4 === '6262') return 'Uzcard';
  return '';
}

export default { digitsOf, fmtCard4, internationalScheme, isLocalCard, cardBrand };
