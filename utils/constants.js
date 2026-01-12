/**
 * ZeroX - Global Constants
 * Loyiha bo'ylab ishlatiladigan konstantalar
 */

// ============================================
// API Endpoints (o'zgarmasin!)
// ============================================
export const API_ENDPOINTS = {
  // Auth
  LOGIN: 'user/login',
  REGISTER: 'user/register',
  USER_ME: '/user/me',
  USER_ARCHIVE: '/user/archive',

  // Dashboard
  HOME_MY: '/home/my',
  GET_TIME: '/dashboard/get-time',
  TRANSFER_PAY: '/dashboard/trasfer/pay',
  CLICK_ATM: '/dashboard/transfer/click-atm',

  // Notifications
  NOTIFICATION_ME: '/notification/me',
  NOTIFICATION_SUCCESS: '/notification/success',

  // Contracts
  CONTRACT_BY_ID: '/contract/by',
  CONTRACT_ACT: '/contract/act',
};

// ============================================
// Socket Events (o'zgarmasin!)
// ============================================
export const SOCKET_EVENTS = {
  // Emit
  IDENTIFY: 'identify',
  SEND_NOTIFICATION: 'send_notification',
  NOTIFICATION: 'notification',
  REGISTER: 'register',
  ME: 'me',

  // Listen
  CONNECT: 'connect',
  RECONNECT: 'reconnect',
  RECEIVE_NOTIFICATION: 'recive_notification', // Backend'da shunday yozilgan
};

// ============================================
// User Types
// ============================================
export const USER_TYPES = {
  LEGAL: 1,      // Yuridik shaxs
  PHYSICAL: 2,   // Jismoniy shaxs
};

// ============================================
// Contract Statuses
// ============================================
export const CONTRACT_STATUS = {
  PENDING: 0,      // Jarayonda
  COMPLETED: 1,    // Tugallangan
  REJECTED: 2,     // Rad qilingan
};

// ============================================
// Currency Types
// ============================================
export const CURRENCIES = {
  UZS: 'UZS',
  USD: 'USD',
};

// ============================================
// Notification Types
// ============================================
export const NOTIFICATION_TYPES = {
  CONTRACT_CREATE: 'contract-create',
  CONTRACT_ACCEPT: 'contract-accept',
  CONTRACT_REJECT: 'contract-reject',
  DEBT_DEMAND: 'debt-demand',
  DEBT_EXTEND: 'debt-extend',
  DEBT_REFUND_FULL: 'debt-fullRefund',
  DEBT_REFUND_PARTIAL: 'debt-partialRefund',
  DEBT_WAIVER: 'debt-waiver',
};

// ============================================
// Timer Constants
// ============================================
export const TIMER = {
  SMS_VERIFICATION: 120, // 2 daqiqa
  REQUEST_TIMEOUT: 300,  // 5 daqiqa
  SESSION_WARNING: 60,   // 1 daqiqa
  RESEND_COOLDOWN: 120,  // SMS qayta yuborish uchun
};

// ============================================
// Phone Constants
// ============================================
export const PHONE = {
  COUNTRY_CODE: '+998',
  LENGTH: 13,
  MASK: '+998 ## ### ## ##',
  PLACEHOLDER: '+998 XX XXX XX XX',
};

// ============================================
// Act Types
// ============================================
export const ACT_TYPES = {
  PARTIAL_REFUND: 1,
  FULL_REFUND: 2,
  EXTEND: 3,
  WAIVER: 4,
};

// ============================================
// API Response Messages
// ============================================
export const API_MESSAGES = {
  EXIST: 'exist',
  NOT_EST: 'not_est',
  END: 'end',
  USER_ALLOW: 'user_allow',
  CODE_EXPIRED: 'code_expired',
  NO_CODE: 'no_code',
  SEND_CODE: 'send_code',
  SUCCESS: 'success',
  ERROR: 'error',
};

// ============================================
// UI Constants
// ============================================
export const UI = {
  // Timeouts
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  SEARCH_DELAY: 500,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // Chart colors
  CHART_COLORS: {
    PRIMARY: '#3182CE',
    SUCCESS: '#48BB78',
    WARNING: '#ED8936',
    DANGER: '#F56565',
    INFO: '#4299E1',
  },

  // Theme colors
  COLORS: {
    PRIMARY: '#3182CE',
    SECONDARY: '#8692A6',
    SUCCESS: '#48BB78',
    ERROR: '#F56565',
    WARNING: '#ED8936',
    BACKGROUND: '#F7FAFC',
  },
};

// ============================================
// Validation Rules
// ============================================
export const VALIDATION = {
  PHONE_REGEX: /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
  PHONE_LENGTH: 13, // +998XXXXXXXXX
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
};

// ============================================
// Date Formats
// ============================================
export const DATE_FORMATS = {
  DISPLAY: 'dd.MM.yyyy',
  API: 'yyyy-MM-dd',
  FULL: 'dd.MM.yyyy HH:mm',
  TIME: 'HH:mm',
};

// ============================================
// Local Storage Keys
// ============================================
export const STORAGE_KEYS = {
  LANGUAGE: 'app-language',
  BALANCE: 'user_balance',
  NOTIFICATIONS: 'user_notifications',
  THEME: 'app-theme',
};

// ============================================
// Routes
// ============================================
export const ROUTES = {
  HOME: 'index',
  LOGIN: 'auth-login',
  REGISTER: 'auth-register',
  CABINET: 'cabinet',
  DEBT_LIST: 'debt-list',
  CREDIT_LIST: 'credit-list',
  NOTIFICATION: 'notification',
  QR_CODE: 'qr-code',
  MOBILE_BALANCE: 'mobil-hisob',
};

export default {
  API_ENDPOINTS,
  SOCKET_EVENTS,
  USER_TYPES,
  CONTRACT_STATUS,
  CURRENCIES,
  NOTIFICATION_TYPES,
  TIMER,
  PHONE,
  ACT_TYPES,
  API_MESSAGES,
  UI,
  VALIDATION,
  DATE_FORMATS,
  STORAGE_KEYS,
  ROUTES,
};
