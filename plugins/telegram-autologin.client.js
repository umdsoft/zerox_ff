/**
 * Telegram Mini App AVTO-LOGIN
 * Bot ichida ("Open App"/menu button) ilova ochilganda foydalanuvchi login/parol
 * kiritmasin — Telegram initData orqali avtomatik autentifikatsiya qilinadi.
 *
 * SS-DEV (2026-09-24) — ILDIZ SABABLAR (3–4-rasm: "Open App" login/landing ochardi):
 *  1) PLUGIN TARTIBI. `@nuxtjs/auth-next` o'z pluginini `options.plugins.push(...)`
 *     bilan OXIRIGA qo'shadi, `nuxt.config.plugins` dagi bu fayl esa undan OLDIN
 *     ishga tushardi → `app.$auth` hali `undefined` → plugin darhol chiqib ketardi
 *     (avtologin UMUMAN ishlamagan; telegram_id bog'langan foydalanuvchida ham).
 *     ENDI plugin `auth.plugins` orqali ro'yxatga olinadi (auth'dan keyin) va
 *     qo'shimcha ehtiyot uchun `window.onNuxtReady` ichida ishlaydi.
 *  2) BOOT'NI BLOKLASH. Plugin `await` bilan SDK'ni 4 s kutardi — Nuxt pluginlarni
 *     ketma-ket await qiladi, ya'ni oddiy brauzerda ham ilova 4 s kechikardi.
 *     ENDI hech narsa await qilinmaydi (fon oqimi); Telegram tashqarisida darhol
 *     chiqiladi (URL hash / sessionStorage'da tgWebApp belgisi yo'q).
 *  3) BOG'LANMAGAN TELEGRAM. `requestContact()` javobi (imzolangan `response`)
 *     endi to'g'ridan-to'g'ri `/telegram/auth` ga `contactResponse` sifatida
 *     yuboriladi — backend HMAC'ni tekshirib telefon bo'yicha MAVJUD hisobni
 *     telegram_id ga bog'laydi va darhol token beradi (bot `contact` xabarini
 *     kutish shart emas; bot handler zaxira sifatida qoladi).
 *  4) REFRESH. Backend endi sessiyali (jti/family) juftlik beradi; refresh token
 *     `tokenStorage` ga yoziladi — 30 daqiqadan keyin "Sessiya tugadi" bo'lmaydi.
 *
 * Oqim: Mini App belgisi → SDK+initData kutish (fon) → POST /telegram/auth →
 * token → $auth.setUserToken + refresh → to'liq qayta yuklash (socket/holat toza).
 * NOT_LINKED → requestContact → contactResponse bilan qayta → PHONE_NOT_REGISTERED
 * bo'lsa login/ro'yxat sahifasi qoladi (xabar bilan).
 *
 * SS-DEV (2026-09-24), hujjat-4 1-band — PIN-KOD:
 *  `/telegram/auth` endi sessiya BERMAYDI: `{ pin_required:true, pin_set, ticket }`
 *  (5 daqiqalik imzolangan ticket) qaytaradi. Plugin ticket'ni sessionStorage'ga
 *  (`zx_tg_pin`) yozib `/auth/tg-pin` sahifasiga o'tadi; u yerda PIN o'rnatiladi /
 *  kiritiladi (`POST /telegram/auth/pin` → token+refreshToken → `applyToken`).
 *  Telegram tashqarisida hech narsa o'zgarmaydi (plugin umuman ishga tushmaydi).
 *
 * `$tgAutologin` inject qilinadi: { isMiniApp(), run(), applyToken(), pinState(), clearPin() }.
 */

const PIN_KEY = 'zx_tg_pin'; // sessionStorage: { ticket, pinSet, exp }
const PIN_ROUTE = '/auth/tg-pin';

function readPinState() {
  try {
    const raw = window.sessionStorage && window.sessionStorage.getItem(PIN_KEY);
    if (!raw) return null;
    const st = JSON.parse(raw);
    if (!st || !st.ticket || (st.exp && Date.now() > st.exp)) return null;
    return st;
  } catch (_) { return null; }
}
function writePinState(st) {
  try { window.sessionStorage.setItem(PIN_KEY, JSON.stringify(st)); } catch (_) {}
}
function clearPinState() {
  try { window.sessionStorage.removeItem(PIN_KEY); } catch (_) {}
}

import { setRefreshToken } from '@/utils/tokenStorage';

const TG_HASH_RE = /tgWebAppData|tgWebAppPlatform|tgWebAppVersion/;

