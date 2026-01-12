/**
 * ZeroX - Global Socket Manager
 * Markazlashtirilgan WebSocket ulanish boshqaruvi
 *
 * BU FAYL SOCKET ULANISHINI GLOBAL BOSHQARADI:
 * - Bitta socket instance butun ilova uchun
 * - Avtomatik reconnection va heartbeat
 * - Event subscription/unsubscription
 * - Memory leak prevention
 *
 * Ishlatilishi:
 * import socketManager from '@/services/socketManager';
 * socketManager.subscribe('recive_notification', handler);
 * socketManager.unsubscribe('recive_notification', handler);
 */

import Vue from 'vue';

// ============================================
// Constants
// ============================================
const SOCKET_EVENTS = {
  // Server events (listen)
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  CONNECT_ERROR: 'connect_error',
  ERROR: 'error',
  RECEIVE_NOTIFICATION: 'recive_notification', // Backend'da shu nom
  ME: 'me',
  MEEE: 'meee',
  REAL_TIME_CHANGE: 'realTimeChange',
  SOCKET_CONFIRMED: 'socket',

  // Client events (emit)
  REGISTER: 'register',
  SEND_NOTIFICATION: 'send_notification',
  IDENTIFY: 'identify',
  SUBSCRIBE: 'subscribe',
  NOTIFICATION: 'notification',
  QUERY: 'query',
};

const CONFIG = {
  RECONNECTION_ATTEMPTS: 10,
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 10000,
  TIMEOUT: 20000,
  HEARTBEAT_INTERVAL: 25000, // 25 sekund
  PING_TIMEOUT: 60000,
};

// ============================================
// Socket Manager Class
// ============================================
class SocketManager {
  constructor() {
    this.socket = null;
    this.isInitialized = false;
    this.isConnected = false;
    this.userId = null;
    this.token = null;

    // Event subscribers (multiple handlers per event)
    this.subscribers = new Map();

    // Heartbeat
    this.heartbeatInterval = null;
    this.lastPong = Date.now();

    // Reconnection state
    this.reconnectAttempts = 0;
    this.isReconnecting = false;

    // Singleton instance reference
    this._app = null;
    this._auth = null;
    this._store = null;

    // Bind methods
    this._onConnect = this._onConnect.bind(this);
    this._onDisconnect = this._onDisconnect.bind(this);
    this._onReconnect = this._onReconnect.bind(this);
    this._onConnectError = this._onConnectError.bind(this);
    this._onError = this._onError.bind(this);
  }

  // ============================================
  // Initialization
  // ============================================

  /**
   * Socket manager'ni ishga tushirish
   * @param {Object} context - Nuxt context { app, $auth, store }
   */
  init(context) {
    if (this.isInitialized) {
      this._log('Already initialized, skipping');
      return this.socket;
    }

    const { app, $auth, store } = context;
    this._app = app;
    this._auth = $auth;
    this._store = store;

    // nuxtSocket mavjudligini tekshirish
    if (!app.$nuxtSocket) {
      this._log('nuxtSocket not available, using mock');
      this._createMockSocket();
      return this.socket;
    }

    try {
      this._createSocket();
      this._setupCoreListeners();
      this._setupStoreWatchers();
      this.isInitialized = true;
      this._log('Initialized successfully');
    } catch (error) {
      this._logError('Initialization failed', error);
      this._createMockSocket();
    }

    return this.socket;
  }

  /**
   * Socket instance yaratish
   */
  _createSocket() {
    this.token = this._getToken();
    this.userId = this._getUserId();

    this.socket = this._app.$nuxtSocket({
      name: 'home',
      channel: '/',
      default: true,
      reconnection: true,
      reconnectionAttempts: CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: CONFIG.RECONNECTION_DELAY,
      reconnectionDelayMax: CONFIG.RECONNECTION_DELAY_MAX,
      timeout: CONFIG.TIMEOUT,
      secure: true,
      transports: ['websocket', 'polling'],
      upgrade: true,
      auth: this.token ? { token: this.token } : {},
      query: {
        id: this.userId || undefined,
      },
    });

    // Vue prototype'ga qo'shish (legacy support)
    Vue.prototype.$socket = this.socket;
  }

