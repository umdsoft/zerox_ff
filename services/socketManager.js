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

    if (this._isRealSocket && this.socket?.connected) {
      return this.socket;
    }

    if (app?.$nuxtSocket) {
      this._createSocket();
    } else {
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
        this._createSocket();
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
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

      this.socket = this._app.$nuxtSocket(options);
      this._isRealSocket = true;
      this.isInitialized = true;
      Vue.prototype.$socket = this.socket;

      this._setupListeners();
      this._setupStoreWatchers();

    } catch (err) {
      this._createMockSocket();
    }
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
    Vue.prototype.$socket = this.socket;
  }

  // ============================================
  // Event Listeners
  // ============================================

  _setupListeners() {
    if (!this.socket || !this._isRealSocket) return;

    // Connection events
    this.socket.on('connect', () => {
      this._identifyCalled = false;
      this._identify();
      this._startHeartbeat();
      this._notifySubscribers('connect', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      this._identifyCalled = false;
      this._lastIdentifiedUserId = null;
      this._stopHeartbeat();
      this._notifySubscribers('disconnect', { reason });
    });

    this.socket.on('reconnect', (attempt) => {
      this._identifyCalled = false;
      this._lastIdentifiedUserId = null;
      this._identify();
      this._startHeartbeat();
      this._notifySubscribers('reconnect', { attempt });
    });

    this.socket.on('reconnect_attempt', () => {});

    this.socket.on('connect_error', (err) => {
      this._notifySubscribers('connect_error', { error: err?.message });
    });

    // Backend confirmation
    this.socket.on('socket', () => {
      if (!this._identifyCalled) {
        this._identify();
      }
    });

    // Registration confirmation
    this.socket.on('registered', (response) => {
      this._notifySubscribers('registered', response);
    });

    // Notification data
    this.socket.on('recive_notification', (data) => {
      this._notifySubscribers('recive_notification', data);
    });

    // Check if already connected
    if (this.socket.connected) {
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
      this._waitForUserAndIdentify();
      return;
    }

    if (!this.socket?.connected) {
      return;
    }

    if (this._identifyCalled && this._lastIdentifiedUserId === id) {
      return;
    }

    this._identifyCalled = true;
    this._lastIdentifiedUserId = id;
    this.userId = id;

    // Send identification events (register birinchi)
    this.socket.emit('register', { id });

    // 50ms keyin qolgan eventlar
    setTimeout(() => {
      if (this.socket?.connected) {
        this.socket.emit('identify', { id });
        this.socket.emit('subscribe', { uid: id });
      }
    }, 50);

    // Fallback: 1 sekund keyin notification so'rash
    setTimeout(() => {
      if (this.socket?.connected && this.userId === id) {
        this.socket.emit('send_notification', { id });
      }
    }, 1000);
  }

  _waitForUserAndIdentify() {
    let attempts = 0;
    const maxAttempts = 100;

    const check = () => {
      attempts++;
      const id = this._getUserId();

      if (id) {
        this._identifyCalled = false;
        this._identify();
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
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
          if (loggedIn) {
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
            this.userId = newId;
            this._identifyCalled = false;
            if (this.socket?.connected) {
              this._identify();
            }
          }
        }
      );
    } catch (err) {
      // Store watcher error - silent
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
      if (this._auth?.user?.id) {
        return this._auth.user.id;
      }
      if (this._store?.state?.auth?.user?.id) {
        return this._store.state.auth.user.id;
      }
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
