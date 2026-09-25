/**
 * ZeroX - Axios Plugin
 * API so'rovlarini boshqarish, retry logikasi va xatolik qayta ishlash
 */

import {
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
} from '@/utils/tokenStorage';
import { clearUserSession } from '@/utils/session'; // SS-SEC (2026-09-25)

// SS-AUDIT (2026-09-25): ishlatilmagan ERROR_CODES importi olib tashlandi

// ============================================
// Konstantalar
// ============================================
const CONFIG = {
  MAX_RETRIES: 1, // SS-PERF (2026-09-25): faqat 1 marta qayta urinish (GET, 5xx/tarmoq), exponential backoff
  RETRY_BASE_DELAY: 1000, // 1 sekund (exponential backoff uchun baza)
  SKIP_LOADING_URLS: ['/user/me', '/dashboard/get-time', '/notification/me'],
  SKIP_AUTH_REDIRECT_URLS: ['/user/login', '/user/register', '/user/phoneChangeReg', '/user/refresh-token'],
  NETWORK_ERROR_CODES: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'NETWORK_ERROR'],
};

// Refresh token state
let isRefreshing = false;
let failedQueue = [];
let isLoggingOut = false;
let lastNetworkErrorToast = 0;
let lastSessionLogoutTime = 0;
const NETWORK_ERROR_TOAST_COOLDOWN = 5000; // 5 sekund

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      // Logout jarayonida reject qilmaymiz — component catch blocklari toast chiqarmasin
      if (!isLoggingOut) {
        prom.reject(error);
      }
      // isLoggingOut bo'lsa promise pending qoladi (component catch ishlamaydi)
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ============================================
// Error Messages (i18n fallback)
// ============================================
const ERROR_MESSAGES = {
  uz: {
    network: 'Internet aloqasi yo\'q. Aloqani tekshiring.',
    timeout: 'Server javob bermayapti. Qayta urinib ko\'ring.',
    forbidden: 'Ushbu amalni bajarish uchun ruxsat yo\'q.',
    notFound: 'So\'ralgan ma\'lumot topilmadi.',
    tooManyRequests: 'Juda ko\'p so\'rov. Biroz kuting.',
    serverError: 'Server xatosi. Qayta urinib ko\'ring.',
    unknown: 'Noma\'lum xatolik yuz berdi.',
    sessionExpired: 'Sessiya tugadi. Iltimos, qaytadan kiring.',
  },
  ru: {
    network: 'Нет подключения к интернету. Проверьте соединение.',
    timeout: 'Сервер не отвечает. Попробуйте снова.',
    forbidden: 'Нет разрешения для этого действия.',
    notFound: 'Запрошенные данные не найдены.',
    tooManyRequests: 'Слишком много запросов. Подождите немного.',
    serverError: 'Ошибка сервера. Попробуйте снова.',
    unknown: 'Произошла неизвестная ошибка.',
    sessionExpired: 'Сессия истекла. Пожалуйста, войдите заново.',
  },
  kr: {
    network: 'Интернет алоқаси йўқ. Алоқани текширинг.',
    timeout: 'Сервер жавоб бермаяпти. Қайта уриниб кўринг.',
    forbidden: 'Ушбу амални бажариш учун рухсат йўқ.',
    notFound: 'Сўралган маълумот топилмади.',
    tooManyRequests: 'Жуда кўп сўров. Бироз кутинг.',
    serverError: 'Сервер хатоси. Қайта уриниб кўринг.',
    unknown: 'Номаълум хатолик юз берди.',
    sessionExpired: 'Сессия тугади. Илтимос, қайтадан киринг.',
  },
  // SS-DEV (2026-09-26): en/kaa
  en: {
    network: 'No internet connection. Check your connection.',
    timeout: 'The server is not responding. Please try again.',
    forbidden: 'You do not have permission to perform this action.',
    notFound: 'The requested data was not found.',
    tooManyRequests: 'Too many requests. Please wait a moment.',
    serverError: 'Server error. Please try again.',
    unknown: 'An unknown error occurred.',
    sessionExpired: 'Your session has expired. Please log in again.',
  },
  kaa: {
    network: 'Internet baylanısı joq. Baylanıstı tekseriń.',
    timeout: 'Server juwap bermey atır. Qayta urınıp kóriń.',
    forbidden: 'Bul ámeldi orınlaw ushın ruqsat joq.',
    notFound: 'Soralǵan maǵlıwmat tabılmadı.',
    tooManyRequests: 'Júdá kóp soraw. Biraz kútiń.',
    serverError: 'Server qáteligi. Qayta urınıp kóriń.',
    unknown: 'Belgisiz qátelik júz berdi.',
    sessionExpired: 'Sessiya tamamlandı. Iltimas, qaytadan kiriń.',
  },
};

