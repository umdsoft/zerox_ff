/**
 * SS-DEV (2026-09-29), 29.09 hujjati: ommaviy oferta — FAQAT "Qarz shartnomasi" moduli uchun.
 *
 * Ilgari identifikatsiyadan o'tgan, lekin ofertani tasdiqlamagan (is_contract != 1) foydalanuvchi
 * ko'plab sahifalarda (Qarz shartnomasi bosh sahifasi, Tariflar, Mobil hisob, QR-kod, Status,
 * Ulangan qurilmalar, Kabinet) `universal_contract` sahifasiga majburan yo'naltirilardi — saytning
 * boshqa bo'limlaridan ham foydalana olmasdi.
 *
 * Endi:
 *  - barcha bo'limlar (shu jumladan Qarz shartnomasi bosh sahifasi va ro'yxatlari) OCHIQ;
 *  - faqat shartnoma AMALI sahifalariga (qarz berish/olish oqimi, qaytarish, talab, uzaytirish,
 *    voz kechish) o'tishda oferta tasdiqlash oynasi ochiladi va o'tish to'xtatiladi;
 *  - backend shartnoma amali uchun 403 `OFERTA_REQUIRED` qaytarsa (plugins/axios.js) — xuddi shu oyna.
 * Oyna layouts/default.vue'da bitta joyda (`$oferta.state.open`) chiziladi.
 *
 * 01.10 (doc1 4-band): identifikatsiyadan (MyID — mobil ilovada) o'tgan, lekin ofertani hali
 * tasdiqlamagan foydalanuvchiga saytda oferta oynasi AVTOMATIK BIR MARTA ochiladi (ilova bilan
 * bir xil: identifikatsiya → oferta). Foydalanuvchi "orqaga" bilan tasdiqlamasdan chiqishi mumkin —
 * keyin oyna faqat shartnoma AMALIDA ochiladi (yuqoridagi qoida). "Bir marta" — foydalanuvchi
 * bo'yicha brauzerda eslab qolinadi (`localStorage`, bo'lmasa — sahifa xotirasida).
 *
 * 03.10 (mobil doc 1/2-rasm) — ILDIZ: identifikatsiya MOBIL ILOVADA (MyID) o'tiladi, sayt esa
 * `$auth.user` ni FAQAT sahifa to'liq yuklanganda (/user/me) olardi. Saytda ochiq turgan sessiyada
 * foydalanuvchi telefonda identifikatsiyadan o'tib saytga qaytsa ham `is_active` eski (0) qolardi —
 * shu sabab avtomatik oyna HECH QACHON ochilmasdi (va "Qarz berish" hali ham "identifikatsiyadan
 * o'ting" derdi). Endi identifikatsiyani KUTAYOTGAN foydalanuvchi uchun /user/me qayta so'raladi:
 * tab/oyna qayta faollashganda va socket bildirishnomasi kelganda (identifikatsiya — 25-tur
 * bildirishnoma). `is_active` 1 bo'lishi bilan `watchState('user')` oynani BIR MARTA ochadi.
 *
 * 03.10: tasdiqlangandan keyin to'xtatilgan amal DAVOM etadi (ilovadagi `guardOferta` kabi):
 * darvoza to'xtatgan o'tish yoki `require(action)` ga berilgan amal eslab qolinadi; oyna
 * tasdiqlamasdan yopilsa — amal bekor qilinadi.
 */
import Vue from 'vue';

// Qarz shartnomasi moduli — AMAL sahifalari (marshrut nomlari, til qo'shimchasisiz).
// Ko'rish sahifalari (contract-dashboard, debt-list, credit-list, expired, near-expiration,
// hisobot, contract) bu ro'yxatda YO'Q — ular ochiq qoladi.
export const OFERTA_ACTION_ROUTES = Object.freeze([
  'search',
  'search-physical',
  'search-result-type',
  'money-type',
  'treaded-users',
  'debt-demand',
  'debt-extend',
  'debt-extend-ask',
  'debt-refund',
  'debt-refund-type',
  'debt-waiver',
]);

/** Oferta talab qilinadimi: identifikatsiyadan o'tgan, lekin ofertani tasdiqlamagan foydalanuvchi */
export function needsOferta(user) {
  if (!user) return false;
  if (user.role === 'xodim') return false;
  return Number(user.is_active) === 1 && Number(user.is_contract) !== 1;
}

/** 'search___ru' → 'search' (nuxt-i18n marshrut nomi) */
export function baseRouteName(name) {
  return String(name || '').split('___')[0];
}

