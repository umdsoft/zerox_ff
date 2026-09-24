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
 *
 * SS-DEV (2026-09-24): TELEFON BO'YICHA IDENTIFIKATSIYA. Backend `NOT_LINKED`
 * (telegram_id hech qaysi hisobga bog'lanmagan) qaytarsa — ilgari plugin jim
 * to'xtab, foydalanuvchi login sahifasini ko'rardi (9-rasm). Endi Telegram'ning
 * `requestContact()` (Bot API 6.9+) orqali telefon raqam so'raladi: foydalanuvchi
 * tasdiqlasa, kontakt BOTGA yuboriladi → bot `contact` handler (linkPhoneNumber)
 * telefon bo'yicha mavjud ZeroX hisobini shu telegram_id ga bog'laydi → plugin
 * `/telegram/auth` ni qayta chaqiradi (≈2 s oraliq, 10 urinish) → login/parolsiz kiradi.
 * Rad etsa yoki hisob topilmasa — oddiy login qoladi.
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

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/**
 * `POST /telegram/auth` — natija: { ok:true, token } | { ok:false, notLinked:true } | { ok:false }
 * 404 (NOT_LINKED) axios'da xato sifatida keladi — `validateStatus` bilan o'zimiz ajratamiz.
 */
async function tgAuth($axios, initData) {
  const res = await $axios.post('/telegram/auth', { initData }, {
    silent: true,
    validateStatus: function (s) { return s >= 200 && s < 500; },
  });
  const body = res && res.data;
  if (body && body.success && body.data && body.data.token) return { ok: true, token: body.data.token };
  if (body && body.code === 'NOT_LINKED') return { ok: false, notLinked: true };
  return { ok: false };
}

/** Telegram `requestContact` — Promise<boolean> (foydalanuvchi ulashdimi). */
function requestContact(tg) {
  return new Promise((resolve) => {
    try {
      if (!tg || typeof tg.requestContact !== 'function') return resolve(false);
      var done = false;
      tg.requestContact(function (sent) { if (!done) { done = true; resolve(!!sent); } });
      // Ba'zi mijozlarda callback kelmaydi — 60 s dan keyin "yo'q" deb hisoblaymiz.
      setTimeout(function () { if (!done) { done = true; resolve(false); } }, 60000);
    } catch (e) { resolve(false); }
  });
}

async function applyToken($auth, $axios, token) {
  // nuxt-auth: token o'rnatish + user/me. Versiyaga qarab 2 yo'l.
  try {
    if (typeof $auth.setUserToken === 'function') {
      await $auth.setUserToken(token);
    } else {
      $auth.strategy.token.set(token);
      await $auth.fetchUser();
    }
  } catch (e) {
    // fallback: kamida axios header + user olishga urinish
    $axios.setToken(token, 'Bearer');
    try { await $auth.fetchUser(); } catch (_) {}
  }
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
    let r = await tgAuth($axios, initData);

    if (!r.ok && r.notLinked) {
      // Telegram hisobi hali ZeroX hisobiga bog'lanmagan — telefonni so'raymiz.
      const shared = await requestContact(tg);
      if (shared) {
        // Bot kontaktni qabul qilib bog'lashi uchun bir oz vaqt kerak — qayta urinamiz.
        for (let i = 0; i < 10 && !r.ok; i++) {
          await sleep(2000);
          r = await tgAuth($axios, initData);
          if (!r.ok && !r.notLinked) break; // boshqa xato — to'xtaymiz
        }
      }
      if (!r.ok) {
        // Bog'lanmadi: foydalanuvchiga tushunarli xabar (oddiy login qoladi).
        try {
          tg.showAlert(shared
            ? "Telefon raqamingizga bog'langan ZeroX hisobi topilmadi. Avval saytda ro'yxatdan o'ting yoki login/parol bilan kiring."
            : "Avtomatik kirish uchun telefon raqamingizni bot bilan ulashing (botga /start yuboring). Hozircha login/parol bilan kirishingiz mumkin.");
        } catch (_) {}
        return;
      }
    }

    if (!r.ok || !r.token) return;

    await applyToken($auth, $axios, r.token);

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
