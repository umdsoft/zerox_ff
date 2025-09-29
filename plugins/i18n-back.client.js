// plugins/i18n-back.client.js
export default ({ app }, inject) => {
  // Global stack (refreshlarda ham saqlansin)
  const stack = (window.__localeHistory = window.__localeHistory || []);

  const stripLocale = (path) => {
    if (!path) return '/';
    // /uz, /ru, /en-GB kabi prefikslarni kesadi
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

  // Faqat "haqiqiy" navigatsiyalarni stack’ga yozamiz
  app.router.beforeEach((to, from, next) => {
    if (from && from.name && !isPureLocaleSwitch(to, from)) {
      stack.push({
        name: baseName(from),
        params: { ...from.params },
        query: { ...from.query },
        _pathNoLocale: stripLocale(from.fullPath)
      });
    }
    next();
  });

  const backWithLocale = () => {
    const { i18n, localePath, switchLocalePath, router, route } = app;
    const prev = stack.pop();

    // Stack bo'sh bo'lsa — joriy sahifani joriy tilga "normalize"
    if (!prev) {
      // stay on the same page but enforce current locale
      const samePage = route && route.name
        ? localePath({ name: baseName(route), params: route.params, query: route.query }, i18n.locale)
        : switchLocalePath(i18n.locale);
      return router.replace(samePage);
    }

    // Nom bo'yicha
    if (prev.name) {
      const target = localePath(
        { name: prev.name, params: prev.params, query: prev.query },
        i18n.locale
      );
      return router.push(target);
    }

    // Path bo'yicha (fallback)
    const target2 = localePath(prev._pathNoLocale || '/', i18n.locale);
    return router.push(target2);
  };
  const goHomeWithLocale = (opts = { replace: false, query: null }) => {
    const { i18n, localePath, router } = app;
    // Root’ni joriy til bilan generatsiya qiladi
    const target = localePath('/', i18n.locale);

    // Agar query’ni ham olib borishni xohlasangiz:
    const withQuery = opts?.query
      ? `${target}${target.includes('?') ? '&' : '?'}${new URLSearchParams(opts.query).toString()}`
      : target;

    return opts?.replace ? router.replace(withQuery) : router.push(withQuery);
  };

  inject('goHomeWithLocale', goHomeWithLocale);
  // ✅ inject: komponentlarda this.$backWithLocale mavjud bo'ladi
  inject('backWithLocale', backWithLocale);
};
