export default function ({ app }) {
  if (process.client) { // ⬅️ SSR paytida localStorage yo‘q
    const saved = localStorage.getItem('app-language');
    if (saved && app.i18n) {
      // cookie ham yangilab qo'yamiz — nuxt-i18n defaultga qaytarmasin
      app.i18n.setLocaleCookie?.(saved);

      // prefer setLocale (agar mavjud bo‘lsa)
      if (typeof app.i18n.setLocale === 'function') {
        app.i18n.setLocale(saved);
      } else {
        app.i18n.locale = saved;
      }
    }
  }
}
