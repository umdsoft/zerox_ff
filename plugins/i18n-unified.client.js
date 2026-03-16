// Unified i18n plugin - localStorage, history va helper funksiyalar
export default ({ app }, inject) => {
  const { i18n, router, localePath, switchLocalePath, route } = app;

  // 1. localStorage'dan tilni yuklash va o'rnatish (faqat client-side)
  if (process.client) {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && i18n.locale !== savedLanguage) {
      i18n.locale = savedLanguage;
    }

    // Til o'zgarganda localStorage'ga saqlash
    const updateLocalStorage = (newLocale) => {
      try {
        localStorage.setItem('app-language', newLocale);
      } catch (e) {
        // Ignore localStorage errors
      }
    };

    // i18n locale o'zgarishini kuzatish
    const originalSetLocale = i18n.setLocale;
    if (originalSetLocale) {
      i18n.setLocale = function (locale) {
        updateLocalStorage(locale);
        return originalSetLocale.call(this, locale);
      };
    }
  }

  // 2. History stack (global, sahifa yangilanganda ham saqlanadi)
  const stack = (window.__localeHistory = window.__localeHistory || []);

  // Helper funksiyalar
  const stripLocale = (path) => {
    if (!path) return '/';
    return path.replace(/^\/[A-Za-z-]{2,5}(?=\/|$)/, '') || '/';
  };

  const baseName = (route) =>
    route && route.name ? route.name.split('___')[0] : null;

  const isPureLocaleSwitch = (to, from) => {
    if (!to || !from) return false;
    const sameBase = baseName(to) && baseName(to) === baseName(from);
    const samePathNoLocale = stripLocale(to.path) === stripLocale(from.path);
    const differentFullPath = to.fullPath !== from.fullPath;
    return sameBase && samePathNoLocale && differentFullPath;
  };

  // 3. Router beforeEach - faqat haqiqiy navigatsiyalarni stack'ga yozamiz
  router.beforeEach((to, from, next) => {
    if (from && from.name && !isPureLocaleSwitch(to, from)) {
      stack.push({
        name: baseName(from),
        params: { ...from.params },
        query: { ...from.query },
        _pathNoLocale: stripLocale(from.fullPath),
      });
    }
    next();
  });

  // 4. Helper funksiya: Orqaga qaytish (locale bilan)
  const backWithLocale = () => {
    const prev = stack.pop();

    // Stack bo'sh bo'lsa — brauzer tarixidan orqaga qaytish
    if (!prev) {
      if (window.history.length > 1) {
        return router.go(-1);
      }
      // Hech qanday tarix yo'q — bosh sahifaga o'tish
      return router.replace(localePath('/', i18n.locale));
    }

    // Nom bo'yicha (query parametrlarni saqlash)
    if (prev.name) {
      const path = localePath(
        { name: prev.name, params: prev.params },
        i18n.locale
      );
      // localePath query-ni qo'llab-quvvatlamaydi, shuning uchun alohida uzatamiz
      const hasQuery = prev.query && Object.keys(prev.query).length > 0;
      return router.push(hasQuery ? { path, query: prev.query } : path);
    }

    // Path bo'yicha (fallback)
    const target2 = localePath(prev._pathNoLocale || '/', i18n.locale);
    return router.push(target2);
  };

  // 5. Helper funksiya: Bosh sahifaga o'tish (locale bilan)
  const goHomeWithLocale = (opts = { replace: false, query: null }) => {
    const target = localePath('/', i18n.locale);

    const withQuery = opts?.query
      ? `${target}${target.includes('?') ? '&' : '?'}${new URLSearchParams(
          opts.query
        ).toString()}`
      : target;

    return opts?.replace ? router.replace(withQuery) : router.push(withQuery);
  };

  // Inject helper funksiyalarni global qilish
  inject('backWithLocale', backWithLocale);
  inject('goHomeWithLocale', goHomeWithLocale);
  app.$backWithLocale = backWithLocale; // Backward compatibility
};
