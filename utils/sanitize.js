import DOMPurify from 'dompurify'

/**
 * XSS xavfini bartaraf etish uchun HTML kontentini sanitize qiladi
 * Faqat oq ro'yxatdagi teglar va atributlarga ruxsat beradi
 * @param {string} dirty - Tozalanishi kerak bo'lgan HTML
 * @returns {string} - Xavfsiz HTML
 */
export function sanitizeHtml(dirty) {
  if (typeof window === 'undefined') {
    // Server-side rendering (SSR) bo'lsa, xom matnni qaytaramiz
    return dirty
  }

  // Faqat xavfsiz teglar va atributlarga ruxsat beramiz
  const config = {
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
  }

  return DOMPurify.sanitize(dirty, config)
}
