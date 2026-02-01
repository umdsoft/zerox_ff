/**
 * ZeroX - Global Error Handler Plugin
 *
 * Production'da xatolarni ushlash va log qilish
 * Development'da xatolarni console'ga chiqarish
 */

export default ({ app, store, $config }, inject) => {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';

  /**
   * Xatoni formatlash
   */
  const formatError = (error, context = '') => {
    return {
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };
  };

  /**
   * Xatoni log qilish
   */
  const logError = (error, context = '') => {
    const formattedError = formatError(error, context);

    if (!IS_PRODUCTION) {
      // Development - console'ga chiqarish
      console.group(`[ZeroX Error] ${context}`);
      console.error('Message:', formattedError.message);
      console.error('Stack:', formattedError.stack);
      console.error('URL:', formattedError.url);
      console.groupEnd();
    } else {
      // Production - silent log (keyinchalik Sentry qo'shish mumkin)
      // Sentry.captureException(error);
    }

    return formattedError;
  };

  /**
   * Vue global error handler
   */
  if (app?.config) {
    app.config.errorHandler = (err, vm, info) => {
      logError(err, `Vue Error: ${info}`);
    };

    // Vue warning handler (faqat development)
    if (!IS_PRODUCTION) {
      app.config.warnHandler = (msg, vm, trace) => {
        console.warn(`[Vue Warning] ${msg}`, trace);
      };
    }
  }

  /**
   * Unhandled Promise Rejection handler
   */
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      logError(event.reason, 'Unhandled Promise Rejection');
      // Production'da default behavior'ni prevent qilish
      if (IS_PRODUCTION) {
        event.preventDefault();
      }
    });

    /**
     * Global error handler
     */
    window.addEventListener('error', (event) => {
      // Script loading errors'ni ignore qilish
      if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
        return;
      }
      logError(event.error || event.message, 'Global Error');
    });
  }

  /**
   * API xatolarini handle qilish uchun helper
   */
  const handleApiError = (error, showToast = true) => {
    const response = error?.response;
    const status = response?.status;
    const message = response?.data?.message || error?.message || 'Xatolik yuz berdi';

    logError(error, `API Error (${status || 'unknown'})`);

    // Toast ko'rsatish
    if (showToast && app?.$toast) {
      switch (status) {
        case 401:
          app.$toast.error('Sessiya tugadi. Qayta kiring.');
          break;
        case 403:
          app.$toast.error('Ruxsat yo\'q');
          break;
        case 404:
          app.$toast.error('Ma\'lumot topilmadi');
          break;
        case 422:
          app.$toast.error(message);
          break;
        case 429:
          app.$toast.error('Juda ko\'p so\'rov. Biroz kuting.');
          break;
        case 500:
        case 502:
        case 503:
          app.$toast.error('Server xatosi. Keyinroq urinib ko\'ring.');
          break;
        default:
          app.$toast.error(message);
      }
    }

    return { status, message };
  };

  // Inject helpers
  inject('logError', logError);
  inject('handleApiError', handleApiError);
};
