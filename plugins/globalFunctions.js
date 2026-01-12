/**
 * ZeroX - Global Functions Plugin
 * Vue instance'ga global funksiyalar inject qilish
 *
 * Foydalanish: this.$formatNumber(1000000) -> "1 000 000"
 */
import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatPhone,
  getDaysRemaining,
  debounce,
  throttle,
  copyToClipboard,
} from '@/utils/helpers';

export default ({ app }, inject) => {
  // ============================================
  // Utils'dan import qilingan funksiyalar
  // ============================================
  inject('formatNumber', formatNumber);
  inject('formatCurrency', formatCurrency);
  inject('formatDate', formatDate);
  inject('formatPhone', formatPhone);
  inject('getDaysRemaining', getDaysRemaining);
  inject('debounce', debounce);
  inject('throttle', throttle);
  inject('copyToClipboard', copyToClipboard);

  // ============================================
  // Legacy funksiyalar (backward compatibility)
  // ============================================

  // Lotin harflarini kirillga o'zgartirish funksiyasi
  const latinToCyrillic = (text) => {
    const translitMap = {
      A: "А",
      B: "Б",
      D: "Д",
      E: "Е",
      F: "Ф",
      G: "Г",
      H: "Ҳ",
      I: "И",
      J: "Ж",
      K: "К",
      L: "Л",
      M: "М",
      N: "Н",
      O: "О",
      P: "П",
      Q: "Қ",
      R: "Р",
      S: "С",
      T: "Т",
      U: "У",
      V: "В",
      X: "Х",
      Y: "Й",
      Z: "З",
      a: "а",
      b: "б",
      d: "д",
      e: "е",
      f: "ф",
      g: "г",
      h: "ҳ",
      i: "и",
      j: "ж",
      k: "к",
      l: "л",
      m: "м",
      n: "н",
      o: "о",
      p: "п",
      q: "қ",
      r: "р",
      s: "с",
      t: "т",
      u: "у",
      v: "в",
      x: "х",
      y: "й",
      z: "з",
      Sh: "Ш",
      Ch: "Ч",
      Oʻ: "Ў",
      Gʻ: "Ғ",
      sh: "ш",
      ch: "ч",
      oʻ: "ў",
      gʻ: "ғ",
      Yo: "Ё",
      yo: "ё",
      Yu: "Ю",
      yu: "ю",
      Ya: "Я",
      ya: "я",
      ʻ: "ъ",
    };

    // "yev" bilan tugagan so'zlar uchun maxsus almashtirish
    text = text.replace(/([QGJKHRShY])ev\b/g, function (match, p1) {
      return p1.toLowerCase() === "q" || p1.toLowerCase() === "g"
        ? p1 + "ев"
        : p1 + "ев";
    });

    text = text.replace(/yev\b/g, "ев");
    text = text.replace(/Yev\b/g, "Ев");

    // Qolgan belgilarni almashtirish
    return text.replace(
      /Sh|Ch|Oʻ|Gʻ|Yo|Yu|Ya|sh|ch|oʻ|gʻ|yo|yu|ya|[A-Za-zʻ]/g,
      function (match) {
        return translitMap[match] || match;
      }
    );
  };

  // Oxirgi harfni olib tashlash funksiyasi
  const removeLastChar = (text) => {
    if (text.length > 0) {
      return text.slice(0, -1);
    }
    return text;
  };

  // Funksiyalarni inject qilamiz
  inject("latinToCyrillic", latinToCyrillic);
  inject("removeLastChar", removeLastChar);
};