/** 01.10: avtomatik ochilish eslab qolinadigan kalit (foydalanuvchi bo'yicha). */
export const OFERTA_AUTO_KEY_PREFIX = 'zx_oferta_auto_shown:';

// Avtomatik ochilmaydigan sahifalar: oferta/tasdiqlash sahifalarining o'zi va kirish/ro'yxatdan o'tish.
const NO_AUTO_ROUTES = Object.freeze(['universal_contract', 'public-offer', 'privacy-policy']);

/**
 * Identifikatsiyadan keyin oferta oynasi AVTOMATIK ochilishi kerakmi (sof funksiya).
 * @param {Object|null} user
 * @param {string} routeName - joriy marshrut nomi (til qo'shimchasi bilan bo'lishi mumkin)
 * @param {boolean} alreadyShown - shu foydalanuvchiga avval avtomatik ko'rsatilganmi
 * @returns {boolean}
 */
export function shouldAutoOpen(user, routeName, alreadyShown) {
  if (alreadyShown || !needsOferta(user) || user.id === undefined || user.id === null) return false;
  const base = baseRouteName(routeName);
  if (!base || base.indexOf('auth') === 0 || NO_AUTO_ROUTES.includes(base)) return false;
  return true;
}

// localStorage bo'lmasa (maxfiy rejim / bloklangan) — sahifa xotirasida
const memoryShown = new Set();

function wasAutoShown(userId) {
  const key = OFERTA_AUTO_KEY_PREFIX + userId;
  if (memoryShown.has(key)) return true;
  try {
    return window.localStorage.getItem(key) === '1';
  } catch (_) {
    return false;
  }
}

function markAutoShown(userId) {
  const key = OFERTA_AUTO_KEY_PREFIX + userId;
  memoryShown.add(key);
  try {
    window.localStorage.setItem(key, '1');
  } catch (_) {
    /* localStorage yo'q — sahifa xotirasi yetarli */
  }
}

/**
 * 03.10: foydalanuvchi identifikatsiyadan o'tishini KUTYAPTIMI (kirgan, xodim emas, is_active != 1).
 * Faqat shunday foydalanuvchi uchun /user/me qayta so'raladi (qolganlarga ortiqcha so'rov yo'q).
 */
export function awaitsIdentification(user) {
  if (!user || user.id === undefined || user.id === null) return false;
  if (user.role === 'xodim' || user.is_xodim) return false;
  return Number(user.is_active) !== 1;
}

// /user/me qayta so'rash oralig'i (ms): fokus/ko'rinish — kamroq, socket bildirishnomasi — tezroq
const REFRESH_ON_FOCUS_MS = 15000;
const REFRESH_ON_SOCKET_MS = 3000;