  /**
   * Mock socket yaratish (fallback)
   */
  _createMockSocket() {
    this.socket = {
      on: () => this.socket,
      off: () => this.socket,
      once: () => this.socket,
      emit: () => this.socket,
      connect: () => {},
      disconnect: () => {},
      connected: false,
      disconnected: true,
      id: null,
      removeAllListeners: () => {},
      io: { opts: { query: {} } },
    };
    Vue.prototype.$socket = this.socket;
    this.isInitialized = true;
  }

  // ============================================
  // Core Event Listeners
  // ============================================

  _setupCoreListeners() {
    if (!this.socket) return;

    // Remove any existing listeners first
    this.socket.off(SOCKET_EVENTS.CONNECT, this._onConnect);
    this.socket.off(SOCKET_EVENTS.DISCONNECT, this._onDisconnect);
    this.socket.off(SOCKET_EVENTS.RECONNECT, this._onReconnect);
    this.socket.off(SOCKET_EVENTS.CONNECT_ERROR, this._onConnectError);
    this.socket.off(SOCKET_EVENTS.ERROR, this._onError);

    // Add core listeners
    this.socket.on(SOCKET_EVENTS.CONNECT, this._onConnect);
    this.socket.on(SOCKET_EVENTS.DISCONNECT, this._onDisconnect);
    this.socket.on(SOCKET_EVENTS.RECONNECT, this._onReconnect);
    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, this._onConnectError);
    this.socket.on(SOCKET_EVENTS.ERROR, this._onError);

