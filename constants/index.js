/**
 * ZeroX - Frontend Constants
 * Backend bilan sinxronlashtirilgan konstantalar
 */

// ============================================
// Contract Status
// ============================================
export const CONTRACT_STATUS = {
  PENDING: 0,        // Kutilmoqda (tasdiqlash kutilmoqda)
  ACTIVE: 1,         // Faol
  COMPLETED: 2,      // Yakunlangan (to'liq qaytarildi)
  CANCELLED: 3,      // Bekor qilingan (o'chirilgan)
  REJECTED: 4,       // Rad etilgan
  EXPIRED: 5,        // Muddati o'tgan
  DELETED: 10,       // O'chirilgan (ko'rinmas)
};

export const CONTRACT_STATUS_LABELS = {
  uz: {
    [CONTRACT_STATUS.PENDING]: 'Kutilmoqda',
    [CONTRACT_STATUS.ACTIVE]: 'Faol',
    [CONTRACT_STATUS.COMPLETED]: 'Yakunlangan',
    [CONTRACT_STATUS.CANCELLED]: 'Bekor qilingan',
    [CONTRACT_STATUS.REJECTED]: 'Rad etilgan',
    [CONTRACT_STATUS.EXPIRED]: "Muddati o'tgan",
  },
  ru: {
    [CONTRACT_STATUS.PENDING]: 'В ожидании',
    [CONTRACT_STATUS.ACTIVE]: 'Активный',
    [CONTRACT_STATUS.COMPLETED]: 'Завершен',
    [CONTRACT_STATUS.CANCELLED]: 'Отменен',
    [CONTRACT_STATUS.REJECTED]: 'Отклонен',
    [CONTRACT_STATUS.EXPIRED]: 'Просрочен',
  },
  kr: {
    [CONTRACT_STATUS.PENDING]: 'Кутилмоқда',
    [CONTRACT_STATUS.ACTIVE]: 'Фаол',
    [CONTRACT_STATUS.COMPLETED]: 'Якунланган',
    [CONTRACT_STATUS.CANCELLED]: 'Бекор қилинган',
    [CONTRACT_STATUS.REJECTED]: 'Рад этилган',
    [CONTRACT_STATUS.EXPIRED]: 'Муддати ўтган',
  },
};

// ============================================
// Act Status
// ============================================
export const ACT_STATUS = {
  PENDING: 0,    // Kutilmoqda
  APPROVED: 1,   // Tasdiqlangan
  REJECTED: 2,   // Rad etilgan
};

// ============================================
// Act Type
// ============================================
export const ACT_TYPE = {
  PARTIAL_RETURN: 1,      // Qisman qaytarish
  FULL_RETURN: 2,         // To'liq qaytarish
  EXTENSION: 3,           // Muddat uzaytirish
  FORGIVENESS: 4,         // Kechirish
  TIME_EXTENSION: 5,      // Vaqt uzaytirish
  DEBTOR_EXTENSION: 6,    // Debitor muddat uzaytirish
};

// ============================================
// Notification Type
// ============================================
export const NOTIFICATION_TYPE = {
  CONTRACT_CREATED: 0,
  ACT_CREATED: 1,
  TIME_EXTENSION_REQUEST: 2,
  TIME_EXTENSION_APPROVED: 3,
  FORGIVENESS_REQUEST: 4,
  FORGIVENESS_PARTIAL: 5,
  FORGIVENESS_FULL: 6,
  CONTRACT_REJECTED: 7,
  CONTRACT_APPROVED: 8,
  PARTIAL_RETURN_APPROVED: 9,
  FULL_RETURN_APPROVED: 10,
  PARTIAL_RETURN_REQUEST: 11,
  TIME_EXT_APPROVED: 12,
  TIME_EXT_REJECTED: 13,
  PAYMENT_REMINDER: 14,
  PARTIAL_RETURN_REJECTED: 15,
  DEBTOR_EXTENSION_REQUEST: 16,
  DEMAND_PAYMENT: 17,
  VIEW_PERMISSION_REQUEST: 19,
  SYSTEM_DELETE_CONTRACT: 21,
  SYSTEM_DELETE_ACT: 22,
  EXTENSION_EXPIRED: 27,
  VIEW_PERMISSION_GRANTED: 30,
  VIEW_PERMISSION_DENIED: 31,
  NEAR_EXPIRY_CREDITOR: 32,
  PASSPORT_EXPIRED: 35,
};

// ============================================
// User Type
// ============================================
export const USER_TYPE = {
  ADMIN: 1,
  INDIVIDUAL: 2,     // Jismoniy shaxs
  LEGAL_ENTITY: 3,   // Yuridik shaxs
};

export const USER_TYPE_LABELS = {
  uz: {
    [USER_TYPE.INDIVIDUAL]: 'Jismoniy shaxs',
    [USER_TYPE.LEGAL_ENTITY]: 'Yuridik shaxs',
  },
  ru: {
    [USER_TYPE.INDIVIDUAL]: 'Физическое лицо',
    [USER_TYPE.LEGAL_ENTITY]: 'Юридическое лицо',
  },
  kr: {
    [USER_TYPE.INDIVIDUAL]: 'Жисмоний шахс',
    [USER_TYPE.LEGAL_ENTITY]: 'Юридик шахс',
  },
};

// ============================================
// Currency
// ============================================
export const CURRENCY = {
  UZS: 'UZS',
  USD: 'USD',
};

export const CURRENCY_LIST = Object.values(CURRENCY);

