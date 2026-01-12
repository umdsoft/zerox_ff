/**
 * ZeroX - Frontend Validators
 * Form validatsiya funksiyalari (backend bilan sinxron)
 */

import { PATTERNS, CURRENCY_LIST } from '@/constants';

// ============================================
// Basic Validators
// ============================================

/**
 * Required field check
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate phone number (O'zbekiston formati)
 * @param {string} phone - Phone number
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return PATTERNS.PHONE.test(cleaned);
};

/**
 * Normalize phone number to 998XXXXXXXXX format
 * @param {string} phone - Phone number
 * @returns {string}
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('998')) return cleaned;
  if (cleaned.startsWith('9') && cleaned.length === 9) return '998' + cleaned;
  return cleaned;
};

/**
 * Format phone for display (+998 XX XXX XX XX)
 * @param {string} phone - Phone number (998XXXXXXXXX)
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 12) return phone;

  const parts = [
    cleaned.slice(0, 3),
    cleaned.slice(3, 5),
    cleaned.slice(5, 8),
    cleaned.slice(8, 10),
    cleaned.slice(10, 12),
  ];

  return `+${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]}`;
};

/**
 * Validate email
 * @param {string} email - Email address
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return PATTERNS.EMAIL.test(email.trim());
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @param {Object} options - Validation options
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    maxLength = 128,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecial = false,
  } = options;

  const errors = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['password_required'] };
  }

  if (password.length < minLength) {
    errors.push('password_too_short');
  }

  if (password.length > maxLength) {
    errors.push('password_too_long');
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('password_needs_uppercase');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('password_needs_lowercase');
  }

  if (requireNumbers && !/[0-9]/.test(password)) {
    errors.push('password_needs_number');
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('password_needs_special');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validate passport (O'zbekiston formati: AA1234567)
 * @param {string} passport - Passport series and number
 * @returns {boolean}
 */
export const validatePassport = (passport) => {
  if (!passport || typeof passport !== 'string') return false;
  const cleaned = passport.toUpperCase().replace(/\s/g, '');
  return PATTERNS.PASSPORT.test(cleaned);
};

/**
 * Format passport for display
 * @param {string} passport - Passport
 * @returns {string}
 */
export const formatPassport = (passport) => {
  if (!passport) return '';
  const cleaned = passport.toUpperCase().replace(/\s/g, '');
  if (cleaned.length !== 9) return passport;
  return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
};

/**
 * Validate PINFL (14 digits)
 * @param {string} pinfl - PINFL
 * @returns {boolean}
 */
export const validatePinfl = (pinfl) => {
  if (!pinfl || typeof pinfl !== 'string') return false;
  return PATTERNS.PINFL.test(pinfl.replace(/\s/g, ''));
};

/**
 * Validate STIR/INN (9 digits)
 * @param {string} stir - STIR/INN
 * @returns {boolean}
 */
export const validateStir = (stir) => {
  if (!stir || typeof stir !== 'string') return false;
  return PATTERNS.STIR.test(stir.replace(/\s/g, ''));
};

/**
 * Validate UID
 * @param {string} uid - User ID
 * @param {Object} options - Validation options
 * @returns {boolean}
 */
export const validateUid = (uid, options = {}) => {
  const { minLength = 5, maxLength = 20 } = options;

  if (!uid || typeof uid !== 'string') return false;
  if (uid.length < minLength || uid.length > maxLength) return false;

  return PATTERNS.UID.test(uid);
};

// ============================================
// Date Validators
// ============================================

/**
 * Validate date string (YYYY-MM-DD)
 * @param {string} date - Date string
 * @returns {boolean}
 */
