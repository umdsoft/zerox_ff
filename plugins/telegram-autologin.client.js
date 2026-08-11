/**
 * Telegram WebApp AVTO-LOGIN
 * Bot ichida ("Open"/Launch) ilova ochilganda foydalanuvchi login/parol kiritmasin —
 * Telegram initData orqali avtomatik autentifikatsiya qilinadi.
 *
 * MUHIM: Telegram SDK (telegram-web-app.js) `defer` bilan yuklanadi va Nuxt plugini
 * undan OLDIN ishga tushishi mumkin. Shu sabab `window.Telegram` tayyor bo'lguncha
 * KUTAMIZ — aks holda initData bo'sh deb erta chiqib ketardi (avvalgi bug).
 *
 * Oqim: SDK kutamiz → initData bo'lsa (Mini App ichida) → POST /telegram/auth →
 * token → $auth.setUserToken → $auth.loggedIn reaktiv true bo'ladi → bosh sahifa
 * (index.vue) landing o'rniga dashboard ko'rsatadi. Xato bo'lsa jim (oddiy login).
 */

// Telegram WebApp SDK + initData tayyor bo'lguncha kutish.
// initData BO'SH-BO'LMAGUNCHA kutamiz (Mini App'da URL hash'dan biroz kechikib
// kelishi mumkin); belgilangan vaqtdan keyin bor holicha qaytaramiz.
function waitForTelegram(timeoutMs) {
  return new Promise((resolve) => {
    var start = Date.now();
    var tick = function () {
      var tg = (typeof window !== 'undefined' && window.Telegram) ? window.Telegram.WebApp : null;
      if (tg && typeof tg.initData === 'string' && tg.initData.length > 0) return resolve(tg);
      if (Date.now() - start > timeoutMs) return resolve(tg || null);
      setTimeout(tick, 100);
    };
    tick();
  });
}

export default async function ({ app, $axios }) {
  if (typeof window === 'undefined') return;

  const $auth = app.$auth;
  if (!$auth || $auth.loggedIn) return; // allaqachon kirgan

  // SDK ~4s gacha kutamiz (defer skript kechikishi mumkin)
  const tg = await waitForTelegram(4000);
  if (!tg) return; // Telegram muhiti emas

  try { tg.ready(); } catch (e) { /* ignore */ }

  const initData = tg.initData;
  if (!initData) return; // Mini App ichida emas (oddiy brauzer) — initData bo'sh

  try {
    const res = await $axios.post('/telegram/auth', { initData });
    const data = res && res.data && res.data.data;
    if (!res || !res.data || !res.data.success || !data || !data.token) return;

    // nuxt-auth: token o'rnatish + user/me. Versiyaga qarab 2 yo'l.
    try {
      if (typeof $auth.setUserToken === 'function') {
        await $auth.setUserToken(data.token);
      } else {
        $auth.strategy.token.set(data.token);
        await $auth.fetchUser();
      }
    } catch (e) {
      // fallback: kamida axios header + user olishga urinish
      $axios.setToken(data.token, 'Bearer');
      try { await $auth.fetchUser(); } catch (_) {}
    }

    // Kirdi — index.vue reaktiv ravishda dashboard ko'rsatadi.
    // Agar login/register sahifasida bo'lsak, bosh sahifaga o'tkazamiz.
    if ($auth.loggedIn) {
      const p = window.location.pathname || '';
      if (/\/auth\/(login|register)/.test(p) || /\/(login|register)$/.test(p)) {
        const home = (app.localePath && app.localePath('/')) || '/';
        try { app.router.replace(home); } catch (_) {}
      }
    }
  } catch (e) {
    if (typeof console !== 'undefined') console.error('Telegram autologin:', e && e.message);
  }
}
