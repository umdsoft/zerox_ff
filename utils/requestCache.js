/**
 * ZeroX - Request Cache & Deduplication
 * Takroriy API so'rovlarini oldini olish va cache qilish
 */

// ============================================
// Request Deduplication
// ============================================

/**
 * In-flight so'rovlarni kuzatish uchun Map
 * Key: request key, Value: Promise
 */
const pendingRequests = new Map();

/**
 * Cache uchun Map
 * Key: cache key, Value: { data, timestamp }
 */
const cache = new Map();

// Default cache TTL (30 sekund)
const DEFAULT_CACHE_TTL = 30000;

// Maximum cache entries
const MAX_CACHE_ENTRIES = 100;

/**
 * Request key yaratish
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} params - Query params
 * @returns {string}
 */
function createRequestKey(method, url, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return `${method}:${url}?${sortedParams}`;
}

/**
 * Cache key yaratish
 * @param {string} url - Request URL
 * @param {Object} params - Query params
 * @returns {string}
 */
export function createCacheKey(url, params = {}) {
  return createRequestKey('GET', url, params);
}

/**
 * Request deduplication wrapper
 * Bir xil so'rovlarni birlashtirib, faqat bitta so'rov yuboradi
 *
 * @param {Function} requestFn - Actual request function
 * @param {string} key - Unique request key
 * @returns {Promise}
 */
export async function deduplicateRequest(requestFn, key) {
  // Agar shu so'rov allaqachon pending bo'lsa, uni qaytarish
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // Yangi so'rov yaratish
  const promise = requestFn()
    .then(result => {
      pendingRequests.delete(key);
      return result;
    })
    .catch(error => {
      pendingRequests.delete(key);
      throw error;
    });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Cache yordamida so'rov
 * Cache'da bo'lsa, darhol qaytaradi
 *
 * @param {Function} requestFn - Actual request function
 * @param {string} key - Cache key
 * @param {number} ttl - Cache TTL in ms
 * @returns {Promise}
 */
export async function cachedRequest(requestFn, key, ttl = DEFAULT_CACHE_TTL) {
  const now = Date.now();

  // Cache'dan tekshirish
  if (cache.has(key)) {
    const cached = cache.get(key);
    if (now - cached.timestamp < ttl) {
      return cached.data;
    }
    // Eskirgan cache'ni o'chirish
    cache.delete(key);
  }

  // Cache limit tekshiruvi
  if (cache.size >= MAX_CACHE_ENTRIES) {
    // Eng eski yozuvlarni o'chirish
    const keysToDelete = Array.from(cache.keys()).slice(0, 20);
    keysToDelete.forEach(k => cache.delete(k));
  }

  // So'rov yuborish (deduplicated)
  const result = await deduplicateRequest(requestFn, key);

  // Cache'ga saqlash
  cache.set(key, {
    data: result,
    timestamp: now,
  });

  return result;
}

/**
 * Specific cache'ni o'chirish
 * @param {string} key - Cache key
 */
export function invalidateCache(key) {
  cache.delete(key);
}

/**
 * Pattern bo'yicha cache'larni o'chirish
 * @param {string} pattern - URL pattern (e.g., '/contract/')
 */
export function invalidateCacheByPattern(pattern) {
  cache.forEach((_, key) => {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  });
}

/**
 * Barcha cache'ni tozalash
 */
export function clearCache() {
  cache.clear();
}

/**
 * Pending so'rovlarni olish
 * @returns {number}
 */
export function getPendingCount() {
  return pendingRequests.size;
}

/**
 * Cache statistikasi
 * @returns {Object}
 */
export function getCacheStats() {
  return {
    size: cache.size,
    pendingRequests: pendingRequests.size,
    maxEntries: MAX_CACHE_ENTRIES,
    defaultTTL: DEFAULT_CACHE_TTL,
  };
}

// ============================================
// Composable for Vue components
// ============================================

/**
 * useCachedRequest composable
 * Vue component'larda ishlatish uchun
 */
export function useCachedRequest() {
  return {
    cachedRequest,
    deduplicateRequest,
    invalidateCache,
    invalidateCacheByPattern,
    clearCache,
    createCacheKey,
    getCacheStats,
  };
}

export default {
  deduplicateRequest,
  cachedRequest,
  invalidateCache,
  invalidateCacheByPattern,
  clearCache,
  createRequestKey,
  createCacheKey,
  getPendingCount,
  getCacheStats,
  useCachedRequest,
};
