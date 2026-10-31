/**
 * ZeroX - yagona formatlash manbasi (wave-1 refactor).
 *
 * Qoida: bu yerda mavjud funksiyalar AYNAN (xatti-harakati bir xil) saqlanadi.
 * - `utils/helpers.js` formatlovchilari shu yerdan qayta eksport qilinadi (kanonik nom o'zgarmaydi).
 * - Avval `utils/formatters.js` va `plugins/main.js` (beautySum / dateBeauty) ichida yashagan
 *   NUSXALAR boshqa xatti-harakatga ega bo'lgani uchun BIRLASHTIRILMADI — ular farqli nom bilan
 *   shu yerga ko'chirildi va eski joylar shu nomlarga alias qilindi. Farqlar: docs/REFACTOR_DIVERGENCES.md.
 */
import dateformat from 'dateformat';

// ---- helpers.js (kanonik) ----
export {
  formatNumber,
  formatCurrency,
  formatCompact,
  formatMoney,
  formatNumberGrouped,
  formatMoneyCur,
  formatDate,
  parseDateSafe,
  fmtDMY,
  fmtBirthDate,
  fmtHM,
  fmtDMYHM,
  formatDateLocale,
  localizedMonthNames,
} from './helpers';

// ---- formatters.js dan ko'chirilgan (xatti-harakati helpers'dan FARQ qiladi) ----

/** formatters.formatAmount: `toString()` + regex (parseFloat YO'Q; bo'sh/NaN satr o'zgarishsiz qaytadi). */
export function formatAmountRaw(value) {
  if (value === null || value === undefined) {return '0';}
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** formatters.formatDate: ISO prefiks yoki `dateformat` (MAHALLIY vaqt). helpers.formatDate esa UTC. */
export function formatDateLocalIso(date) {
  if (!date) {return '';}
  const str = String(date);
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}.${match[2]}.${match[1]}`;
  }
  const isoDate = dateformat(date, 'isoDate');
  return isoDate.split('-').reverse().join('.');
}

export function cleanPhoneNumber(phone) {
  if (!phone) {return '';}
  return phone.split('').filter((char) => char !== ' ').join('');
}

export function isValidUzbekPhone(phone) {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned.length === 13 && cleaned.startsWith('+998');
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function parseDate(dateStr) {
  if (!dateStr) {return null;}
  return new Date(dateStr);
}

/** formatters.getRelativeTime ("Bugun"/"Kecha"/...) — helpers.getRelativeTime ("N kun oldin") bilan MOS EMAS. */
export function relativeTimeLabel(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {return 'Bugun';}
  if (diffDays === 1) {return 'Kecha';}
  if (diffDays < 7) {return `${diffDays} kun oldin`;}
  if (diffDays < 30) {return `${Math.floor(diffDays / 7)} hafta oldin`;}
  return formatDateLocalIso(date);
}

// ---- plugins/main.js dan ko'chirilgan ----

/** Vue.prototype.beautySum: `parseInt` (kasr tushadi), NaN -> '0'. */
export function beautySum(num) {
  if (num === null || num === undefined) {return '0';}
  const number = parseInt(num);
  if (isNaN(number)) {return '0';}
  return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
}

/** Vue.prototype.dateBeauty: `dateformat` isoDate (mahalliy), xatoda ''. */
export function dateBeauty(date) {
  if (!date) {return '';}
  try {
    const date1 = dateformat(date, 'isoDate');
    return date1.split('-').reverse().join('.');
  } catch {
    return '';
  }
}

// ---- sahifalardagi BIR XIL local nusxalar uchun umumiy funksiyalar ----

/**
 * finance/debts/_id, finance/debts/group/_key, DebtActionModal — fmtNum (3 nusxa, bir xil):
 * "79000.00" -> "79 000"; bo'sh / sonmas -> ''; manfiy ishora tashlanadi.
 */
export function formatIntGrouped(v) {
  if (v === '' || v == null) {return '';}
  const n = Number(String(v).replace(/\s/g, '').replace(',', '.'));
  if (!isFinite(n)) {return '';}
  return String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** finance/gap/index, finance/gap/_id — fmtDate (2 nusxa, bir xil): `slice(0,10).split('-')`, mos kelmasa asl qiymat. */
export function fmtIsoSliceDMY(d) {
  if (!d) {return '';}
  const p = String(d).slice(0, 10).split('-');
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d;
}

/**
 * wave B: pages/price/index.vue `formatPrice` — bo'sh joy bilan minglik guruh. Avvalgi `n.toString()` null/undefined'da
 * xato tashlardi; endi `0` deb olinadi. Boshqa qiymatlarda natija avvalgidek.
 */
export function groupThousands(n) {
  return String(n ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