/** Mini App ichidamizmi — SDK yuklanishini kutmasdan tez tekshiruv. */
function looksLikeMiniApp() {
  if (typeof window === 'undefined') return false;
  try {
    if (TG_HASH_RE.test(window.location.hash || '')) return true;
    if (window.sessionStorage && window.sessionStorage.getItem('__telegram__initParams')) return true;
  } catch (_) { /* ignore */ }
  const tg = window.Telegram && window.Telegram.WebApp;
  return !!(tg && typeof tg.initData === 'string' && tg.initData.length > 0);
}

/** Telegram WebApp SDK + initData tayyor bo'lguncha kutish (100 ms qadam). */
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
 * POST /telegram/auth
 * Natija: { ok:true, token, refreshToken } | { ok:false, code }
 * 4xx axios'da xato bo'lmasin — `validateStatus` bilan o'zimiz ajratamiz.
 */
async function tgAuth($axios, initData, contactResponse) {
  const body = { initData };
  if (contactResponse) body.contactResponse = contactResponse;
  const res = await $axios.post('/telegram/auth', body, {
    silent: true,
    validateStatus: function (s) { return s >= 200 && s < 500; },
  });
  const data = res && res.data;
  // SS-DEV (2026-09-24): PIN bosqichi — sessiya o'rniga ticket
  if (data && data.success && data.pin_required && data.ticket) {
    return { ok: false, pinRequired: true, ticket: data.ticket, pinSet: !!data.pin_set, ttl: Number(data.ticket_ttl) || 300 };
  }
  if (data && data.success && data.data && data.data.token) {
    return { ok: true, token: data.data.token, refreshToken: data.data.refreshToken || null };
  }
  return { ok: false, code: (data && data.code) || ('HTTP_' + (res && res.status)) };
}

/**
 * Telegram `requestContact` → Promise<{ shared:boolean, response:string|null }>.
 * `response` — Bot API 7.2+ (`contact=...&auth_date=...&hash=...`, bot tokeni bilan imzolangan).
 */
function requestContact(tg) {
  return new Promise((resolve) => {
    try {
      if (!tg || typeof tg.requestContact !== 'function') return resolve({ shared: false, response: null });
      var done = false;
      var finish = function (shared, ev) {
        if (done) return; done = true;
        resolve({ shared: !!shared, response: (ev && typeof ev.response === 'string' && ev.response) || null });
      };
      // Ikkala kanal: callback (sent, event) va `contactRequested` hodisasi.
      try { tg.onEvent('contactRequested', function (ev) { finish(ev && ev.status === 'sent', ev); }); } catch (_) {}
      tg.requestContact(function (sent, ev) { finish(sent, ev); });
      setTimeout(function () { finish(false, null); }, 60000);
    } catch (e) { resolve({ shared: false, response: null }); }
  });
}

async function applyToken($auth, $axios, r) {
  if (r.refreshToken) { try { setRefreshToken(r.refreshToken); } catch (_) {} }
  try {
    if (typeof $auth.setUserToken === 'function') {
      await $auth.setUserToken(r.token);
    } else {
      $auth.strategy.token.set(r.token);
      await $auth.fetchUser();
    }
  } catch (e) {
    $axios.setToken(r.token, 'Bearer');
    try { await $auth.fetchUser(); } catch (_) {}
  }
}

function alertTg(tg, msg) { try { tg.showAlert(msg); } catch (_) { try { window.alert(msg); } catch (__) {} } }

function localeMsg(app, key) {
  const l = (app.i18n && app.i18n.locale) || 'uz';
  const t = {
    notRegistered: {
      uz: "Bu telefon raqami bilan ZeroX hisobi topilmadi. Avval saytda ro'yxatdan o'ting yoki login/parol bilan kiring.",
      ru: 'Аккаунт ZeroX с этим номером не найден. Сначала зарегистрируйтесь или войдите по логину/паролю.',
      kr: "Бу телефон рақами билан ZeroX ҳисоби топилмади. Аввал сайтда рўйхатдан ўтинг ёки логин/парол билан киринг.",
    },
    notShared: {
      uz: "Avtomatik kirish uchun telefon raqamingizni ulashing (yoki botga /start yuboring). Hozircha login/parol bilan kirishingiz mumkin.",
      ru: 'Для автоматического входа поделитесь номером телефона (или отправьте боту /start). Пока можно войти по логину/паролю.',
      kr: "Автоматик кириш учун телефон рақамингизни улашинг (ёки ботга /start юборинг). Ҳозирча логин/парол билан киришингиз мумкин.",
    },
  };
  return (t[key] && (t[key][l] || t[key].uz)) || '';
}