export const CURRENCY_SYMBOLS = {
  [CURRENCY.UZS]: "so'm",
  [CURRENCY.USD]: '$',
};

// ============================================
// Gender
// ============================================
export const GENDER = {
  MALE: 1,
  FEMALE: 2,
};

export const GENDER_LABELS = {
  uz: {
    [GENDER.MALE]: 'Erkak',
    [GENDER.FEMALE]: 'Ayol',
  },
  ru: {
    [GENDER.MALE]: 'Мужской',
    [GENDER.FEMALE]: 'Женский',
  },
  kr: {
    [GENDER.MALE]: 'Эркак',
    [GENDER.FEMALE]: 'Аёл',
  },
};

// ============================================
// Rating Type
// ============================================
export const RATING_TYPE = {
  POSITIVE: 1,
  NEGATIVE: 2,
};

// ============================================
// Pagination
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// ============================================
// API Error Codes
// ============================================
export const ERROR_CODES = {
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // CSRF
  CSRF_MISSING_HEADER: 'CSRF_MISSING_HEADER',
  CSRF_INVALID_HEADER: 'CSRF_INVALID_HEADER',

  // Server
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
};

// ============================================
// Business Error Messages (msg field)
// ============================================
export const BUSINESS_ERRORS = {
  // User related
  'user-bir': 'user_same_error',
  'user-not-found': 'user_not_found',
  'balance-no': 'insufficient_balance',

  // Contract related
  'not-con-suc': 'contract_not_active',
  'date': 'date_invalid',
  'end': 'contract_ended',
  'ex': 'act_exists',
  'status': 'contract_status_invalid',
  'contract-not-found': 'contract_not_found',

  // Passport
  'deb_expiry_date': 'debtor_passport_expired',
  'cred_expiry_date': 'creditor_passport_expired',

  // Report
  'no-report': 'report_not_found',
  'report-is-cancel': 'report_already_cancelled',
};

// ============================================
// Routes
// ============================================
export const ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/account',
  CONTRACTS: '/contracts',
  NOTIFICATIONS: '/notifications',
};

// ============================================
// Local Storage Keys
// ============================================
export const STORAGE_KEYS = {
  THEME: 'zerox_theme',
  LANGUAGE: 'zerox_lang',
  SIDEBAR_COLLAPSED: 'zerox_sidebar',
};

// ============================================
// Date Formats
// ============================================
export const DATE_FORMATS = {
  DISPLAY: 'DD.MM.YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD.MM.YYYY HH:mm',
};

// ============================================
// Regex Patterns
// ============================================
export const PATTERNS = {
  PHONE: /^(\+?998)?(9[0-9]{8})$/,
  PASSPORT: /^[A-Z]{2}\d{7}$/,
  PINFL: /^\d{14}$/,
  STIR: /^\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UID: /^[a-zA-Z0-9]+$/,
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get contract status label by locale
 * @param {number} status - Contract status
 * @param {string} locale - Locale code (uz, ru, kr)
 * @returns {string}
 */
export const getContractStatusLabel = (status, locale = 'uz') => {
  const labels = CONTRACT_STATUS_LABELS[locale] || CONTRACT_STATUS_LABELS.uz;
  return labels[status] || '';
};

/**
 * Get user type label by locale
 * @param {number} type - User type
 * @param {string} locale - Locale code
 * @returns {string}
 */
export const getUserTypeLabel = (type, locale = 'uz') => {
  const labels = USER_TYPE_LABELS[locale] || USER_TYPE_LABELS.uz;
  return labels[type] || '';
};

/**
 * Get gender label by locale
 * @param {number} gender - Gender
 * @param {string} locale - Locale code
 * @returns {string}
 */
export const getGenderLabel = (gender, locale = 'uz') => {
  const labels = GENDER_LABELS[locale] || GENDER_LABELS.uz;
  return labels[gender] || '';
};

/**
 * Format currency amount
 * @param {number} amount - Amount
 * @param {string} currency - Currency code
 * @returns {string}
 */
export const formatCurrency = (amount, currency = CURRENCY.UZS) => {
  if (!amount && amount !== 0) return '';

  const formatted = new Intl.NumberFormat('uz-UZ').format(amount);
  const symbol = CURRENCY_SYMBOLS[currency] || '';

  if (currency === CURRENCY.USD) {
    return `${symbol}${formatted}`;
  }
  return `${formatted} ${symbol}`;
};

/**
 * Check if contract is active
 * @param {number} status - Contract status
 * @returns {boolean}
 */
export const isContractActive = (status) => status === CONTRACT_STATUS.ACTIVE;

/**
 * Check if contract is completed
 * @param {number} status - Contract status
 * @returns {boolean}
 */
export const isContractCompleted = (status) => status === CONTRACT_STATUS.COMPLETED;

export default {
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
  ACT_STATUS,
  ACT_TYPE,
  NOTIFICATION_TYPE,
  USER_TYPE,
  USER_TYPE_LABELS,
  CURRENCY,
  CURRENCY_LIST,
  CURRENCY_SYMBOLS,
  GENDER,
  GENDER_LABELS,
  RATING_TYPE,
  PAGINATION,
  ERROR_CODES,
  BUSINESS_ERRORS,
  ROUTES,
  STORAGE_KEYS,
  DATE_FORMATS,
  PATTERNS,
  getContractStatusLabel,
  getUserTypeLabel,
  getGenderLabel,
  formatCurrency,
  isContractActive,
  isContractCompleted,
};
