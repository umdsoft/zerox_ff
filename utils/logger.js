/**
 * ZeroX - Logger Utility
 * Markazlashtirilgan xatolik va debug logging
 *
 * Ishlatilishi:
 * import { logger } from '@/utils/logger';
 * logger.error('Xatolik', error);
 * logger.warn('Ogohlantirish', data);
 * logger.info('Ma\'lumot', data);
 * logger.debug('Debug', data);
 */

// ============================================
// Configuration
// ============================================
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_CLIENT = typeof window !== 'undefined';

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Production'da faqat error va warn
// Development'da barcha loglar
const CURRENT_LEVEL = IS_PRODUCTION ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;

// ============================================
// Helper Functions
// ============================================

/**
 * Timestamp olish
 * @returns {string}
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Error ob'ektini formatlash
 * @param {Error} error
 * @returns {Object}
 */
const formatError = (error) => {
  if (!error) return null;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: IS_PRODUCTION ? undefined : error.stack,
      // Axios error uchun qo'shimcha ma'lumot
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
      } : undefined,
    };
  }

  return error;
};

/**
 * Log entry yaratish
 * @param {string} level
 * @param {string} message
 * @param {any} data
 * @returns {Object}
 */
const createLogEntry = (level, message, data) => {
  return {
    timestamp: getTimestamp(),
    level,
    message,
    data: data instanceof Error ? formatError(data) : data,
    environment: IS_PRODUCTION ? 'production' : 'development',
    client: IS_CLIENT,
  };
};

// ============================================
// Logger Methods
// ============================================

/**
 * Error log - Jiddiy xatoliklar uchun
 * @param {string} message
 * @param {any} data
 */
const error = (message, data = null) => {
  if (CURRENT_LEVEL < LOG_LEVELS.ERROR) return;

  const entry = createLogEntry('ERROR', message, data);

  // Console'ga chiqarish
  console.error(`[ERROR] ${message}`, data || '');

  // Production'da external service'ga yuborish mumkin
  // Masalan: Sentry, LogRocket, etc.
  if (IS_PRODUCTION && IS_CLIENT) {
    sendToExternalService(entry);
  }
};

/**
 * Warning log - Ogohlantirish uchun
 * @param {string} message
 * @param {any} data
 */
const warn = (message, data = null) => {
  if (CURRENT_LEVEL < LOG_LEVELS.WARN) return;

  const entry = createLogEntry('WARN', message, data);
  console.warn(`[WARN] ${message}`, data || '');

  // Production'da muhim warning'larni yuborish
  if (IS_PRODUCTION && IS_CLIENT && shouldReportWarning(message)) {
    sendToExternalService(entry);
  }
};

/**
 * Info log - Umumiy ma'lumot uchun
 * @param {string} message
 * @param {any} data
 */
const info = (message, data = null) => {
  if (CURRENT_LEVEL < LOG_LEVELS.INFO) return;

  console.info(`[INFO] ${message}`, data || '');
};

/**
 * Debug log - Faqat development uchun
 * @param {string} message
 * @param {any} data
 */
const debug = (message, data = null) => {
  if (CURRENT_LEVEL < LOG_LEVELS.DEBUG) return;

  console.debug(`[DEBUG] ${message}`, data || '');
};

/**
 * Performance log - Vaqt o'lchash uchun
 * @param {string} label - Unique label
 */
const time = (label) => {
  if (IS_PRODUCTION) return;
  console.time(`[PERF] ${label}`);
};

/**
 * Performance log end
 * @param {string} label - time() da ishlatilgan label
 */
const timeEnd = (label) => {
  if (IS_PRODUCTION) return;
  console.timeEnd(`[PERF] ${label}`);
};

/**
 * Group log - Related loglarni guruhlash
 * @param {string} label
 */
const group = (label) => {
  if (IS_PRODUCTION) return;
  console.group(`[GROUP] ${label}`);
};

/**
 * Group end
 */
const groupEnd = () => {
  if (IS_PRODUCTION) return;
  console.groupEnd();
};

// ============================================
// External Service Integration (Placeholder)
// ============================================

/**
 * External logging service'ga yuborish
 * @param {Object} entry - Log entry
 */
const sendToExternalService = (entry) => {
  // TODO: Sentry, LogRocket, yoki boshqa service integratsiyasi
  // Hozircha placeholder

  // Misol: Sentry uchun
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureMessage(entry.message, {
  //     level: entry.level.toLowerCase(),
  //     extra: entry.data,
  //   });
  // }
};

/**
 * Warning report qilish kerakmi tekshirish
 * @param {string} message
 * @returns {boolean}
 */
const shouldReportWarning = (message) => {
  // Muhim warning pattern'lari
  const importantPatterns = [
    /security/i,
    /auth/i,
    /token/i,
    /payment/i,
    /critical/i,
  ];

  return importantPatterns.some((pattern) => pattern.test(message));
};

// ============================================
// API Error Helper
// ============================================

/**
 * API xatoliklarini log qilish uchun maxsus helper
 * @param {Error} error - Axios error
 * @param {string} context - Qayerda xatolik bo'lgani
 */
const apiError = (err, context = 'API') => {
  const status = err.response?.status;
  const url = err.config?.url;
  const method = err.config?.method?.toUpperCase();

  // 4xx xatolar uchun warn, 5xx uchun error
  if (status >= 500) {
    error(`${context}: Server error`, {
      status,
      url,
      method,
      message: err.message,
    });
  } else if (status >= 400) {
    warn(`${context}: Client error`, {
      status,
      url,
      method,
      message: err.response?.data?.message || err.message,
    });
  } else if (!err.response) {
    error(`${context}: Network error`, {
      url,
      method,
      message: err.message,
      code: err.code,
    });
  }
};

// ============================================
// Export
// ============================================
export const logger = {
  error,
  warn,
  info,
  debug,
  time,
  timeEnd,
  group,
  groupEnd,
  apiError,
};

export default logger;
