/**
 * ZeroX - Helper Functions
 * Loyiha bo'ylab ishlatiladigan umumiy funksiyalar
 */

import { STORAGE_KEYS, VALIDATION } from './constants';

// ============================================
// Number Formatting
// ============================================

/**
 * Raqamni formatlash (1000000 -> 1 000 000)
 * @param {number|string} value - Formatlanadigan qiymat
 * @param {string} separator - Ajratuvchi belgi (default: ' ')
 * @returns {string}
 */
export function formatNumber(value, separator = ' ') {
  if (value === null || value === undefined) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Pulni formatlash (1000000 -> 1 000 000 UZS)
 * @param {number} amount - Summa
 * @param {string} currency - Valyuta (UZS/USD)
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'UZS') {
  return `${formatNumber(amount)} ${currency}`;
}

/**
 * Qisqartirilgan raqam (1000000 -> 1M)
 * @param {number} value - Qiymat
 * @returns {string}
 */
export function formatCompact(value) {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

// ============================================
// Date Formatting
// ============================================

/**
 * Sanani formatlash
 * @param {Date|string} date - Sana
 * @param {string} format - Format (dd.mm.yyyy)
 * @returns {string}
 */
export function formatDate(date, format = 'dd.mm.yyyy') {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', year)
    .replace('HH', hours)
    .replace('MM', minutes);
}

/**
 * Qolgan kunlarni hisoblash
 * @param {Date|string} endDate - Tugash sanasi
 * @returns {number} - Qolgan kunlar (manfiy bo'lsa o'tgan)
 */
export function getDaysRemaining(endDate) {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Vaqt farqini odam o'qiy oladigan formatda
 * @param {Date|string} date - Sana
 * @returns {string}
 */
export function getRelativeTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} kun oldin`;
  if (hours > 0) return `${hours} soat oldin`;
  if (minutes > 0) return `${minutes} daqiqa oldin`;
  return 'Hozirgina';
}

// ============================================
// String Helpers
// ============================================

/**
 * Telefon raqamni formatlash
 * @param {string} phone - Telefon raqam
 * @returns {string} - +998 XX XXX XX XX
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 12) return phone;
  return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
}

/**
 * Telefon raqamni tozalash (faqat raqamlar)
 * @param {string} phone - Telefon raqam
 * @returns {string}
 */
export function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Matnni qisqartirish
 * @param {string} text - Matn
 * @param {number} maxLength - Maksimal uzunlik
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Birinchi harfni katta qilish
 * @param {string} str - Matn
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Lotin -> Kirill transliteratsiyasi
 * @param {string} text - Lotin matni
 * @returns {string}
 */
export function latinToCyrillic(text) {
  if (!text) return '';

  const map = {
    'a': 'а', 'b': 'б', 'c': 'с', 'd': 'д', 'e': 'е',
    'f': 'ф', 'g': 'г', 'h': 'ҳ', 'i': 'и', 'j': 'ж',
    'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
    'p': 'п', 'q': 'қ', 'r': 'р', 's': 'с', 't': 'т',
    'u': 'у', 'v': 'в', 'x': 'х', 'y': 'й', 'z': 'з',
    'sh': 'ш', 'ch': 'ч', "o'": 'ў', "g'": 'ғ',
    'A': 'А', 'B': 'Б', 'C': 'С', 'D': 'Д', 'E': 'Е',
    'F': 'Ф', 'G': 'Г', 'H': 'Ҳ', 'I': 'И', 'J': 'Ж',
    'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О',
    'P': 'П', 'Q': 'Қ', 'R': 'Р', 'S': 'С', 'T': 'Т',
    'U': 'У', 'V': 'В', 'X': 'Х', 'Y': 'Й', 'Z': 'З',
    'Sh': 'Ш', 'Ch': 'Ч', "O'": 'Ў', "G'": 'Ғ',
  };

  let result = text;
  // Birinchi 2 harfli kombinatsiyalarni almashtirish
  Object.keys(map)
    .filter(k => k.length > 1)
    .forEach(key => {
      result = result.replace(new RegExp(key, 'g'), map[key]);
    });
  // Keyin 1 harfli
  Object.keys(map)
    .filter(k => k.length === 1)
    .forEach(key => {
      result = result.replace(new RegExp(key, 'g'), map[key]);
    });

  return result;
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Telefon raqamni tekshirish
 * @param {string} phone - Telefon raqam
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = cleanPhone(phone);
  return cleaned.length === 12 && cleaned.startsWith('998');
}

/**
 * Email tekshirish
 * @param {string} email - Email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Parol kuchliligini tekshirish
 * @param {string} password - Parol
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Parol kiritilmagan' };
  }
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return { valid: false, message: `Parol kamida ${VALIDATION.PASSWORD_MIN_LENGTH} belgidan iborat bo'lishi kerak` };
  }
  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    return { valid: false, message: `Parol ${VALIDATION.PASSWORD_MAX_LENGTH} belgidan oshmasligi kerak` };
  }
  return { valid: true, message: '' };
}

// ============================================
// Storage Helpers
// ============================================

/**
 * LocalStorage'dan olish (xavfsiz)
 * @param {string} key - Kalit
 * @param {*} defaultValue - Default qiymat
 * @returns {*}
 */
export function getFromStorage(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * LocalStorage'ga saqlash (xavfsiz)
 * @param {string} key - Kalit
 * @param {*} value - Qiymat
 */
export function setToStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full yoki disabled
  }
}

/**
 * LocalStorage'dan o'chirish
 * @param {string} key - Kalit
 */
export function removeFromStorage(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// ============================================
// Misc Helpers
// ============================================

/**
 * Debounce funksiya
 * @param {Function} func - Funksiya
 * @param {number} wait - Kutish vaqti (ms)
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle funksiya
 * @param {Function} func - Funksiya
 * @param {number} limit - Limit (ms)
 * @returns {Function}
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone object
 * @param {Object} obj - Obyekt
 * @returns {Object}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}

/**
 * Obyektdan bo'sh qiymatlarni olib tashlash
 * @param {Object} obj - Obyekt
 * @returns {Object}
 */
export function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) =>
      v !== null && v !== undefined && v !== ''
    )
  );
}

/**
 * Random string generatsiya
 * @param {number} length - Uzunlik
 * @returns {string}
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Download file from URL
 * @param {string} url - Fayl URL
 * @param {string} filename - Fayl nomi
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy to clipboard
 * @param {string} text - Nusxalanadigan matn
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

export default {
  formatNumber,
  formatCurrency,
  formatCompact,
  formatDate,
  getDaysRemaining,
  getRelativeTime,
  formatPhone,
  cleanPhone,
  truncate,
  capitalize,
  latinToCyrillic,
  isValidPhone,
  isValidEmail,
  validatePassword,
  getFromStorage,
  setToStorage,
  removeFromStorage,
  debounce,
  throttle,
  deepClone,
  removeEmpty,
  generateId,
  downloadFile,
  copyToClipboard,
};
