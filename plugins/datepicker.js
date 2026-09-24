import Vue from "vue";
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'

/**
 * O'zbek tili lokallar — vue2-datepicker'da yo'q.
 * Struktura rasmiy locale fayllariga mos (faqat formatLocale o'qiladi):
 *   { formatLocale: {...}, yearFormat, monthFormat, monthBeforeYear }
 * try-catch bilan o'ralgan — agar API o'zgargan bo'lsa ham app buzilmaydi.
 */
try {
  // O'zbek (lotincha)
  DatePicker.locale('uz-Latn', {
    formatLocale: {
      months: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
      monthsShort: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
      weekdays: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
      weekdaysShort: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
      weekdaysMin: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
      firstDayOfWeek: 1,
      firstWeekContainsDate: 1,
    },
    yearFormat: 'YYYY',
    monthFormat: 'MMM',
    monthBeforeYear: true,
  });

  // O'zbek (kirillcha)
  DatePicker.locale('uz-Cyrl', {
    formatLocale: {
      months: ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентабр', 'Октабр', 'Ноябр', 'Декабр'],
      monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      weekdays: ['Якшанба', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба'],
      weekdaysShort: ['Як', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'],
      weekdaysMin: ['Я', 'Д', 'С', 'Ч', 'П', 'Ж', 'Ш'],
      firstDayOfWeek: 1,
      firstWeekContainsDate: 1,
    },
    yearFormat: 'YYYY',
    monthFormat: 'MMM',
    monthBeforeYear: true,
  });
} catch (e) {
  // Lokallar ro'yxatdan o'tmasa — datepicker baribir ishlaydi (default 'en' yoki 'ru')
  if (process.client && console && console.warn) {
    console.warn('[datepicker] uz lokallarini ro\'yxatdan o\'tkazib bo\'lmadi:', e && e.message);
  }
}

Vue.component("date-picker", DatePicker);

/**
 * SS-DEV (2026-09-24) ILDIZ SABAB: `DatePicker.locale(name, object)` lokalni
 * RO'YXATGA OLISH bilan birga uni JORIY (default) lokal qilib ham qo'yadi.
 * Yuqorida oxirgi ro'yxatdan o'tgani `uz-Cyrl` bo'lgani uchun `:lang` bermagan
 * barcha sana tanlagichlar (hisobot/berilgan-olingan qarz "Saralash" oynasi)
 * hafta kunlarini KIRILLDA ("Д С Ч П Ж Ш Я") chiqarardi.
 * Endi default lokal ilova tiliga mos qo'yiladi va til almashganda yangilanadi.
 */
function dpLocaleFor(loc) {
  return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn');
}

export default function ({ app }) {
  try {
    const i18n = app && app.i18n;
    DatePicker.locale(dpLocaleFor(i18n && i18n.locale));
    if (i18n && !i18n.__dpLocaleHooked) {
      i18n.__dpLocaleHooked = true;
      const prev = i18n.onLanguageSwitched;
      i18n.onLanguageSwitched = function (oldLocale, newLocale) {
        try { DatePicker.locale(dpLocaleFor(newLocale)); } catch (_) { /* jim */ }
        if (typeof prev === 'function') return prev.apply(this, arguments);
      };
    }
  } catch (e) {
    if (process.client && console && console.warn) console.warn('[datepicker] default lokal:', e && e.message);
  }
}
