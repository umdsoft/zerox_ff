// plugins/i18n.js

export default ({ app }) => {
  // Bu kod faqat mijoz tomonida (brauzerda) ishlaydi, chunki localStorage faqat u yerda mavjud.
  if (process.client) {
    const savedLanguage = localStorage.getItem('app-language');

    // Agar localStorage'da til saqlangan bo'lsa va u hozirgi ilovaning tilidan farq qilsa,
    // ilovaning tilini saqlangan tilga o'rnatamiz.
    if (savedLanguage && app.i18n.locale !== savedLanguage) {
      app.i18n.locale = savedLanguage;
    }
  }
}
