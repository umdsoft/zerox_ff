/**
 * FISh (identifikatsiyadan o'tgan, MyID foydalanuvchi ismi) ko'rsatish yordamchilari.
 * Faqat KO'RSATISH uchun: API so'rovi, PDF/Excel eksport va SMS ga tegmaydi.
 * Transliteratsiya mantig'i — utils/nameTranslit.js (qayta yozilmagan).
 *
 * Sayt til kodlari (nuxt.config i18n.locales): uz, ru, kr (o'zbek kirill), kaa (qoraqalpoq lotin), en.
 * strategy "prefix_except_default": uz — prefikssiz, boshqalari /ru /kr /kaa /en. `this.$i18n.locale`
 * har doim shu 5 kodning biri (kichik harf); noma'lum qiymat uz deb olinadi.
 */
import translitName from './nameTranslit';

// ilova (ZeroX_mobile/src/helper/useFio.ts normalizeFioLang) bilan bir xil normallashtirish
export function normLocale(raw) {
  const l = String(raw || '').toLowerCase();
  if (l === 'ru' || l.startsWith('ru-')) return 'ru';
  if (l === 'kr' || l === 'oz' || l === 'uz-cyrl' || l === 'uz_cyrl' || l === 'uz-cyrillic') return 'kr';
  if (l === 'kaa' || l === 'qq' || l.startsWith('kaa-') || l === 'kk-kaa') return 'kaa';
  if (l === 'en' || l.startsWith('en-')) return 'en';
  return 'uz';
}

/** FISh ni tanlangan tilda qaytaradi (en/uz — o'zgarishsiz). */
export function fio(name, locale) {
  if (name === null || name === undefined || name === '') return name;
  return translitName(name, normLocale(locale));
}

/** "A B C" qismlarini bo'sh joy bilan birlashtirib FISh qaytaradi (bo'sh qismlar tashlanadi). */
export function fioJoin(parts, locale) {
  const s = (Array.isArray(parts) ? parts : [parts]).filter((p) => p && String(p).trim()).join(' ');
  return fio(s, locale);
}

const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[ʻʼ‘’`´]/g, "'").trim();

/**
 * Qidiruv moslashuvi: yozilgan matn ASL (lotin) ham, ko'rsatilayotgan (transliteratsiya) shakl ham bo'yicha mos kelsa true.
 * Faqat mijoz tomonidagi filtrlar uchun; serverga yuboriladigan qidiruv matni o'zgartirilmaydi.
 */
export function fioMatches(name, query, locale) {
  const q = norm(query);
  if (!q) return true;
  const raw = norm(name);
  if (raw.includes(q)) return true;
  return norm(fio(name, locale)).includes(q);
}

export default fio;
