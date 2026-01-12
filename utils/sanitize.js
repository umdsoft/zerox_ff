/**
 * ZeroX - HTML Sanitization Utility
 * XSS xavfini bartaraf etish uchun HTML kontentini sanitize qiladi
 */

// ============================================
// Allowed Tags & Attributes Configuration
// ============================================
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'span',
    'div',
    'blockquote',
    'code',
    'pre',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target'],
  ALLOW_DATA_ATTR: false,
  SAFE_FOR_TEMPLATES: true,
};

// ============================================
// SSR-safe Basic Sanitizer (DOMPurify mavjud bo'lmaganda)
// ============================================

/**
 * Oddiy HTML escape - SSR uchun fallback
 * @param {string} str - Escape qilinadigan string
 * @returns {string} - Escaped string
 */
const escapeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char]);
};

/**
 * SSR uchun basic HTML tag stripper
 * @param {string} html - HTML string
 * @returns {string} - Tags olib tashlangan string
 */
const stripTags = (html) => {
  if (!html || typeof html !== 'string') return '';

  // Script va style teglarini to'liq olib tashlash
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Event handlers'ni olib tashlash (onclick, onerror, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // javascript: va data: URL'larni olib tashlash
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, '');
  clean = clean.replace(/src\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, '');
  clean = clean.replace(/href\s*=\s*["']?\s*data:[^"'>\s]*/gi, '');
  clean = clean.replace(/src\s*=\s*["']?\s*data:[^"'>\s]*/gi, '');

  // Ruxsat etilmagan teglarni olib tashlash
  const allowedTagsPattern = SANITIZE_CONFIG.ALLOWED_TAGS.join('|');
  const tagRegex = new RegExp(
    `<(?!\/?(?:${allowedTagsPattern})\\b)[^>]*>`,
    'gi'
  );
  clean = clean.replace(tagRegex, '');

  // Ruxsat etilmagan atributlarni olib tashlash
  const allowedAttrsPattern = SANITIZE_CONFIG.ALLOWED_ATTR.join('|');
  const attrRegex = new RegExp(
    `\\s+(?!(?:${allowedAttrsPattern})\\b)\\w+\\s*=\\s*["'][^"']*["']`,
    'gi'
  );
  clean = clean.replace(attrRegex, '');

  return clean;
};

// ============================================
// Main Sanitize Function
// ============================================

/**
 * XSS xavfini bartaraf etish uchun HTML kontentini sanitize qiladi
 * Faqat oq ro'yxatdagi teglar va atributlarga ruxsat beradi
 * @param {string} dirty - Tozalanishi kerak bo'lgan HTML
 * @param {Object} options - Qo'shimcha options
 * @param {boolean} options.stripAllTags - Barcha teglarni olib tashlash
 * @returns {string} - Xavfsiz HTML
 */
export function sanitizeHtml(dirty, options = {}) {
  // Null/undefined tekshiruvi
  if (!dirty) return '';
  if (typeof dirty !== 'string') {
    dirty = String(dirty);
  }

  // Agar faqat matn kerak bo'lsa
  if (options.stripAllTags) {
    return escapeHtml(dirty.replace(/<[^>]*>/g, ''));
  }

  // Client-side: DOMPurify ishlatish
  if (typeof window !== 'undefined') {
    try {
      const DOMPurify = require('dompurify');
      return DOMPurify.sanitize(dirty, SANITIZE_CONFIG);
    } catch {
      // DOMPurify yuklanmasa, fallback'ga o'tish
      return stripTags(dirty);
    }
  }

  // Server-side (SSR): Basic sanitizer ishlatish
  // MUHIM: SSR'da ham xavfsiz bo'lishi kerak
  return stripTags(dirty);
}

/**
 * Plain text sifatida qaytarish (barcha HTML olib tashlanadi)
 * @param {string} dirty - HTML string
 * @returns {string} - Plain text
 */
export function sanitizeToPlainText(dirty) {
  if (!dirty) return '';
  if (typeof dirty !== 'string') {
    dirty = String(dirty);
  }

  // Barcha teglarni olib tashlash
  const text = dirty.replace(/<[^>]*>/g, ' ');

  // HTML entities'ni decode qilish
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');

  // Ortiqcha bo'shliqlarni tozalash
  return decoded.replace(/\s+/g, ' ').trim();
}

/**
 * URL xavfsizligini tekshirish
 * @param {string} url - Tekshiriladigan URL
 * @returns {boolean} - Xavfsiz bo'lsa true
 */
export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim().toLowerCase();

  // Xavfli protokollar
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
  ];

  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return false;
    }
  }

  return true;
}

/**
 * URL'ni sanitize qilish
 * @param {string} url - Sanitize qilinadigan URL
 * @returns {string} - Xavfsiz URL yoki bo'sh string
 */
export function sanitizeUrl(url) {
  if (!isSafeUrl(url)) return '';
  return url.trim();
}

// ============================================
// Export
// ============================================
export default {
  sanitizeHtml,
  sanitizeToPlainText,
  isSafeUrl,
  sanitizeUrl,
  escapeHtml,
};
