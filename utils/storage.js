/**
 * ZeroX - Centralized Storage Utility
 *
 * localStorage bilan ishlash uchun markazlashtirilgan utility
 * Barcha storage operatsiyalari shu yerda bo'lishi kerak
 */

// Storage keys - bir joyda saqlash
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: 'auth._token.local',
  AUTH_REFRESH_TOKEN: 'auth._refresh_token.local',

  // User data
  USER_BALANCE: 'user_balance',
  USER_NOTIFICATIONS: 'user_notifications',
  USER_PREFERENCES: 'user_preferences',

  // App settings
  APP_LANGUAGE: 'app-language',
  APP_THEME: 'app-theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',

  // Cache
  CONTRACTS_CACHE: 'contracts_cache',
  CONTRACTS_CACHE_TIME: 'contracts_cache_time',
};

/**
 * Storage utility object
 */
export const storage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*}
   */
  get(key, defaultValue = null) {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;

      // Try to parse as JSON
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.warn(`[Storage] Error reading "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set item to localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  set(key, value) {
    if (typeof window === 'undefined') return;

    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn(`[Storage] Error writing "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Storage] Error removing "${key}":`, error);
    }
  },

  /**
   * Clear all app-related storage
   */
  clearAll() {
    if (typeof window === 'undefined') return;

    Object.values(STORAGE_KEYS).forEach((key) => {
      this.remove(key);
    });
  },

  // ============================================
  // Convenience Methods
  // ============================================

  // Balance
  getBalance() {
    return Number(this.get(STORAGE_KEYS.USER_BALANCE, 0)) || 0;
  },

  setBalance(value) {
    this.set(STORAGE_KEYS.USER_BALANCE, Number(value) || 0);
  },

  // Notifications
  getNotifications() {
    return this.get(STORAGE_KEYS.USER_NOTIFICATIONS, []);
  },

  setNotifications(notifications) {
    this.set(STORAGE_KEYS.USER_NOTIFICATIONS, Array.isArray(notifications) ? notifications : []);
  },

  // Language
  getLanguage() {
    return this.get(STORAGE_KEYS.APP_LANGUAGE, 'uz');
  },

  setLanguage(lang) {
    this.set(STORAGE_KEYS.APP_LANGUAGE, lang);
  },

  // User preferences
  getPreferences() {
    return this.get(STORAGE_KEYS.USER_PREFERENCES, {});
  },

  setPreferences(prefs) {
    this.set(STORAGE_KEYS.USER_PREFERENCES, prefs);
  },

  updatePreferences(updates) {
    const current = this.getPreferences();
    this.setPreferences({ ...current, ...updates });
  },

  // ============================================
  // Cache Methods
  // ============================================

  /**
   * Get cached data if not expired
   * @param {string} key - Cache key
   * @param {number} maxAge - Max age in milliseconds
   * @returns {*|null}
   */
  getCache(key, maxAge = 5 * 60 * 1000) {
    const timeKey = `${key}_time`;
    const cachedTime = this.get(timeKey);

    if (!cachedTime) return null;

    const isExpired = Date.now() - cachedTime > maxAge;
    if (isExpired) {
      this.remove(key);
      this.remove(timeKey);
      return null;
    }

    return this.get(key);
  },

  /**
   * Set cached data with timestamp
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   */
  setCache(key, value) {
    const timeKey = `${key}_time`;
    this.set(key, value);
    this.set(timeKey, Date.now());
  },

  /**
   * Clear specific cache
   * @param {string} key - Cache key
   */
  clearCache(key) {
    const timeKey = `${key}_time`;
    this.remove(key);
    this.remove(timeKey);
  },
};

export default storage;
