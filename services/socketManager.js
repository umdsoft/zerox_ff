/**
 * ZeroX - Global Socket Manager v3
 * Professional WebSocket connection management
 * socket.io-client to'g'ridan-to'g'ri ishlatiladi
 */

import { io } from 'socket.io-client';

// ============================================
// Constants
// ============================================
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  CONNECT_ERROR: 'connect_error',
  ERROR: 'error',
  RECEIVE_NOTIFICATION: 'recive_notification',
  REGISTERED: 'registered',
  SOCKET_CONFIRMED: 'socket',
  REGISTER: 'register',
  SEND_NOTIFICATION: 'send_notification',
  IDENTIFY: 'identify',
  SUBSCRIBE: 'subscribe',
};

// Token'ni localStorage'dan olish
function getStoredToken() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth._token.local');
  if (!token || token === 'false' || token === 'null' || token === 'undefined') {
    return null;
  }
  return token.replace(/^Bearer\s+/i, '');
}

// ============================================
// Socket Manager Class
// ============================================
class SocketManager {
  constructor() {
    this.socket = null;
    this.isInitialized = false;
    this._isRealSocket = false;
    this.userId = null;
    this.token = null;
    this.subscribers = new Map();
    this._app = null;
    this._auth = null;
    this._store = null;
    this._config = null;
    this._heartbeatTimer = null;
    this._identifyCalled = false;
    this._lastIdentifiedUserId = null;
  }

  // ============================================
  // Initialization
  // ============================================

  init(context) {
    const { app, $auth, store, $config } = context;
    this._app = app;
    this._auth = $auth;
    this._store = store;
    this._config = $config;

    // Token tekshirish
    const storedToken = getStoredToken();
    const userId = this._getUserId();

    console.log('[SocketManager] init - token:', !!storedToken, 'userId:', userId);

    // Token yo'q - mock socket
    if (!storedToken) {
      console.log('[SocketManager] No token, creating mock socket');
      this._createMockSocket();
      return this.socket;
    }

    // Allaqachon ulangan - qaytarish
    if (this._isRealSocket && this.socket?.connected) {
      console.log('[SocketManager] Already connected');
      return this.socket;
    }

    // Socket yaratish
    this._createSocket();

    return this.socket;
  }

  _createSocket() {
    try {
      this.token = getStoredToken();
      this.userId = this._getUserId();

      // Socket URL
      const socketUrl = this._getSocketUrl();
      if (!socketUrl) {
        console.error('[SocketManager] No socket URL configured');
        this._createMockSocket();
        return;
      }

      console.log('[SocketManager] Connecting to:', socketUrl);

      const options = {
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 30000,
        transports: ['polling', 'websocket'],
        upgrade: true,
        withCredentials: false,
        path: '/socket.io/',
        autoConnect: true,
        forceNew: false,
        multiplex: true,
      };

      if (this.token) {
        options.auth = { token: this.token };
      }
      if (this.userId) {
        options.query = { id: this.userId };
      }

      // socket.io-client to'g'ridan-to'g'ri ishlatamiz
      this.socket = io(socketUrl, options);
      this._isRealSocket = true;
      this.isInitialized = true;

      this._setupListeners();
      this._setupStoreWatchers();

      console.log('[SocketManager] Socket created successfully');

    } catch (err) {
      console.error('[SocketManager] Socket creation error:', err);
      this._createMockSocket();
    }
  }

  /**
   * Socket URL'ni aniqlash
   * MUHIM: Frontend va backend ALOHIDA Cloudflare tunnel'larda ishlaydi
   * Shuning uchun nuxt.config.js dagi publicRuntimeConfig.socketURL ishlatiladi
   */
  _getSocketUrl() {
    // Server-side'da default URL
    if (typeof window === 'undefined') {
      return 'http://localhost:5000';
    }

    const currentHost = window.location.host;
    const isLocalhost = currentHost.includes('localhost') || currentHost.includes('127.0.0.1');

    // Localhost'da ishlayotgan bo'lsak, backend portiga ulanamiz
    if (isLocalhost) {
      return 'http://localhost:5000';
    }

    // Remote access - publicRuntimeConfig'dagi socketURL ishlatiladi
    const socketUrl = this._config?.socketURL;
    if (socketUrl) {
      console.log('[SocketManager] Using configured socketURL:', socketUrl);
      return socketUrl;
    }

    // Fallback - agar config yo'q bo'lsa, xatolik
    console.error('[SocketManager] socketURL not configured! Set SOCKET_IO_URL in nuxt.config.js');
    return null;
  }

