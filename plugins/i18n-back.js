// plugins/i18n-back.js
export default ({ app }) => {
  // Global, sahifa yangilanganda ham saqlansin
  if (!window.__localeHistory) window.__localeHistory = [];

  // Til prefiksini yechib tashlaydigan yordamchi (masalan: /uz/…, /ru/…)
  const stripLocale = (path) => {
    if (!path) return '';
    // 'prefix' va 'prefix_and_default' strategiyalariga mos
    return path.replace(/^\/[A-Za-z-]{2,5}(?=\/|$)/, '') || '/';
  };

  // i18n’da nomlar odatda name___uz/ru ko‘rinishida bo‘ladi — bazasini oling
  const baseName = (route) => (route && route.name ? route.name.split('___')[0] : null);

  // Faqat til almashinuvi bo‘lgan navigatsiyani aniqlash
  const isPureLocaleSwitch = (to, from) => {
    if (!to || !from) return false;
    const sameBase = baseName(to) && baseName(to) === baseName(from);
    const samePathNoLocale = stripLocale(to.path) === stripLocale(from.path);
    const differentFullPath = to.fullPath !== from.fullPath;
    return sameBase && samePathNoLocale && differentFullPath;
  };

  app.router.beforeEach((to, from, next) => {
    // Faqat "haqiqiy" (til almashinuvi bo'lmagan) o'tishda from’ni stack’ga qo‘shamiz
    if (from && from.name && !isPureLocaleSwitch(to, from)) {
      window.__localeHistory.push({
        // Bazaviy nom bo‘yicha marshrut quramiz
        name: baseName(from),
        // Param va query’ni saqlab qolamiz (localePath o‘zi prefiks qo‘shadi)
        params: { ...from.params },
        query: { ...from.query },
        // Qo‘shimcha ravishda bazaviy path’ni ham saqlaymiz (fallback uchun)
        _pathNoLocale: stripLocale(from.fullPath)
      });
    }
    next();
  });

  // Hamma joydan chaqira oladigan helper
  app.$backWithLocale = () => {
    const i18n = app.i18n;
    const history = window.__localeHistory || [];
    const prev = history.pop();

    // Hech nima topilmasa — hozirgi sahifaning o‘zi uchun joriy tilni ushlab qolamiz
    if (!prev) {
      const samePage = app.switchLocalePath(i18n.locale); // joriy sahifani joriy tilga majburan o‘rnatadi
      return app.router.replace(samePage);
    }

    // 1-variant: nom bor bo‘lsa — name asosida quramiz
    if (prev.name) {
      const target = app.localePath(
        { name: prev.name, params: prev.params, query: prev.query },
        i18n.locale
      );
      return app.router.push(target);
    }

    // 2-variant: nom yo‘q bo‘lsa — path (locale-siz) orqali
    const path = prev._pathNoLocale || '/';
    const target2 = app.localePath(path, i18n.locale);
    return app.router.push(target2);
  };
};