    // Engine level error handling
    if (this.socket.io?.engine) {
      this.socket.io.engine.on('error', (error) => {
        this._logError('Transport error', error);
      });
    }
  }

  _onConnect() {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.isReconnecting = false;
    this._log('Connected', { socketId: this.socket.id });

    // Identify user to backend
    this._identify();

    // Start heartbeat
    this._startHeartbeat();

    // Notify all connect subscribers
    this._notifySubscribers(SOCKET_EVENTS.CONNECT, { connected: true });
  }

  _onDisconnect(reason) {
    this.isConnected = false;
    this._log('Disconnected', { reason });

    // Stop heartbeat
    this._stopHeartbeat();

    // Notify all disconnect subscribers
    this._notifySubscribers(SOCKET_EVENTS.DISCONNECT, { reason });

    // Auto reconnect for certain disconnect reasons
    if (reason === 'io server disconnect') {
      // Server forced disconnect, try to reconnect
      setTimeout(() => this.reconnect(), CONFIG.RECONNECTION_DELAY);
    }
  }

  _onReconnect(attemptNumber) {
    this.isConnected = true;
    this.isReconnecting = false;
    this._log('Reconnected', { attempt: attemptNumber });

    // Re-identify after reconnection
    this._identify();

    // Restart heartbeat
    this._startHeartbeat();

    // Notify subscribers
    this._notifySubscribers(SOCKET_EVENTS.RECONNECT, { attempt: attemptNumber });
  }

  _onConnectError(error) {
    this.reconnectAttempts++;
    this._logError('Connection error', error);

    // Notify subscribers
    this._notifySubscribers(SOCKET_EVENTS.CONNECT_ERROR, { error: error?.message });
  }

  _onError(error) {
    this._logError('Socket error', error);
    this._notifySubscribers(SOCKET_EVENTS.ERROR, { error: error?.message });
  }

  // ============================================
  // Store Watchers
  // ============================================

  _setupStoreWatchers() {
    if (!this._store || !this._auth) return;

    try {
      // Watch login/logout
      this._store.watch(
        () => this._auth?.loggedIn,
        (isLoggedIn) => {
          if (isLoggedIn) {
            this._log('User logged in, reconnecting');
            this.reconnect();
          } else {
            this._log('User logged out, disconnecting');
            this.disconnect();
          }
        }
      );

      // Watch user ID changes
      this._store.watch(
        () => this._auth?.user?.id,
        (newId, oldId) => {
          if (newId && newId !== oldId) {
            this._log('User ID changed', { from: oldId, to: newId });
            this.userId = newId;
            this.reconnect();
          }
        }
      );
    } catch (error) {
      this._logError('Store watcher setup failed', error);
    }
  }

  // ============================================
  // Heartbeat (Keep-Alive)
  // ============================================

  _startHeartbeat() {
    this._stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        // Send ping
        this.socket.emit('ping');
        this.lastPong = Date.now();
      } else {
        // Connection lost, try reconnect
        this._log('Heartbeat failed, reconnecting');
        this.reconnect();
      }
    }, CONFIG.HEARTBEAT_INTERVAL);
  }

  _stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // ============================================
  // Public API - Subscribe/Unsubscribe
  // ============================================

  /**
   * Event'ga subscribe qilish
   * @param {string} event - Event nomi
   * @param {Function} handler - Handler function
   * @returns {Function} - Unsubscribe function
   */
  subscribe(event, handler) {
    if (!event || typeof handler !== 'function') {
      this._logError('Invalid subscribe params', { event, handler });
      return () => {};
    }

    // Add to subscribers map
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());

      // First subscriber for this event - add socket listener
      if (this.socket && !this._isCoreEvent(event)) {
        this.socket.on(event, (data) => this._notifySubscribers(event, data));
      }
    }

    this.subscribers.get(event).add(handler);
    this._log('Subscribed', { event, totalHandlers: this.subscribers.get(event).size });

    // Return unsubscribe function
    return () => this.unsubscribe(event, handler);
  }

  /**
   * Event'dan unsubscribe qilish
   * @param {string} event - Event nomi
   * @param {Function} handler - Handler function
   */
  unsubscribe(event, handler) {
    if (!this.subscribers.has(event)) return;

    const handlers = this.subscribers.get(event);
    handlers.delete(handler);

    this._log('Unsubscribed', { event, remainingHandlers: handlers.size });

    // No more handlers - remove socket listener
    if (handlers.size === 0) {
      this.subscribers.delete(event);

      if (this.socket && !this._isCoreEvent(event)) {
        this.socket.off(event);
      }
    }
  }

  /**
   * Barcha subscriber'larni tozalash (component destroy uchun)
   * @param {Array<string>} events - Event nomlari
   * @param {Object} component - Component instance (handler reference uchun)
   */
  unsubscribeAll(events = [], component = null) {
    events.forEach((event) => {
      if (this.subscribers.has(event)) {
        if (component) {
          // Remove only this component's handlers
          const handlers = this.subscribers.get(event);
          handlers.forEach((handler) => {
            if (handler._component === component) {
              handlers.delete(handler);
            }
          });
        } else {
          // Remove all handlers for this event
          this.subscribers.delete(event);
          if (this.socket && !this._isCoreEvent(event)) {
            this.socket.off(event);
          }
        }
      }
    });
  }

  /**
   * Notify all subscribers of an event
   */
  _notifySubscribers(event, data) {
    if (!this.subscribers.has(event)) return;

    const handlers = this.subscribers.get(event);
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        this._logError(`Handler error for ${event}`, error);
      }
    });
  }

  // ============================================
  // Public API - Emit Events
  // ============================================

  /**
   * Event yuborish
   * @param {string} event - Event nomi
   * @param {any} data - Data
   * @param {Function} callback - Optional callback
   */
  emit(event, data, callback) {
    if (!this.socket?.connected) {
      this._log('Cannot emit - not connected', { event });
      return false;
    }

    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }

    this._log('Emitted', { event, data });
    return true;
  }

  /**
   * Notification so'rash
   * @param {string|number} userId - User ID
   */
  requestNotifications(userId = null) {
    const id = userId || this.userId || this._getUserId();
    if (!id) {
      this._log('Cannot request notifications - no user ID');
      return false;
    }

    return this.emit(SOCKET_EVENTS.SEND_NOTIFICATION, { id });
  }

  /**
   * User'ni register qilish
   * @param {string|number} userId - User ID
   */
  registerUser(userId = null) {
    const id = userId || this.userId || this._getUserId();
    if (!id) return false;

    return this.emit(SOCKET_EVENTS.REGISTER, { id });
  }

  // ============================================
  // Public API - Connection Control
  // ============================================

  /**
   * Socket'ni qayta ulash
   */
  reconnect() {
    if (this.isReconnecting) {
      this._log('Already reconnecting, skipping');
      return;
    }

    this.isReconnecting = true;
    this._log('Reconnecting...');

    // Update credentials
    this.token = this._getToken();
    this.userId = this._getUserId();

    if (this.socket) {
      // Update auth and query
      if (this.token) {
        this.socket.auth = { token: this.token };
      }

      if (this.socket.io?.opts) {
        this.socket.io.opts.query = {
          ...this.socket.io.opts.query,
          id: this.userId,
        };
      }

      // Disconnect and reconnect
      if (this.socket.connected) {
        this.socket.disconnect();
      }

      setTimeout(() => {
        this.socket.connect();
      }, 100);
    }
  }

  /**
   * Socket'ni uzish
   */
  disconnect() {
    this._stopHeartbeat();

    if (this.socket?.connected) {
      this.socket.disconnect();
    }

    this.isConnected = false;
    this._log('Disconnected manually');
  }

  /**
   * Socket'ni to'liq tozalash
   */
  destroy() {
    this._stopHeartbeat();

    // Remove all listeners
    if (this.socket) {
      this.socket.removeAllListeners();
      if (this.socket.connected) {
        this.socket.disconnect();
      }
    }

    // Clear subscribers
    this.subscribers.clear();

    this.socket = null;
    this.isInitialized = false;
    this.isConnected = false;

    this._log('Destroyed');
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * Connection status
   */
  get connected() {
    return this.socket?.connected || false;
  }

  /**
   * Socket ID
   */
  get socketId() {
    return this.socket?.id || null;
  }

  /**
   * Socket instance (for legacy compatibility)
   */
  getSocket() {
    return this.socket;
  }

  // ============================================
  // Private Helpers
  // ============================================

  _identify() {
    const id = this.userId || this._getUserId();
    if (!this.socket?.connected || !id) return;

    this.socket.emit(SOCKET_EVENTS.IDENTIFY, { id });
    this.socket.emit(SOCKET_EVENTS.REGISTER, { id });
    this.socket.emit(SOCKET_EVENTS.SEND_NOTIFICATION, { id });
    this.socket.emit(SOCKET_EVENTS.SUBSCRIBE, { uid: id });

    this._log('Identified', { userId: id });
  }

  _getToken() {
    try {
      const raw = this._auth?.strategy?.token?.get?.() || '';
      return raw.replace(/^Bearer\s+/i, '');
    } catch {
      return '';
    }
  }

  _getUserId() {
    try {
      return this._auth?.user?.id || null;
    } catch {
      return null;
    }
  }

  _isCoreEvent(event) {
    return [
      SOCKET_EVENTS.CONNECT,
      SOCKET_EVENTS.DISCONNECT,
      SOCKET_EVENTS.RECONNECT,
      SOCKET_EVENTS.CONNECT_ERROR,
      SOCKET_EVENTS.ERROR,
    ].includes(event);
  }

  _log(message, data = null) {
    if (process.env.NODE_ENV !== 'production') {
      if (data) {
        console.debug(`[SocketManager] ${message}`, data);
      } else {
        console.debug(`[SocketManager] ${message}`);
      }
    }
  }

  _logError(message, error) {
    console.error(`[SocketManager] ${message}`, error?.message || error);
  }
}

// ============================================
// Singleton Export
// ============================================
const socketManager = new SocketManager();

// Export constants for use in components
export { SOCKET_EVENTS };

export default socketManager;
