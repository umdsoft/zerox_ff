/**
 * Wave-1 refactor: sahifalardagi LOCAL formatlovchi nusxalarning aynan (verbatim) ko'chirmalari.
 * Maqsad: ularni umumiy funksiyaga almashtirishdan oldin xatti-harakatni qotirish (characterization).
 * Bu fayl faqat testlar uchun — ilovaga kirmaydi.
 */
import dateformat from 'dateformat';

// pages/finance/debts/group/_key.vue, pages/finance/debts/_id.vue, components/finance/DebtActionModal.vue (3 nusxa, bir xil)
export function legacyFmtNum(v) {
  if (v === '' || v == null) return '';
  const n = Number(String(v).replace(/\s/g, '').replace(',', '.'));
  if (!isFinite(n)) return '';
  const r = String(Math.round(Math.abs(n)));
  return r.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// pages/finance/debts/_id.vue, DebtActionModal.vue varianti (bir qatorda) — bir xil
export function legacyFmtNumB(v) {
  if (v === '' || v == null) return '';
  const n = Number(String(v).replace(/\s/g, '').replace(',', '.'));
  if (!isFinite(n)) return '';
  return String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// pages/finance/gap/index.vue, pages/finance/gap/_id.vue (2 nusxa, bir xil)
export function legacyGapFmtDate(d) {
  if (!d) return '';
  const p = String(d).slice(0, 10).split('-');
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d;
}

// components/notification_types/gap-invite.vue
export function legacyGapInviteFmtDate(d) {
  if (!d) return '';
  const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(d);
}

// pages/price/index.vue
export function legacyPriceFormatPrice(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// pages/price/index.vue fmtDate (toDate bilan)
export function legacyPriceFmtDate(value) {
  const toDate = (v) => {
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const d = toDate(value);
  if (!d) return '—';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

// pages/mobil-hisob/index.vue
export function legacyMobilHisobFormatPrice(value) {
  return value
    .toString()
    .replace(/\s/g, '')
    .replace(/[^0-9]/g, '')
    .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
}

// pages/user/index.vue (toLocaleString — ICU'ga bog'liq)
export function legacyUserFmt(v) {
  return Number(v || 0).toLocaleString('uz-UZ').replace(/,/g, ' ');
}

// pages/finance/analytics/index.vue
export function legacyAnalyticsFormatMoney(value, short = false, currency = 'UZS') {
  const cur = currency || 'UZS';
  if (!value) return '0 ' + cur;
  if (short && Math.abs(value) >= 1000000) return (value / 1000000).toFixed(1) + 'M ' + cur;
  if (short && Math.abs(value) >= 1000) return (value / 1000).toFixed(0) + 'K ' + cur;
  return Number(value).toLocaleString('uz-UZ').replace(/,/g, ' ') + ' ' + cur;
}
// pages/finance/goals/index.vue
export function legacyGoalsFormatMoney(value, short = false, currency = 'UZS') {
  const cur = currency || 'UZS';
  if (!value) return '0 ' + cur;
  if (short && value >= 1000000) return (value / 1000000).toFixed(1) + 'M ' + cur;
  return Number(value).toLocaleString('uz-UZ').replace(/,/g, ' ') + ' ' + cur;
}

// pages/finance/debts/group/_key.vue (UZ +5, soniyasiz)
export function legacyKeyFormatDateTime(dt, formatDate) {
  if (!dt) return '-';
  const d = new Date(dt);
  if (isNaN(d)) return formatDate(dt);
  const x = new Date(d.getTime() + 5 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(x.getUTCDate())}.${p(x.getUTCMonth() + 1)}.${x.getUTCFullYear()} ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}`;
}
// pages/finance/debts/_id.vue (UZ +5, soniya bilan)
export function legacyIdFormatDateTime(dt, formatDate) {
  if (!dt) return '-';
  const d = new Date(dt);
  if (isNaN(d)) return formatDate(dt);
  const x = new Date(d.getTime() + 5 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(x.getUTCDate())}.${p(x.getUTCMonth() + 1)}.${x.getUTCFullYear()} ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}:${p(x.getUTCSeconds())}`;
}

// plugins/main.js Vue.prototype.beautySum / dateBeauty
export function legacyBeautySum(num) {
  if (num === null || num === undefined) return '0';
  const number = parseInt(num);
  if (isNaN(number)) return '0';
  return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
}
export function legacyDateBeauty(date) {
  if (!date) return '';
  try {
    const date1 = dateformat(date, 'isoDate');
    return date1.split('-').reverse().join('.');
  } catch {
    return '';
  }
}