export const validateDate = (date) => {
  if (!date || typeof date !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

/**
 * Check if date is in the future
 * @param {string} date - Date string (YYYY-MM-DD)
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  if (!validateDate(date)) return false;
  const parsed = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed > today;
};

/**
 * Check if date is in the past
 * @param {string} date - Date string (YYYY-MM-DD)
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  if (!validateDate(date)) return false;
  const parsed = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed < today;
};

/**
 * Check if date is today or in the future
 * @param {string} date - Date string (YYYY-MM-DD)
 * @returns {boolean}
 */
export const isTodayOrFuture = (date) => {
  if (!validateDate(date)) return false;
  const parsed = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
};

// ============================================
// Number Validators
// ============================================

/**
 * Validate amount (positive number)
 * @param {any} amount - Amount value
 * @param {Object} options - Validation options
 * @returns {boolean}
 */
export const validateAmount = (amount, options = {}) => {
  const { min = 0, max = Number.MAX_SAFE_INTEGER, allowZero = false } = options;

  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return false;
  if (!allowZero && parsed === 0) return false;
  if (parsed < min || parsed > max) return false;

  return true;
};

/**
 * Validate currency code
 * @param {string} currency - Currency code
 * @returns {boolean}
 */
export const validateCurrency = (currency) => {
  return CURRENCY_LIST.includes(currency?.toUpperCase?.());
};

// ============================================
// Form Validation
// ============================================

/**
 * Validate form data against schema
 * @param {Object} data - Form data
 * @param {Object} schema - Validation schema
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateForm = (data, schema) => {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Required check
    if (rules.required && !isRequired(value)) {
      errors[field] = rules.message || `${field}_required`;
      continue;
    }

    // Skip if not required and empty
    if (!isRequired(value)) continue;

    // Min length
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = rules.message || `${field}_too_short`;
      continue;
    }

    // Max length
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message || `${field}_too_long`;
      continue;
    }

    // Pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || `${field}_invalid`;
      continue;
    }

    // Custom validator
    if (rules.validator && typeof rules.validator === 'function') {
      const result = rules.validator(value, data);
      if (result !== true) {
        errors[field] = result || `${field}_invalid`;
        continue;
      }
    }

    // Min value (numbers)
    if (rules.min !== undefined) {
      const num = parseFloat(value);
      if (isNaN(num) || num < rules.min) {
        errors[field] = rules.message || `${field}_too_small`;
        continue;
      }
    }

    // Max value (numbers)
    if (rules.max !== undefined) {
      const num = parseFloat(value);
      if (isNaN(num) || num > rules.max) {
        errors[field] = rules.message || `${field}_too_large`;
        continue;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Create validation rules for common fields
 */
export const rules = {
  required: (message) => ({
    required: true,
    message,
  }),

  phone: (message) => ({
    required: true,
    validator: validatePhone,
    message: message || 'phone_invalid',
  }),

  email: (message) => ({
    required: true,
    validator: validateEmail,
    message: message || 'email_invalid',
  }),

  password: (options = {}) => ({
    required: true,
    validator: (value) => {
      const result = validatePassword(value, options);
      return result.valid ? true : result.errors[0];
    },
  }),

  passport: (message) => ({
    required: true,
    validator: validatePassport,
    message: message || 'passport_invalid',
  }),

  pinfl: (message) => ({
    required: true,
    validator: validatePinfl,
    message: message || 'pinfl_invalid',
  }),

  stir: (message) => ({
    required: true,
    validator: validateStir,
    message: message || 'stir_invalid',
  }),

  futureDate: (message) => ({
    required: true,
    validator: isFutureDate,
    message: message || 'date_must_be_future',
  }),

  amount: (options = {}) => ({
    required: true,
    validator: (value) => validateAmount(value, options),
    message: options.message || 'amount_invalid',
  }),

  match: (fieldName, message) => ({
    validator: (value, data) => value === data[fieldName],
    message: message || 'fields_not_match',
  }),
};

export default {
  // Basic validators
  isRequired,
  validatePhone,
  normalizePhone,
  formatPhone,
  validateEmail,
  validatePassword,
  validatePassport,
  formatPassport,
  validatePinfl,
  validateStir,
  validateUid,

  // Date validators
  validateDate,
  isFutureDate,
  isPastDate,
  isTodayOrFuture,

  // Number validators
  validateAmount,
  validateCurrency,

  // Form validation
  validateForm,
  rules,
};
