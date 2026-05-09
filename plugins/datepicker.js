import Vue from "vue";
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'

// O'zbek (lotincha) lokali — vue2-datepicker'da yo'q, qo'lda ro'yxatdan o'tkazamiz
DatePicker.locale('uz-Latn', {
  months: [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ],
  monthsShort: [
    'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn',
    'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek',
  ],
  weekdays: [
    'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba',
  ],
  weekdaysShort: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
  weekdaysMin: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
  firstDayOfWeek: 1,
  firstWeekContainsDate: 1,
  formatLocale: {
    months: [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
    ],
    monthsShort: [
      'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn',
      'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek',
    ],
    weekdays: [
      'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba',
    ],
    weekdaysShort: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
    weekdaysMin: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
    firstDayOfWeek: 1,
    firstWeekContainsDate: 1,
  },
  yearFormat: 'YYYY',
  monthFormat: 'MMMM',
  monthBeforeYear: true,
});

// O'zbek (kirillcha) lokali
DatePicker.locale('uz-Cyrl', {
  months: [
    'Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн',
    'Июл', 'Август', 'Сентабр', 'Октабр', 'Ноябр', 'Декабр',
  ],
  monthsShort: [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
  ],
  weekdays: [
    'Якшанба', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба',
  ],
  weekdaysShort: ['Як', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'],
  weekdaysMin: ['Я', 'Д', 'С', 'Ч', 'П', 'Ж', 'Ш'],
  firstDayOfWeek: 1,
  firstWeekContainsDate: 1,
  formatLocale: {
    months: [
      'Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн',
      'Июл', 'Август', 'Сентабр', 'Октабр', 'Ноябр', 'Декабр',
    ],
    monthsShort: [
      'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
    ],
    weekdays: [
      'Якшанба', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба',
    ],
    weekdaysShort: ['Як', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'],
    weekdaysMin: ['Я', 'Д', 'С', 'Ч', 'П', 'Ж', 'Ш'],
    firstDayOfWeek: 1,
    firstWeekContainsDate: 1,
  },
  yearFormat: 'YYYY',
  monthFormat: 'MMMM',
  monthBeforeYear: true,
});

Vue.component("date-picker", DatePicker);