  _createMockSocket() {
    this.socket = {
      on: () => {},
      off: () => {},
      once: () => {},
      emit: () => false,
      connect: () => {},
      disconnect: () => {},
      connected: false,
      id: null,
    };
    this._isRealSocket = false;
    this.isInitialized = true;
  }

  // ============================================
  // Event Listeners
  // ============================================

  _setupListeners() {
    if (!this.socket || !this._isRealSocket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('[SocketManager] ✅ Connected! Socket ID:', this.socket.id);
      this._identifyCalled = false;
      this._identify();
      this._startHeartbeat();
      this._notifySubscribers('connect', { connected: true, socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketManager] ❌ Disconnected. Reason:', reason);
      this._identifyCalled = false;
      this._lastIdentifiedUserId = null;
      this._stopHeartbeat();
      this._notifySubscribers('disconnect', { reason });
    });

    this.socket.on('reconnect', (attempt) => {
      console.log('[SocketManager] 🔄 Reconnected after', attempt, 'attempts');
      this._identifyCalled = false;
      this._lastIdentifiedUserId = null;
      this._identify();
      this._startHeartbeat();
      this._notifySubscribers('reconnect', { attempt });
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log('[SocketManager] 🔄 Reconnect attempt:', attempt);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[SocketManager] ❌ Connect error:', err?.message || err);
      this._notifySubscribers('connect_error', { error: err?.message });
    });

    // Backend confirmation
    this.socket.on('socket', (msg) => {
      console.log('[SocketManager] 📨 Backend confirmed connection:', msg);
      if (!this._identifyCalled) {
        this._identify();
      }
    });

    // Registration confirmation
    this.socket.on('registered', (response) => {
      console.log('[SocketManager] ✅ User registered:', response);
      this._notifySubscribers('registered', response);
    });

    // Notification data
    this.socket.on('recive_notification', (data) => {
      console.log('[SocketManager] 📬 Notification received:', data?.length || 0, 'items');
      this._notifySubscribers('recive_notification', data);
    });

    // Check if already connected
    if (this.socket.connected) {
      console.log('[SocketManager] Already connected, identifying...');
      this._identify();
      this._startHeartbeat();
    }
  }

  // ============================================
  // Identify User
  // ============================================

  _identify() {
    const id = this._getUserId();

    if (!id) {
      console.log('[SocketManager] ⏳ Waiting for user ID...');
      this._waitForUserAndIdentify();
      return;
    }

    if (!this.socket?.connected) {
      console.log('[SocketManager] ⚠️ Cannot identify - socket not connected');
      return;
    }

    if (this._identifyCalled && this._lastIdentifiedUserId === id) {
      console.log('[SocketManager] ⏭️ Already identified as:', id);
      return;
    }

    this._identifyCalled = true;
    this._lastIdentifiedUserId = id;
    this.userId = id;

    console.log('[SocketManager] 🔐 Identifying user:', id);

    // Send identification events (register birinchi)
    this.socket.emit('register', { id });
    console.log('[SocketManager] 📤 Emitted: register');

    // 50ms keyin qolgan eventlar
    setTimeout(() => {
      if (this.socket?.connected) {
        this.socket.emit('identify', { id });
        this.socket.emit('subscribe', { uid: id });
        console.log('[SocketManager] 📤 Emitted: identify, subscribe');
      }
    }, 50);

    // Fallback: 1 sekund keyin notification so'rash
    setTimeout(() => {
      if (this.socket?.connected && this.userId === id) {
        this.socket.emit('send_notification', { id });
        console.log('[SocketManager] 📤 Emitted: send_notification');
      }
    }, 1000);
  }

  _waitForUserAndIdentify() {
    let attempts = 0;
    const maxAttempts = 150; // 15 sekund kutish

    const check = () => {
      attempts++;
      const id = this._getUserId();

      if (id) {
        console.log('[SocketManager] ✅ User ID found after', attempts, 'attempts:', id);
        this._identifyCalled = false;
        this._identify();
      } else if (attempts < maxAttempts) {
        // Har 50 ta urinishda log
        if (attempts % 50 === 0) {
          console.log('[SocketManager] Still waiting for user ID... (attempt', attempts, ')');
        }
        setTimeout(check, 100);
      } else {
        console.warn('[SocketManager] ⚠️ Max attempts reached, user ID not found');
        // Store watcher orqali keyinroq identify qilinadi
      }
    };

    check();
  }

  // ============================================
  // Heartbeat
  // ============================================