export default ({ app }, inject) => {
  const state = Vue.observable({ open: false });
  // Tasdiqlangandan keyin bajariladigan amal (oyna tasdiqlamasdan yopilsa — bekor)
  let pendingAction = null;

  const api = {
    state,
    needed() {
      return needsOferta(app.$auth && app.$auth.user);
    },
    /** @param {Function} [action] — tasdiqlangandan keyin bajariladi */
    open(action) {
      pendingAction = typeof action === 'function' ? action : null;
      state.open = true;
    },
    /** Tasdiqlamasdan yopish — to'xtatilgan amal bekor qilinadi */
    close() {
      pendingAction = null;
      state.open = false;
    },
    /** Oferta tasdiqlandi — oyna yopiladi va to'xtatilgan amal davom etadi */
    accepted() {
      const action = pendingAction;
      pendingAction = null;
      state.open = false;
      if (!action) return;
      try {
        action();
      } catch (_) {
        /* amal o'z xatosini o'zi ko'rsatadi */
      }
    },
    /**
     * Shartnoma amalidan oldin chaqiriladi.
     * @param {Function} [action] — tasdiqlangandan keyin avtomatik bajariladi
     * @returns {boolean} true — davom etish mumkin; false — oferta oynasi ochildi
     */
    require(action) {
      if (!api.needed()) return true;
      api.open(action);
      return false;
    },
  };

  inject('oferta', api);

  /**
   * 01.10: identifikatsiyadan o'tgan, ofertani tasdiqlamagan foydalanuvchiga BIR MARTA avtomatik.
   * Chaqiriladi: ilova tayyor bo'lganda, `user` o'zgarganda (masalan /user/me yangilanib is_active=1
   * bo'lganda) va har bir o'tishdan keyin. Oyna allaqachon ochiq bo'lsa — hech narsa qilinmaydi.
   */
  const autoOpenIfNeeded = () => {
    try {
      const auth = app.$auth;
      if (!auth || !auth.loggedIn || state.open) return;
      const user = auth.user;
      const route = app.router && app.router.currentRoute;
      const shown = user && user.id !== undefined && user.id !== null ? wasAutoShown(user.id) : true;
      if (!shouldAutoOpen(user, route && route.name, shown)) return;
      markAutoShown(user.id);
      api.open();
    } catch (_) {
      /* avtomatik ochilish ikkinchi darajali — xato saytni to'xtatmasin */
    }
  };
  api.autoOpenIfNeeded = autoOpenIfNeeded;

  /**
   * 03.10 ILDIZ tuzatishi: identifikatsiyani kutayotgan foydalanuvchi ma'lumotini yangilash.
   * Identifikatsiya mobil ilovada o'tadi — saytdagi sessiya buni o'zi bilmaydi.
   */
  let lastRefreshAt = 0;
  let refreshing = false;
  const refreshUserIfAwaiting = (minIntervalMs) => {
    try {
      const auth = app.$auth;
      if (!auth || !auth.loggedIn || refreshing || !awaitsIdentification(auth.user)) return;
      const now = Date.now();
      if (now - lastRefreshAt < minIntervalMs) return;
      lastRefreshAt = now;
      refreshing = true;
      Promise.resolve(auth.fetchUser())
        .catch(() => { /* tarmoq xatosi — keyingi fokusda qayta uriniladi */ })
        .then(() => { refreshing = false; });
    } catch (_) {
      refreshing = false;
    }
  };

  const watchIdentification = () => {
    const onFocus = () => refreshUserIfAwaiting(REFRESH_ON_FOCUS_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') onFocus();
    });
    window.addEventListener('focus', onFocus);
    // Identifikatsiya tugaganda backend bildirishnoma (25-tur) yaratadi — socket orqali keladi
    const sm = app.$socketManager;
    if (sm && typeof sm.subscribe === 'function') {
      sm.subscribe('recive_notification', () => refreshUserIfAwaiting(REFRESH_ON_SOCKET_MS));
    }
  };

  if (typeof window !== 'undefined' && typeof window.onNuxtReady === 'function') {
    window.onNuxtReady(() => {
      autoOpenIfNeeded();
      const storage = app.$auth && app.$auth.$storage;
      if (storage && typeof storage.watchState === 'function') {
        storage.watchState('user', () => autoOpenIfNeeded());
      }
      watchIdentification();
    });
  }

  if (!app.router) return;
  // Darvoza oynani ochib, BOSHQA sahifaga yo'naltirgan o'tish — oyna shu o'tishda yopilmasin
  let keepOpenOnNextNav = false;
  app.router.beforeEach((to, from, next) => {
    if (!OFERTA_ACTION_ROUTES.includes(baseRouteName(to.name)) || !api.needed()) return next();
    // 03.10: tasdiqlangach — to'xtatilgan sahifaga avtomatik o'tiladi
    const target = to.fullPath;
    api.open(() => {
      app.router.push(target).catch(() => { /* o'sha sahifa — jim */ });
    });
    // Ilova ichidagi o'tish — joyida qolamiz (oyna ochiladi)
    if (from && from.matched && from.matched.length) return next(false);
    // To'g'ridan-to'g'ri havola bilan kirish — Qarz shartnomasi bosh sahifasiga (oyna ochiq)
    keepOpenOnNextNav = true;
    const fallback = (app.localePath && app.localePath({ name: 'contract-dashboard' })) || '/contract-dashboard';
    return next(fallback);
  });
  app.router.afterEach((to, from) => {
    // 01.10: oyna ochiq turganda BOSHQA sahifaga o'tildi (masalan brauzerning "orqaga" tugmasi) —
    // oyna yopiladi (ilovadagi "orqaga" bilan bir xil: tasdiqlamasdan chiqish). Faqat query
    // o'zgarishi (sahifa ichidagi router.replace) oynani yopmaydi.
    const pathChanged = !from || !to || from.path !== to.path;
    if (keepOpenOnNextNav) keepOpenOnNextNav = false;
    else if (state.open && pathChanged) api.close();
    // O'tish yakunlangach — keyingi tikda avtomatik ochilish tekshiruvi
    setTimeout(autoOpenIfNeeded, 0);
  });
};
