/**
 * Telegram WebApp AVTO-LOGIN
 * Bot ichida ("Open"/Launch) ilova ochilganda foydalanuvchi login/parol kiritmasin —
 * Telegram initData orqali avtomatik autentifikatsiya qilinadi.
 *
 * Oqim: initData bor + hali kirmagan bo'lsa → POST /telegram/auth → token →
 * $auth.setUserToken(token) (user/me avtomatik olinadi) → login sahifasidan bosh
 * sahifaga o'tkaziladi. Xato bo'lsa — jim (oddiy login ko'rinadi).
 */
export default async function ({ app, $axios }) {
  if (typeof window === 'undefined') return;
  const tg = window.Telegram && window.Telegram.WebApp;
  const initData = tg && tg.initData;
  if (!initData) return; // Telegram WebApp ichida emas

  const $auth = app.$auth;
  if (!$auth || $auth.loggedIn) return; // allaqachon kirgan

  try {
    const res = await $axios.post('/telegram/auth', { initData });
    const data = res && res.data && res.data.data;
    if (!res || !res.data || !res.data.success || !data || !data.token) return;

    // nuxt-auth: token + user/me. Versiyaga qarab setUserToken yoki strategy.token.set
    try {
      if (typeof $auth.setUserToken === 'function') {
        await $auth.setUserToken(data.token);
      } else {
        $auth.strategy.token.set(data.token);
        await $auth.fetchUser();
      }
    } catch (e) {
      // fallback: kamida axios header
      $axios.setToken(data.token, 'Bearer');
      try { await $auth.fetchUser(); } catch (_) {}
    }

    // Login/landing sahifasida bo'lsa — bosh sahifaga o'tkazamiz
    if ($auth.loggedIn) {
      const p = window.location.pathname || '';
      if (p === '/' || /\/auth\/(login|register)/.test(p) || /\/(login|register)/.test(p)) {
        const home = (app.localePath && app.localePath('/')) || '/';
        try { app.router.replace(home); } catch (_) {}
      }
    }
  } catch (e) {
    // Avto-login muvaffaqiyatsiz — oddiy login sahifasi ko'rsatiladi
    if (typeof console !== 'undefined') console.error('Telegram autologin:', e && e.message);
  }
}
