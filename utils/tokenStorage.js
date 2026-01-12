/**
 * ZeroX - Token Storage Utility
 * Xavfsiz token saqlash va olish
 *
 * MUHIM: refreshToken localStorage'da saqlash XSS hujumlariga zaif.
 * Ideal holda httpOnly cookie ishlatilishi kerak, lekin bu backend o'zgarishini talab qiladi.
 *
 * Hozircha memory + sessionStorage kombinatsiyasi ishlatiladi:
 * - Memory: Eng xavfsiz, lekin sahifa yangilanganda yo'qoladi
 * - SessionStorage: Tab yopilganda tozalanadi (localStorage'dan xavfsizroq)
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
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
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

  // SessionStorage'ga backup (tab yopilganda tozalanadi)
  if (isSessionStorageAvailable()) {
    try {
      sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, obfuscate(token));
      sessionStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, String(expiry));
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

  // SessionStorage'dan tekshirish
  if (isSessionStorageAvailable()) {
    try {
      const token = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const expiry = sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

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

  // SessionStorage'ni tozalash
  if (isSessionStorageAvailable()) {
    try {
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