  _startHeartbeat() {
    this._stopHeartbeat();
    this._heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping');
      }
    }, 25000);
  }

  _stopHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
  }

  // ============================================
  // Store Watchers
  // ============================================

  _setupStoreWatchers() {
    if (!this._store || !this._auth) return;

    try {
      this._store.watch(
        () => this._auth?.loggedIn,
        (loggedIn) => {
          console.log('[SocketManager] Auth loggedIn changed:', loggedIn);
          if (loggedIn) {
            this.userId = this._getUserId();
            this._identifyCalled = false;
            if (this.socket?.connected) {
              this._identify();
            }
          }
        },
        { immediate: false }
      );

      this._store.watch(
        () => this._auth?.user?.id,
        (newId, oldId) => {
          console.log('[SocketManager] Auth user.id changed:', oldId, '->', newId);
          if (newId && newId !== oldId) {
            this.userId = newId;
            this._identifyCalled = false;
            if (this.socket?.connected) {
              console.log('[SocketManager] User ID available, identifying...');
              this._identify();
            }
          }
        },
        { immediate: true } // Darhol tekshirish
      );
    } catch (err) {
      console.error('[SocketManager] Store watcher error:', err);
    }
  }

  // ============================================
  // Public API
  // ============================================

  subscribe(event, handler) {
    if (!event || typeof handler !== 'function') return () => {};

    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(handler);

    return () => this.unsubscribe(event, handler);
  }

  unsubscribe(event, handler) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).delete(handler);
    }
  }

  _notifySubscribers(event, data) {
    if (!this.subscribers.has(event)) return;
    this.subscribers.get(event).forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        // Handler error - silent
      }
    });
  }

  emit(event, data) {
    if (!this.socket?.connected) {
      return false;
    }
    this.socket.emit(event, data);
    return true;
  }

  requestNotifications(userId = null) {
    const id = userId || this.userId || this._getUserId();
    if (!id) {
      return false;
    }
    return this.emit('send_notification', { id });
  }

  /**
   * Majburiy ravishda user'ni identify qilish
   * Auth yuklangandan keyin chaqirish mumkin
   */
  forceIdentify(userId = null) {
    const id = userId || this._getUserId();
    if (!id) {
      console.warn('[SocketManager] forceIdentify: No user ID available');
      return false;
    }

    console.log('[SocketManager] Force identifying user:', id);
    this._identifyCalled = false;
    this._lastIdentifiedUserId = null;
    this._identify();
    return true;
  }

  get connected() {
    return this.socket?.connected || false;
  }

  getSocket() {
    return this.socket;
  }

  /**
   * Socket'ni qayta ulash (URL o'zgarganda)
   */
  reconnect() {
    console.log('[SocketManager] 🔄 Reconnecting...');

    // Eski socket'ni tozalash
    if (this.socket) {
      try {
        this.socket.removeAllListeners();
        this.socket.disconnect();
      } catch (_) {}
    }

    this.socket = null;
    this._isRealSocket = false;
    this.isInitialized = false;
    this._identifyCalled = false;
    this._lastIdentifiedUserId = null;
    this._stopHeartbeat();

    // Yangi socket yaratish
    this._createSocket();
  }

  /**
   * Socket'ni to'xtatish
   */
  disconnect() {
    console.log('[SocketManager] Disconnecting...');
    this._stopHeartbeat();

    if (this.socket) {
      try {
        this.socket.removeAllListeners();
        this.socket.disconnect();
      } catch (_) {}
    }

    this.socket = null;
    this._isRealSocket = false;
    this._identifyCalled = false;
    this._lastIdentifiedUserId = null;
  }

  // ============================================
  // Helpers
  // ============================================

  _getToken() {
    return getStoredToken() || '';
  }

  _getUserId() {
    try {
      // 1. Direct auth check
      if (this._auth?.user?.id) {
        return this._auth.user.id;
      }
      // 2. Store state check
      if (this._store?.state?.auth?.user?.id) {
        return this._store.state.auth.user.id;
      }
      // 3. App auth check
      if (this._app?.$auth?.user?.id) {
        return this._app.$auth.user.id;
      }
      // 4. Global $nuxt check (fallback)
      if (typeof window !== 'undefined' && window.$nuxt?.$auth?.user?.id) {
        return window.$nuxt.$auth.user.id;
      }
      return null;
    } catch (err) {
      console.error('[SocketManager] Error getting user ID:', err);
      return null;
    }
  }
}

// Singleton
const socketManager = new SocketManager();
export default socketManager;
