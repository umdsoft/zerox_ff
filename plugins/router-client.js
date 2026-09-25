export default ({ app }) => {
  // Sahifa yuklanganda
  app.router.beforeEach((to, from, next) => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && savedLanguage !== app.i18n.locale) {
      app.i18n.setLocale(savedLanguage);
    }
    next();
  });

  // Til o'zgarganda uni saqlash
  // SS-PERF (2026-09-25): ilgari `onLanguageSwitched` bu yerda USTIDAN YOZILARDI — plugins/datepicker.js
  // o'rnatgan hook (til almashganda sana tanlagich lokali) yo'qolardi. Endi avvalgi hook zanjirlanadi.
  const prev = app.i18n.onLanguageSwitched;
  app.i18n.onLanguageSwitched = function (oldLocale, newLocale) {
    localStorage.setItem('app-language', newLocale);
    if (typeof prev === 'function') return prev.apply(this, arguments);
  };
}