/**
 * Asosiy oqim. `opts.interactive` — login sahifasidagi tugma (xabarlar doim ko'rsatiladi).
 * Qaytaradi: true (kirdi) | false.
 */
async function run(ctx, opts) {
  const { app, $axios } = ctx;
  const $auth = app.$auth;
  if (typeof window === 'undefined' || !$auth) return false;
  if ($auth.loggedIn) return true;

  const tg = await waitForTelegram(opts && opts.interactive ? 8000 : 5000);
  if (!tg || !tg.initData) return false; // Telegram Mini App emas

  try { tg.ready(); } catch (_) {}

  try {
    let r = await tgAuth($axios, tg.initData, null);

    if (!r.ok && r.code === 'NOT_LINKED') {
      // Telegram hisobi ZeroX hisobiga bog'lanmagan — telefonni so'raymiz.
      const c = await requestContact(tg);
      if (c.shared && c.response) {
        r = await tgAuth($axios, tg.initData, c.response);
      }
      // Zaxira: bot `contact` handler bog'lashi mumkin — bir necha marta qayta urinamiz.
      if (c.shared && !r.ok && r.code !== 'PHONE_NOT_REGISTERED') {
        for (let i = 0; i < 8 && !r.ok; i++) {
          await sleep(2000);
          r = await tgAuth($axios, tg.initData, null);
          if (!r.ok && r.code !== 'NOT_LINKED') break;
        }
      }
      if (!r.ok) {
        if (r.code === 'PHONE_NOT_REGISTERED' || c.shared) alertTg(tg, localeMsg(app, 'notRegistered'));
        else if (opts && opts.interactive) alertTg(tg, localeMsg(app, 'notShared'));
        return false;
      }
    }

    // SS-DEV (2026-09-24), hujjat-4 1-band: PIN talab qilinadi — PIN sahifasiga o'tamiz.
    if (!r.ok && r.pinRequired) {
      writePinState({ ticket: r.ticket, pinSet: r.pinSet, exp: Date.now() + (r.ttl - 15) * 1000 });
      const target = (app.localePath && app.localePath(PIN_ROUTE)) || PIN_ROUTE;
      const cur = (app.router && app.router.currentRoute && app.router.currentRoute.path) || '';
      if (cur.indexOf(PIN_ROUTE) === -1) {
        try { await app.router.replace(target); } catch (_) { try { window.location.replace(target); } catch (__) {} }
      }
      return false;
    }

    if (!r.ok || !r.token) return false;

    await applyToken($auth, $axios, r);
    if (!$auth.loggedIn) return false;

    // Sayt logini kabi TO'LIQ QAYTA YUKLASH (socket, header, keshlar toza holda).
    // Mini App hash'i yo'qolsa ham SDK initData'ni sessionStorage'dan tiklaydi.
    const home = (app.localePath && app.localePath('/')) || '/';
    try { window.location.replace(home); } catch (_) { try { app.router.replace(home); } catch (__) {} }
    return true;
  } catch (e) {
    if (typeof console !== 'undefined') console.error('Telegram autologin:', e && e.message);
    return false;
  }
}

export default function (ctx, inject) {
  // Bir vaqtda faqat BITTA oqim (avto + login tugmasi ustma-ust tushmasin —
  // SDK ikkinchi `requestContact` ni 'WebAppContactRequested' bilan rad etadi).
  let inflight = null;
  const runOnce = function (opts) {
    if (inflight) return inflight;
    inflight = run(ctx, opts || {}).finally(function () { inflight = null; });
    return inflight;
  };
  inject('tgAutologin', {
    isMiniApp: looksLikeMiniApp,
    run: runOnce,
    // SS-DEV (2026-09-24): PIN sahifasi uchun
    pinState: readPinState,
    clearPin: clearPinState,
    applyToken: function (r) { return applyToken(ctx.app.$auth, ctx.$axios, r); },
  });

  if (typeof window === 'undefined' || !looksLikeMiniApp()) return; // oddiy brauzer — hech narsa

  // Boot'ni bloklamaymiz: ilova tayyor bo'lgach fon rejimida ishlaydi.
  const start = function () { runOnce({}); };
  if (typeof window.onNuxtReady === 'function') window.onNuxtReady(start);
  else setTimeout(start, 0);
}
