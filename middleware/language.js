export default function ({ app }) {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && app.i18n.locale !== savedLanguage) {
      app.i18n.locale = savedLanguage;
    }
  }