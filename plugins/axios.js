/**
 * ZeroX - Axios Plugin
 * API so'rovlarini boshqarish, retry logikasi va xatolik qayta ishlash
 */

import {
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
} from '@/utils/tokenStorage';

import { ERROR_CODES } from '@/constants';

// ============================================
// Konstantalar
// ============================================
const CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 sekund
  SKIP_LOADING_URLS: ['/user/me', '/dashboard/get-time', '/notification/me'],
  SKIP_AUTH_REDIRECT_URLS: ['/user/login', '/user/register', '/user/phoneChangeReg', '/user/refresh-token'],
  NETWORK_ERROR_CODES: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'NETWORK_ERROR'],
  // CSRF himoya uchun header
  CSRF_HEADER_NAME: 'X-Requested-With',
  CSRF_HEADER_VALUE: 'ZeroXApp',
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
};

export default function ({ $axios, $config, store, redirect, app }) {
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

    // Sessiya tugadi xabarini login sahifasida ko'rsatish (faqat 1 marta)
    try { sessionStorage.setItem('session_expired', '1'); } catch {}

    try {
      if (app.$auth?.loggedIn) {
        app.$auth.logout();
      }
      clearRefreshToken();
    } catch {
      // Silent fail
    }

    const loginPath = app.localePath?.({ name: 'auth-login' }) || '/auth/login';
    redirect(loginPath);

    // 5 sekunddan keyin flagni tiklash (qayta login uchun)
    setTimeout(() => { isLoggingOut = false; }, 5000);
  };

  // ============================================
  // BaseURL Configuration
  // ============================================
  // MUHIM: Frontend va backend ALOHIDA Cloudflare tunnel'larda ishlaydi
  // nuxt.config.js dagi API_BASE_URL da backend URL to'g'ri sozlangan bo'lishi kerak
  // Dinamik override QILINMAYDI - config'dagi URL ishlatiladi
  if (typeof window !== 'undefined') {
    console.log('[Axios] Using configured baseURL:', $axios.defaults.baseURL);
  }

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
  // Request Interceptor
  // ============================================
  $axios.onRequest((config) => {
    // BaseURL config'dan olinadi, dinamik override yo'q
    // nuxt.config.js da to'g'ri backend URL sozlangan bo'lishi kerak

    // Loading state
    if (shouldShowLoading(config)) {
      store.commit('START_LOADING');
    }

    // CSRF header qo'shish (POST, PUT, DELETE, PATCH uchun)
    const method = config.method?.toUpperCase?.();
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      config.headers = config.headers || {};
      config.headers[CONFIG.CSRF_HEADER_NAME] = CONFIG.CSRF_HEADER_VALUE;
    }

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
    const status = error.response?.status;
    const isNetworkError = !error.response;

    // ========== Retry Logic (Exponential Backoff) ==========
    if (shouldRetry(error) && config.retryCount < CONFIG.MAX_RETRIES) {
      config.retryCount += 1;
      const delay = CONFIG.RETRY_DELAY * Math.pow(2, config.retryCount - 1);

      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[Axios] Retry ${config.retryCount}/${CONFIG.MAX_RETRIES}: ${config.url}`);
      }

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

      // Agar foydalanuvchi tizimga kirgan bo'lsa YOKI avval kirgan bo'lsa (refresh token mavjud),
      // bu session tugashi bo'lishi mumkin - sessionExpired xabarini ko'rsatamiz
      const wasLoggedIn = app.$auth?.loggedIn || getRefreshToken();
      if (wasLoggedIn) {
        performSessionLogout();
        return new Promise(() => {}); // Component catch handler ishlamasin
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
              // Refresh token ham yaroqsiz - logout
              performSessionLogout();
              // reject chaqirmaymiz - component catch handler ishlamasin
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
