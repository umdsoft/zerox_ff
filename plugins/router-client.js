export default ({ app }) => {
  // Sahifa yuklanganda
  app.router.beforeEach((to, from, next) => {
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage && savedLanguage !== app.i18n.locale) {
      app.i18n.setLocale(savedLanguage);
    }
    next();
  });

  // Til o'zgarganda uni saqlash
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    localStorage.setItem('userLanguage', newLocale);
  };
}
