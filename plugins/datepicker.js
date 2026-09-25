import Vue from "vue";

/**
 * SS-PERF (2026-09-25): vue2-datepicker (~110 KB JS + CSS) ilgari asosiy bundle'da edi;
 * landing/login sahifalarida umuman kerak emas. Endi ASYNC global komponent — kutubxona,
 * CSS va lokallar faqat birinchi <date-picker> render bo'lganda yuklanadi. Lokal
 * mantiqi (uz-Latn/uz-Cyrl ro'yxati, default lokal ilova tiliga mos, til almashganda
 * yangilanish — SS-DEV 2026-09-24) o'zgarmagan, faqat yuklanish kechiktirilgan.
 */

let loader = null;

function registerUzLocales(DatePicker) {
  try {
    // O'zbek (lotincha) — struktura rasmiy locale fayllariga mos (faqat formatLocale o'qiladi)
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
}

/**
 * SS-DEV (2026-09-24) ILDIZ SABAB: `DatePicker.locale(name, object)` lokalni RO'YXATGA
 * OLISH bilan birga uni JORIY (default) qilib ham qo'yadi — shuning uchun ro'yxatdan
 * keyin default lokal ilova tiliga mos qayta o'rnatiladi.
 */
function dpLocaleFor(loc) {
  return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn');
}

/** Kutubxona + CSS + ru lokalini bir marta yuklab, DatePicker'ni qaytaradi. */
function ensureDatePicker(i18n) {
  if (!loader) {
    loader = Promise.all([
      import('vue2-datepicker'),
      import('vue2-datepicker/index.css'),
      import('vue2-datepicker/locale/ru'),
    ]).then(([m]) => {
      const DatePicker = m.default || m;
      registerUzLocales(DatePicker);
      try { DatePicker.locale(dpLocaleFor(i18n && i18n.locale)); } catch (_) { /* jim */ }
      return DatePicker;
    }).catch((e) => {
      loader = null; // keyingi urinishda qayta yuklash
      throw e;
    });
  }
  return loader;
}

export default function ({ app }) {
  const i18n = app && app.i18n;

  Vue.component('date-picker', () => ensureDatePicker(i18n));

  try {
    if (i18n && !i18n.__dpLocaleHooked) {
      i18n.__dpLocaleHooked = true;
      const prev = i18n.onLanguageSwitched;
      i18n.onLanguageSwitched = function (oldLocale, newLocale) {
        // Kutubxona hali yuklanmagan bo'lsa — yuklanganda joriy til o'zi o'rnatiladi
        if (loader) {
          loader.then((DatePicker) => {
            try { DatePicker.locale(dpLocaleFor(newLocale)); } catch (_) { /* jim */ }
          }).catch(() => {});
        }
        if (typeof prev === 'function') return prev.apply(this, arguments);
      };
    }
  } catch (e) {
    if (process.client && console && console.warn) console.warn('[datepicker] default lokal:', e && e.message);
  }
}
