/**
 * ZeroX - Global Socket Manager v2
 * Markazlashtirilgan WebSocket ulanish boshqaruvi
 */

import Vue from 'vue';

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
    this._heartbeatTimer = null;
    this._identifyCalled = false;
    this._lastIdentifiedUserId = null;
  }

  // ============================================
  // Initialization
  // ============================================

  init(context) {
    const { app, $auth, store } = context;
    this._app = app;
    this._auth = $auth;
    this._store = store;

    console.log('[SM] Init started');

    if (this._isRealSocket && this.socket?.connected) {
      console.log('[SM] Already have connected real socket');
      return this.socket;
    }

    if (app?.$nuxtSocket) {
      this._createSocket();
    } else {
      console.log('[SM] $nuxtSocket not ready, waiting...');
      this._waitForNuxtSocket();
    }

    return this.socket;
  }

  _waitForNuxtSocket() {
    let attempts = 0;
    const maxAttempts = 100;

    const check = () => {
      attempts++;
      if (this._app?.$nuxtSocket) {
        console.log('[SM] $nuxtSocket ready after', attempts, 'attempts');
        this._createSocket();
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
        console.error('[SM] $nuxtSocket never became available');
        this._createMockSocket();
      }
    };

    check();
  }

  _createSocket() {
    try {
      this.token = this._getToken();
      this.userId = this._getUserId();

      const options = {
        name: 'home',
        channel: '/',
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
      };

      if (this.token) {
        options.auth = { token: this.token };
      }
      if (this.userId) {
        options.query = { id: this.userId };
      }

      console.log('[SM] Creating socket', { userId: this.userId });

      this.socket = this._app.$nuxtSocket(options);
      this._isRealSocket = true;
      this.isInitialized = true;
      Vue.prototype.$socket = this.socket;

      this._setupListeners();
      this._setupStoreWatchers();

      console.log('[SM] Socket created, connected:', this.socket?.connected);

    } catch (err) {
      console.error('[SM] Socket creation failed:', err);
      this._createMockSocket();
    }
  }

  _createMockSocket() {
    console.log('[SM] Creating mock socket');
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
    Vue.prototype.$socket = this.socket;
  }

  // ============================================
  // Event Listeners
  // ============================================

  _setupListeners() {
    if (!this.socket || !this._isRealSocket) return;

    console.log('[SM] Setting up listeners');

    // Connection events
    this.socket.on('connect', () => {
      console.log('[SM] ===== CONNECTED =====', this.socket.id);
      this._identifyCalled = false;
      this._identify();
      this._startHeartbeat();
      this._notifySubscribers('connect', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SM] Disconnected:', reason);
      this._stopHeartbeat();
      this._notifySubscribers('disconnect', { reason });
    });

    this.socket.on('reconnect', (attempt) => {
      console.log('[SM] Reconnected, attempt:', attempt);
      this._identifyCalled = false;
      this._identify();
      this._notifySubscribers('reconnect', { attempt });
    });

    this.socket.on('connect_error', (err) => {
      console.error('[SM] Connect error:', err?.message);
    });

    // Backend confirmation
    this.socket.on('socket', (msg) => {
      console.log('[SM] Socket confirmed:', msg);
    });

    // Registration confirmation
    this.socket.on('registered', (response) => {
      console.log('[SM] ===== REGISTERED =====', response);
      if (response?.success && this.userId) {
        console.log('[SM] Requesting notifications after registration');
        this.socket.emit('send_notification', { id: this.userId });
      }
    });

    // Notification data
    this.socket.on('recive_notification', (data) => {
      console.log('[SM] ===== NOTIFICATION RECEIVED =====', data);
      this._notifySubscribers('recive_notification', data);
    });

    // Check if already connected
    if (this.socket.connected) {
      console.log('[SM] Socket already connected on setup');
      this._identify();
      this._startHeartbeat();
    }
  }

  // ============================================
  // Identify User
  // ============================================

  _identify() {
    // Har safar yangi ID olish
    const id = this._getUserId();

    if (!id) {
      console.log('[SM] No user ID for identify, will retry...');
      // User ID kelmagunicha kutish
      this._waitForUserAndIdentify();
      return;
    }

    if (!this.socket?.connected) {
      console.log('[SM] Socket not connected for identify');
      return;
    }

    // Agar shu user allaqachon identify qilingan bo'lsa
    if (this._identifyCalled && this._lastIdentifiedUserId === id) {
      console.log('[SM] Already identified for user:', id);
      return;
    }

    this._identifyCalled = true;
    this._lastIdentifiedUserId = id;
    this.userId = id;

    console.log('[SM] ===== IDENTIFYING USER =====', id);

    // Send identification events
    this.socket.emit('identify', { id });
    this.socket.emit('register', { id });
    this.socket.emit('subscribe', { uid: id });

    // Fallback: request notifications after 500ms
    setTimeout(() => {
      if (this.socket?.connected) {
        console.log('[SM] Fallback: requesting notifications');
        this.socket.emit('send_notification', { id });
      }
    }, 500);
  }

  _waitForUserAndIdentify() {
    let attempts = 0;
    const maxAttempts = 100; // 10 sekund

    const check = () => {
      attempts++;
      const id = this._getUserId();

      console.log('[SM] Checking for user ID, attempt:', attempts, 'id:', id);

      if (id) {
        console.log('[SM] User ID found after', attempts, 'attempts:', id);
        this._identifyCalled = false; // Reset flag
        this._identify();
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
        console.warn('[SM] User ID not available after max attempts');
      }
    };

    check(); // Start immediately, not with delay
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
          if (loggedIn) {
            console.log('[SM] User logged in');
            this.userId = this._getUserId();
            this._identifyCalled = false;
            if (this.socket?.connected) {
              this._identify();
            }
          }
        }
      );

      this._store.watch(
        () => this._auth?.user?.id,
        (newId, oldId) => {
          if (newId && newId !== oldId) {
            console.log('[SM] User ID changed:', newId);
            this.userId = newId;
            this._identifyCalled = false;
            if (this.socket?.connected) {
              this._identify();
            }
          }
        }
      );
    } catch (err) {
      console.error('[SM] Store watcher error:', err);
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

    console.log('[SM] Subscribed to', event);

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
        console.error('[SM] Handler error:', err);
      }
    });
  }

  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn('[SM] Cannot emit, not connected');
      return false;
    }
    this.socket.emit(event, data);
    console.log('[SM] Emitted', event, data);
    return true;
  }

  requestNotifications() {
    const id = this.userId || this._getUserId();
    if (!id) return false;
    return this.emit('send_notification', { id });
  }

  get connected() {
    return this.socket?.connected || false;
  }

  getSocket() {
    return this.socket;
  }

  // ============================================
  // Helpers
  // ============================================

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
      // Try multiple ways to get user ID
      if (this._auth?.user?.id) {
        return this._auth.user.id;
      }
      // Try from store
      if (this._store?.state?.auth?.user?.id) {
        return this._store.state.auth.user.id;
      }
      // Try from app context
      if (this._app?.$auth?.user?.id) {
        return this._app.$auth.user.id;
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Singleton
const socketManager = new SocketManager();
export default socketManager;