export default function ({ $axios, $config, store, redirect, app }, inject) {
  // Timeout qiymatini runtime config'dan olish
  const timeout = $config?.apiTimeout || 30000;
  $axios.defaults.timeout = timeout;

  /**
   * Sessiya tugaganda bir marta logout qilish va xabar ko'rsatish
   * Bir nechta 401 xatolik bir vaqtda kelganda faqat bitta toast chiqadi
   */
  const performSessionLogout = () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    lastSessionLogoutTime = Date.now();

    // Sessiya tugadi flagini saqlash (login sahifada ko'rsatiladi — faqat u yerda toast chiqadi)
    try { sessionStorage.setItem('session_expired', '1'); } catch {}

    try {
      clearRefreshToken();
      // $auth.logout() o'rniga tokenni qo'lda tozalash (logout redirect dan qochish uchun)
      if (app.$auth) {
        app.$auth.strategy.token.reset();
        app.$auth.$storage.setUniversal('loggedIn', false);
      }
    } catch {
      // Silent fail
    }

    // Xodim sessiyasi bo'lsa — egasining login sahifasiga emas, xodim
    // login sahifasiga qaytaramiz (xodimda refresh token yo'q; har qanday
    // 401 da shu yo'l ishlaydi).
    let isXodimSession = false;
    try { isXodimSession = localStorage.getItem('zx_xodim_session') === '1'; } catch {}

    const loginPath = isXodimSession
      ? (app.localePath?.({ name: 'qarz-daftari-xodim-login' }) || '/qarz-daftari/xodim-login')
      : (app.localePath?.({ name: 'auth-login' }) || '/auth/login');
    // B32-3: sessiya tugaganda ham BARCHA per-user keshlar tozalansin + socket uzilsin
    // (keyingi foydalanuvchiga eski balans/bildirishnoma oqib kirmasin).
    // SS-SEC (2026-09-25): kalitlar ro'yxati utils/session.js da (logout bilan bir xil).
    clearUserSession();
    try { if (app.$socketManager && app.$socketManager.disconnect) app.$socketManager.disconnect(); } catch {}
    redirect(loginPath);

    // 5 sekunddan keyin flagni tiklash (qayta login uchun)
    setTimeout(() => { isLoggingOut = false; }, 5000);
  };
  // SS-DEV (2026-09-23): socket orqali "sessiya tugatildi" kelganda ham AYNAN shu
  // logout ishlatiladi (plugins/socket.client.js) — bitta yo'l, bitta xatti-harakat.
  inject('sessionLogout', performSessionLogout);

  // ============================================
  // BaseURL Configuration
  // ============================================
  // MUHIM: Frontend va backend ALOHIDA Cloudflare tunnel'larda ishlaydi
  // nuxt.config.js dagi API_BASE_URL da backend URL to'g'ri sozlangan bo'lishi kerak
  // Dinamik override QILINMAYDI - config'dagi URL ishlatiladi
  // SS-AUDIT (2026-09-25): baseURL console.log olib tashlandi

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Joriy tilga mos xabar olish
   * @param {string} key - Xabar kaliti
   * @returns {string}
   */
  const getMessage = (key) => {
    const locale = app?.i18n?.locale || 'uz';
    const messages = ERROR_MESSAGES[locale] || ERROR_MESSAGES.uz;
    return messages[key] || messages.unknown;
  };

  /**
   * Retry kerakmi tekshirish
   * @param {Error} error - Axios error
   * @returns {boolean}
   */
  const shouldRetry = (error) => {
    // POST, PUT, DELETE, PATCH — qayta yuborish XAVFLI (duplikat yaratadi)
    const method = error.config?.method?.toUpperCase?.();
    if (method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return false;
    }

    // Network xatosi
    if (!error.response) {
      return CONFIG.NETWORK_ERROR_CODES.includes(error.code);
    }

    // Faqat 5xx server xatolari uchun retry (502, 503, 504)
    const status = error.response.status;
    return status === 502 || status === 503 || status === 504;
  };

  /**
   * Loading ko'rsatish kerakmi tekshirish
   * @param {Object} config - Request config
   * @returns {boolean}
   */
  const shouldShowLoading = (config) => {
    // Explicit false loading
    if (config?.falseLoading === true) return false;

    // Background request
    if (config?.background === true) return false;

    // URL'ni tekshirish
    return !CONFIG.SKIP_LOADING_URLS.some((url) => config.url?.includes(url));
  };

  /**
   * Toast ko'rsatish kerakmi tekshirish
   * @param {Object} config - Request config
   * @param {number} status - HTTP status
   * @returns {boolean}
   */
  const shouldShowToast = (config, status) => {
    // Silent mode
    if (config?.silent === true) return false;

    // 404 uchun alohida flag
    if (status === 404 && config?.silent404 !== false) return false;

    return true;
  };

  // ============================================
  // SS-PERF (2026-09-25): GET dedupe + sahifa o'zgarganda bekor qilish
  // ============================================
  // 1) Bir xil GET (URL+params) parallel chaqirilsa — bitta HTTP so'rov, ikkinchisi javob NUSXASINI
  //    oladi (komponentlar javobni joyida o'zgartirishi mumkin).
  // 2) Sahifa (path) o'zgarganda joriy sahifaning tugallanmagan GET'lari bekor qilinadi — eskirgan
  //    javob yangi sahifaga tushmaydi, tarmoq bo'shaydi. Bekor qilingan so'rov promise'i hech qachon
  //    hal bo'lmaydi (komponent catch'ida toast chiqmasin — logout'dagi bilan bir xil yondashuv).
  //    Layout darajasidagi (falseLoading/background/SKIP_LOADING_URLS) va blob so'rovlar tegilmaydi;
  //    `noCancel: true` bilan har qanday so'rovni istisno qilish mumkin.
  const pendingGets = new Map();
  const routeCancels = new Set();

  const isRouteCancelable = (config) => {
    if (!config || (config.method || 'get').toLowerCase() !== 'get') return false;
    if (config.noCancel === true || config.background === true || config.falseLoading === true) return false;
    if (config.responseType === 'blob' || config.responseType === 'arraybuffer') return false;
    if (CONFIG.SKIP_LOADING_URLS.some((url) => config.url?.includes(url))) return false;
    return true;
  };

  const dedupeKey = (config) => {
    let params = '';
    try { params = JSON.stringify(config.params || {}); } catch { return null; }
    return `${isRouteCancelable(config) ? 'p' : 'g'}|${config.baseURL || ''}|${config.url}|${params}`;
  };

  const cloneResponse = (res) => {
    if (!res || typeof res !== 'object') return res;
    let data = res.data;
    try { if (data && typeof data === 'object') data = JSON.parse(JSON.stringify(data)); } catch { /* asl nusxa */ }
    return { ...res, data };
  };

  const baseAdapter = $axios.defaults.adapter;
  if (typeof baseAdapter === 'function') {
    $axios.defaults.adapter = (config) => {
      const method = (config.method || 'get').toLowerCase();
      if (method !== 'get' || config.dedupe === false ||
          config.responseType === 'blob' || config.responseType === 'arraybuffer') {
        return baseAdapter(config);
      }
      const key = dedupeKey(config);
      if (!key) return baseAdapter(config);
      const pending = pendingGets.get(key);
      if (pending) return pending.then(cloneResponse);
      const p = baseAdapter(config).finally(() => pendingGets.delete(key));
      pendingGets.set(key, p);
      return p;
    };
  }

  const releaseCancel = (config) => {
    if (config && config.__zxCancel) {
      routeCancels.delete(config.__zxCancel);
      config.__zxCancel = null;
    }
  };

  if (app.router && $axios.CancelToken) {
    app.router.beforeEach((to, from, next) => {
      if (from && to && to.path !== from.path && routeCancels.size) {
        routeCancels.forEach((source) => { try { source.cancel('route-change'); } catch { /* jim */ } });
        routeCancels.clear();
      }
      next();
    });
  }

  // ============================================
  // Request Interceptor
  // ============================================
  $axios.onRequest((config) => {
    // SS-PERF (2026-09-25): sahifa o'zgarganda bekor qilinadigan GET'larga cancel token
    if ($axios.CancelToken && !config.cancelToken && isRouteCancelable(config)) {
      const source = $axios.CancelToken.source();
      config.cancelToken = source.token;
      config.__zxCancel = source;
      routeCancels.add(source);
    }

    // BaseURL config'dan olinadi, dinamik override yo'q
    // nuxt.config.js da to'g'ri backend URL sozlangan bo'lishi kerak

    // Loading state
    if (shouldShowLoading(config)) {
      store.commit('START_LOADING');
    }

    // NOTE: X-Requested-With custom header OLIB TASHLANDI.
    // Sabab: bu "non-simple" header har POST/PUT/DELETE/PATCH so'rovida
    // CORS preflight (OPTIONS) ni majburlardi. Backend oldidagi nginx
    // preflight'ni handle qilmagani uchun so'rovlar backendga yetmasdi.
    // CSRF himoya allaqachon JWT Bearer token orqali ta'minlanadi
    // (backend'da csrfProtection middleware o'chirilgan).

    // Retry counter
    if (typeof config.retryCount !== 'number') {
      config.retryCount = 0;
    }

    // Request timestamp (timeout tracking uchun)
    config.metadata = { startTime: Date.now() };

    return config;
  });

  // ============================================
  // Response Interceptor
  // ============================================
  $axios.onResponse((response) => {
    store.commit('STOP_LOADING');
    releaseCancel(response && response.config); // SS-PERF (2026-09-25)

    // Response time logging (development only)
    if (process.env.NODE_ENV !== 'production') {
      const duration = Date.now() - (response.config?.metadata?.startTime || Date.now());
      if (duration > 3000) {
        console.warn(`[Axios] Slow request: ${response.config?.url} (${duration}ms)`);
      }
    }

    return response;
  });

  // ============================================
  // Error Interceptor
  // ============================================
  $axios.onError((error) => {
    store.commit('STOP_LOADING');

    const config = error.config || {};
    releaseCancel(config);

    // SS-PERF (2026-09-25): sahifa o'zgarganda bekor qilingan so'rov — jim (hal bo'lmaydigan promise)
    if (typeof $axios.isCancel === 'function' && $axios.isCancel(error)) {
      return new Promise(() => {});
    }
    const status = error.response?.status;
    const isNetworkError = !error.response;

    // ========== Retry Logic (Exponential Backoff) ==========
    if (shouldRetry(error) && config.retryCount < CONFIG.MAX_RETRIES) {
      config.retryCount += 1;
      const jitter = Math.random() * 300;
      const delay = CONFIG.RETRY_BASE_DELAY * Math.pow(2, config.retryCount - 1) + jitter;

      return new Promise((resolve) => {
        setTimeout(() => resolve($axios(config)), delay);
      });
    }

    // ========== Network Error ==========
    if (isNetworkError) {
      // Logout jarayonida — barcha xatoliklarni jim o'tkazish
      if (isLoggingOut) {
        return new Promise(() => {});
      }

      // Session logout'dan keyin qisqa vaqt ichida network error chiqmasin
      // (concurrent so'rovlar session logout bilan bir vaqtda fail bo'lganda)
      const timeSinceLogout = Date.now() - lastSessionLogoutTime;
      if (lastSessionLogoutTime > 0 && timeSinceLogout < NETWORK_ERROR_TOAST_COOLDOWN) {
        return Promise.reject(error);
      }

      // MUHIM (S2 fix): NETWORK xatosi (server/tunnel vaqtincha yetib bo'lmaydi)
      // SESSIYANI BUZMAYDI. JWT hali yaroqli — faqat tarmoq uzilgan. Ilgari bu yerda
      // performSessionLogout() chaqirilardi va foydalanuvchi ishlab turib "o'zidan o'zi"
      // tizimdan chiqib ketardi (tunnel/server bir lahzalik uzilishida). Endi: logout
      // YO'Q — throttled toast + reject; tarmoq tiklangach keyingi so'rovlar ishlaydi.
      const wasLoggedIn = app.$auth?.loggedIn || getRefreshToken();
      if (wasLoggedIn) {
        if (config?.silent === true) {
          return Promise.reject(error);
        }
        const nowNet = Date.now();
        if (nowNet - lastNetworkErrorToast > NETWORK_ERROR_TOAST_COOLDOWN && shouldShowToast(config, null)) {
          lastNetworkErrorToast = nowNet;
          if (error.code === 'ECONNABORTED') {
            app.$toast?.error?.(getMessage('timeout'));
          } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
            app.$toast?.error?.(getMessage('network'));
          }
        }
        return Promise.reject(error);
      }

      // Haqiqiy network error (foydalanuvchi umuman kirmaganida)
      const now = Date.now();
      const canShowNetworkToast = (now - lastNetworkErrorToast > NETWORK_ERROR_TOAST_COOLDOWN);

      if (canShowNetworkToast && shouldShowToast(config, null)) {
        lastNetworkErrorToast = now;
        if (error.code === 'ECONNABORTED') {
          // Timeout — server javob bermayapti
          app.$toast?.error?.(getMessage('timeout'));
        } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
          // Faqat haqiqatdan internet aloqasi yo'q bo'lganda ko'rsatish
          app.$toast?.error?.(getMessage('network'));
        }
        // navigator.onLine === true, lekin server unreachable — toast ko'rsatmaymiz
        // (server/tunnel muammosi, foydalanuvchi interneti ishlayapti)
      }
      return Promise.reject(error);
    }

    // ========== HTTP Status Errors ==========

    // Logout jarayonida bo'lsa - barcha xatoliklarni jim o'tkazish
    if (isLoggingOut) {
      return new Promise(() => {});
    }

    // 401 Unauthorized - Token refresh logic
    if (status === 401) {
      const isAuthUrl = CONFIG.SKIP_AUTH_REDIRECT_URLS.some((url) =>
        config?.url?.includes(url)
      );

      // Agar refresh token endpointi 401 qaytarsa yoki auth URL bo'lsa - logout
      if (isAuthUrl || config?.url?.includes('/user/refresh-token')) {
        performSessionLogout();
        return new Promise(() => {}); // Component catch handler ishlamasin
      }

      // SS-DEV (2026-09-23): qurilma sessiyasi boshqa qurilmadan TUGATILGAN
      // (backend: family revoked -> 401 SESSION_REVOKED). Refresh urinib o'tirmaymiz —
      // refresh ham shu family'da, baribir rad etiladi. Darhol chiqamiz.
      if (error.response?.data?.code === 'SESSION_REVOKED') {
        performSessionLogout();
        return new Promise(() => {});
      }

      // Refresh token mavjud bo'lsa, yangilashga harakat qilamiz
      const refreshToken = getRefreshToken();
      if (refreshToken && !config._retry) {
        if (isRefreshing) {
          // Boshqa so'rov allaqachon refresh qilmoqda - navbatga qo'shamiz
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            config.headers['Authorization'] = 'Bearer ' + token;
            return $axios(config);
          }).catch(err => Promise.reject(err));
        }

        config._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          $axios.post('/user/refresh-token', { refreshToken })
            .then(({ data }) => {
              if (data.success && data.token) {
                // Yangi tokenlarni saqlash
                app.$auth.setUserToken(data.token);
                setRefreshToken(data.refreshToken);

                // Header ni yangilash
                $axios.setToken(data.token, 'Bearer');
                config.headers['Authorization'] = 'Bearer ' + data.token;

                processQueue(null, data.token);
                resolve($axios(config));
              } else {
                processQueue(new Error('Refresh failed'), null);
                performSessionLogout();
                // reject chaqirmaymiz - component catch handler ishlamasin
              }
            })
            .catch((err) => {
              processQueue(err, null);
              // U10 fix: FAQAT refresh-token HAQIQATAN yaroqsiz/muddati o'tган bo'lsa (401/400)
              // logout qilamiz. 429 (rate-limit) / 5xx / tarmoq uzilishi — VAQTINCHALIK; bularда
              // sessiyani BUZMAYMIZ (foydalanuvchi ishlab turganda "birdan chiqib ketish" shundan
              // edi). Bunday holatда so'rovni reject qilamiz, keyingi so'rov qayta urinadi.
              const st = err && err.response && err.response.status;
              if (st === 401 || st === 400) {
                performSessionLogout();
                // reject chaqirmaymiz - component catch handler ishlamasin
              } else {
                reject(err);
              }
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      // Refresh token yo'q - logout
      performSessionLogout();
      return new Promise(() => {}); // Component catch handler ishlamasin
    }

    // 403 Forbidden
    if (status === 403) {
      if (shouldShowToast(config, status)) {
        app.$toast?.error?.(getMessage('forbidden'));
      }
      return Promise.reject(error);
    }

    // 404 Not Found
    if (status === 404) {
      if (shouldShowToast(config, status)) {
        app.$toast?.error?.(getMessage('notFound'));
      }
      return Promise.reject(error);
    }

    // 429 Too Many Requests
    if (status === 429) {
      if (shouldShowToast(config, status)) {
        app.$toast?.error?.(getMessage('tooManyRequests'));
      }
      return Promise.reject(error);
    }

    // 500+ Server Errors
    if (status >= 500) {
      if (shouldShowToast(config, status)) {
        app.$toast?.error?.(getMessage('serverError'));
      }
      return Promise.reject(error);
    }

    // Unknown errors
    if (shouldShowToast(config, status)) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage && typeof serverMessage === 'string') {
        app.$toast?.error?.(serverMessage);
      }
    }

    return Promise.reject(error);
  });
}
