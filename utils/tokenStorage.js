/**
 * ZeroX - Token Storage Utility
 * Xavfsiz token saqlash va olish
 *
 * MUHIM: refreshToken localStorage'da saqlash XSS hujumlariga zaif.
 * Ideal holda httpOnly cookie ishlatilishi kerak, lekin bu backend o'zgarishini talab qiladi.
 *
 * B30-13 FIX: memory + localStorage kombinatsiyasi.
 * - Memory: Eng xavfsiz, lekin sahifa yangilanganda yo'qoladi
 * - localStorage: Tab yopilganda/brauzer qayta ochilganda SAQLANADI.
 *   Ilgari sessionStorage edi — access token esa 7 kunlik cookie'da. Bu nomuvofiqlik
 *   tufayli yangi tab/brauzer restartida access token "kirgan" ko'rinardi, lekin 30 daqiqadan
 *   keyin refresh token yo'qligi sababli "Sessiya tugadi" bilan chiqib ketardi. localStorage
 *   access token bilan bir xil (7 kun) yashaydi — spontan logout yo'qoladi. XSS ta'siri
 *   access token (localStorage/cookie) bilan bir xil darajada.
 *
 * Backend httpOnly cookie qo'llab-quvvatlaganda, bu faylni yangilash kerak.
 */

// ============================================
// Constants
// ============================================
const STORAGE_KEYS = {
  REFRESH_TOKEN: 'zx_rt',
  TOKEN_EXPIRY: 'zx_te',
};

// Memory storage (eng xavfsiz, lekin volatile)
let memoryStorage = {
  refreshToken: null,
  tokenExpiry: null,
};

// ============================================
// Helper Functions
// ============================================

/**
 * SessionStorage mavjudligini tekshirish
 * @returns {boolean}
 */
const isSessionStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Oddiy obfuscation (XSS himoyasi emas, faqat casual ko'rishdan)
 * @param {string} str
 * @returns {string}
 */
const obfuscate = (str) => {
  if (!str) return '';
  try {
    return btoa(encodeURIComponent(str).split('').reverse().join(''));
  } catch {
    return str;
  }
};

/**
 * Deobfuscation
 * @param {string} str
 * @returns {string}
 */
const deobfuscate = (str) => {
  if (!str) return '';
  try {
    return decodeURIComponent(atob(str).split('').reverse().join(''));
  } catch {
    return str;
  }
};

// ============================================
// Token Storage API
// ============================================

/**
 * Refresh token'ni saqlash
 * @param {string} token - Refresh token
 * @param {number} expiryMs - Token amal qilish muddati (millisekund)
 */
export const setRefreshToken = (token, expiryMs = 7 * 24 * 60 * 60 * 1000) => {
  if (!token) return;

  const expiry = Date.now() + expiryMs;

  // Memory'ga saqlash (primary)
  memoryStorage.refreshToken = token;
  memoryStorage.tokenExpiry = expiry;

  // localStorage'ga backup (B30-13: brauzer qayta ochilganda ham saqlanadi, 7 kun)
  if (isSessionStorageAvailable()) {
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, obfuscate(token));
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, String(expiry));
    } catch {
      // Storage to'lgan bo'lishi mumkin
    }
  }

  // localStorage'dan eski token'ni o'chirish (migration)
  try {
    localStorage.removeItem('refreshToken');
  } catch {
    // Ignore
  }
};

/**
 * Refresh token'ni olish
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  // Avval memory'dan tekshirish
  if (memoryStorage.refreshToken) {
    // Muddati o'tganligini tekshirish
    if (memoryStorage.tokenExpiry && Date.now() > memoryStorage.tokenExpiry) {
      clearRefreshToken();
      return null;
    }
    return memoryStorage.refreshToken;
  }

  // localStorage'dan tekshirish (B30-13: yangi tab/brauzer restartida ham topiladi)
  if (isSessionStorageAvailable()) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

      if (token && expiry) {
        // Muddati o'tganligini tekshirish
        if (Date.now() > Number(expiry)) {
          clearRefreshToken();
          return null;
        }

        const deobfuscatedToken = deobfuscate(token);
        // Memory'ga ham saqlash
        memoryStorage.refreshToken = deobfuscatedToken;
        memoryStorage.tokenExpiry = Number(expiry);
        return deobfuscatedToken;
      }
    } catch {
      // Ignore
    }
  }

  // B30-13 migration: eski sessionStorage (zx_rt) dan localStorage'ga bir martalik ko'chirish
  // (mavjud sessiyalar deploy'dan keyin chiqib ketmasin)
  if (isSessionStorageAvailable()) {
    try {
      const st = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const se = sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (st && se && Date.now() <= Number(se)) {
        const tok = deobfuscate(st);
        setRefreshToken(tok, Math.max(0, Number(se) - Date.now()));
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
        return tok;
      }
    } catch {
      // Ignore
    }
  }

  // Legacy: localStorage'dan migration (bir martalik)
  try {
    const legacyToken = localStorage.getItem('refreshToken');
    if (legacyToken) {
      // Yangi storage'ga ko'chirish
      setRefreshToken(legacyToken);
      // Eski joydan o'chirish
      localStorage.removeItem('refreshToken');
      return legacyToken;
    }
  } catch {
    // Ignore
  }

  return null;
};

/**
 * Refresh token'ni o'chirish
 */
export const clearRefreshToken = () => {
  // Memory'ni tozalash
  memoryStorage.refreshToken = null;
  memoryStorage.tokenExpiry = null;

  // localStorage'ni tozalash
  if (isSessionStorageAvailable()) {
    try {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
      // Eski sessionStorage qoldiqlarini ham tozalaymiz (migration)
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    } catch {
      // Ignore
    }
  }

  // Legacy localStorage'ni ham tozalash
  try {
    localStorage.removeItem('refreshToken');
  } catch {
    // Ignore
  }
};

/**
 * Token mavjudligini tekshirish
 * @returns {boolean}
 */
export const hasRefreshToken = () => {
  return !!getRefreshToken();
};

/**
 * Token muddati tugashiga qancha qolganini olish
 * @returns {number} - Millisekund (0 agar token yo'q bo'lsa)
 */
export const getTokenTimeRemaining = () => {
  const token = getRefreshToken();
  if (!token || !memoryStorage.tokenExpiry) return 0;

  const remaining = memoryStorage.tokenExpiry - Date.now();
  return remaining > 0 ? remaining : 0;
};

// ============================================
// Export
// ============================================
export default {
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken,
  hasRefreshToken,
  getTokenTimeRemaining,
};
