/**
 * ZeroX - Global Error Handler
 * Markazlashtirilgan xatolik boshqaruvi
 *
 * @module utils/errorHandler
 */

/**
 * Xatolik turlari
 * @enum {string}
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * HTTP status kodlari asosida xatolik turini aniqlash
 * @param {number} status - HTTP status kodi
 * @returns {string} Xatolik turi
 */
export function getErrorType(status) {
  if (!status) {
    return ERROR_TYPES.NETWORK;
  }

  if (status === 401 || status === 403) {
    return ERROR_TYPES.AUTH;
  }

  if (status === 404) {
    return ERROR_TYPES.NOT_FOUND;
  }

  if (status === 422 || status === 400) {
    return ERROR_TYPES.VALIDATION;
  }

  if (status >= 500) {
    return ERROR_TYPES.SERVER;
  }

  return ERROR_TYPES.UNKNOWN;
}

/**
 * Xatolik xabarini olish
 * @param {Error} error - Xatolik obyekti
 * @param {Object} i18n - i18n instance
 * @returns {string} Xatolik xabari
 */
export function getErrorMessage(error, i18n = null) {
  // Network error
  if (!error.response) {
    return i18n?.$t?.('errors.network') || 'Internet aloqasi yo\'q';
  }

  const { status, data } = error.response;

  // Server xabari
  if (data?.message) {
    return data.message;
  }

  // Status asosida default xabarlar
  const messages = {
    400: i18n?.$t?.('errors.bad_request') || 'Noto\'g\'ri so\'rov',
    401: i18n?.$t?.('errors.unauthorized') || 'Avtorizatsiya talab qilinadi',
    403: i18n?.$t?.('errors.forbidden') || 'Ruxsat yo\'q',
    404: i18n?.$t?.('errors.not_found') || 'Ma\'lumot topilmadi',
    422: i18n?.$t?.('errors.validation') || 'Validatsiya xatosi',
    429: i18n?.$t?.('errors.too_many') || 'Juda ko\'p so\'rov',
    500: i18n?.$t?.('errors.server') || 'Server xatosi',
    502: i18n?.$t?.('errors.bad_gateway') || 'Server vaqtinchalik ishlamayapti',
    503: i18n?.$t?.('errors.unavailable') || 'Xizmat vaqtinchalik mavjud emas',
  };

  return messages[status] || i18n?.$t?.('errors.unknown') || 'Noma\'lum xatolik';
}

/**
 * Validation xatolarini olish
 * @param {Object} errors - Server validation xatolari
 * @returns {Object} Maydon xatoliklari
 */
export function parseValidationErrors(errors) {
  if (!errors || typeof errors !== 'object') {
    return {};
  }

  const parsed = {};

  Object.entries(errors).forEach(([field, messages]) => {
    parsed[field] = Array.isArray(messages) ? messages[0] : messages;
  });

  return parsed;
}

/**
 * Xatolikni log qilish (development uchun)
 * @param {string} context - Xatolik konteksti
 * @param {Error} error - Xatolik obyekti
 * @param {Object} extra - Qo'shimcha ma'lumotlar
 */
export function logError(context, error, extra = {}) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const errorInfo = {
    context,
    message: error.message,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
    ...extra,
  };

  console.error(`[${context}]`, errorInfo);
}

/**
 * Xatolikni handle qilish
 * @param {Error} error - Xatolik obyekti
 * @param {Object} options - Opsiyalar
 * @param {Object} options.toast - Toast instance
 * @param {Object} options.i18n - i18n instance
 * @param {Object} options.router - Router instance
 * @param {string} options.context - Xatolik konteksti
 * @returns {Object} Xatolik ma'lumotlari
 */
export function handleError(error, { toast, i18n, router, context = 'App' } = {}) {
  const type = getErrorType(error.response?.status);
  const message = getErrorMessage(error, i18n);

  // Log
  logError(context, error);

  // Toast
  if (toast) {
    toast.error?.(message);
  }

  // Auth xatolik - login'ga yo'naltirish
  if (type === ERROR_TYPES.AUTH && router) {
    router.push('/auth/login');
  }

  return {
    type,
    message,
    status: error.response?.status,
    validationErrors: parseValidationErrors(error.response?.data?.errors),
  };
}

/**
 * Promise wrapper - try/catch o'rniga
 * @param {Promise} promise - Promise
 * @returns {Promise<[Error|null, any]>} [error, data]
 *
 * @example
 * const [error, data] = await to(fetchUser());
 * if (error) {
 *   handleError(error);
 *   return;
 * }
 * console.log(data);
 */
export async function to(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}

export default {
  ERROR_TYPES,
  getErrorType,
  getErrorMessage,
  parseValidationErrors,
  logError,
  handleError,
  to,
};
