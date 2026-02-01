/**
 * ZeroX - Socket.IO Client Plugin v3
 * Professional WebSocket connection management
 * MUHIM: Faqat autentifikatsiya qilingan foydalanuvchilar uchun
 */

import socketManager, { SOCKET_EVENTS } from '@/services/socketManager';

// Token'ni localStorage'dan olish
function getStoredToken() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth._token.local');
  if (!token || token === 'false' || token === 'null' || token === 'undefined') {
    return null;
  }
  return token;
}

export default function({ app, $auth, store, $config }, inject) {
  console.log('[SocketPlugin] Initializing...');

  // SOCKET_EVENTS va socketManager'ni inject qilish
  inject('SOCKET_EVENTS', SOCKET_EVENTS);
  inject('socketManager', socketManager);

  // Boshlang'ich holat - socket null
  inject('socket', null);

  // Token tekshirish
  const storedToken = getStoredToken();
  console.log('[SocketPlugin] Stored token exists:', !!storedToken);

  // Token yo'q - ulanmaymiz
  if (!storedToken) {
    console.log('[SocketPlugin] No token, socket disabled');
    return;
  }

  // Socket'ni ishga tushirish funksiyasi
  let socketInitialized = false;

  function initSocket(userId) {
    if (socketInitialized) {
      console.log('[SocketPlugin] Socket already initialized');
      return;
    }

    if (!userId) {
      console.log('[SocketPlugin] Cannot init socket - no user ID');
      return;
    }

    socketInitialized = true;
    console.log('[SocketPlugin] Initializing socket for user:', userId);

    // Socket manager'ni ishga tushirish
    const socket = socketManager.init({ app, $auth, store, $config });

    // Legacy support - faqat app.nuxt.$root ga o'rnatish
    // Vue.prototype.$socket nuxt-socket-io tomonidan boshqariladi
    try {
      if (app.nuxt?.$root) {
        app.nuxt.$root.socket = socket;
        app.nuxt.$root.socketManager = socketManager;
      }
    } catch (e) {
      // Ignore errors
    }

    // Socket ulanganida identify qilish
    if (socketManager.connected) {
      socketManager.forceIdentify(userId);
    } else {
      const unsubscribe = socketManager.subscribe('connect', () => {
        console.log('[SocketPlugin] Socket connected, identifying...');
        socketManager.forceIdentify(userId);
        unsubscribe();
      });
    }
  }

  // Auth user'ni kuzatish
  // Vuex store orqali auth.user o'zgarishini kuzatamiz
  const checkAndInit = () => {
    // 1. $auth.user tekshirish
    if ($auth?.user?.id) {
      console.log('[SocketPlugin] User found via $auth:', $auth.user.id);
      initSocket($auth.user.id);
      return true;
    }

    // 2. Store state tekshirish
    if (store?.state?.auth?.user?.id) {
      console.log('[SocketPlugin] User found via store:', store.state.auth.user.id);
      initSocket(store.state.auth.user.id);
      return true;
    }

    // 3. window.$nuxt tekshirish
    if (typeof window !== 'undefined' && window.$nuxt?.$auth?.user?.id) {
      console.log('[SocketPlugin] User found via $nuxt:', window.$nuxt.$auth.user.id);
      initSocket(window.$nuxt.$auth.user.id);
      return true;
    }

    return false;
  };

  // Darhol tekshirish
  if (checkAndInit()) {
    return;
  }

  // Store watcher - auth.user o'zgarganda
  console.log('[SocketPlugin] Waiting for auth user...');

  const unwatch = store.watch(
    (state) => state.auth?.user?.id,
    (userId) => {
      if (userId) {
        console.log('[SocketPlugin] Auth user loaded:', userId);
        initSocket(userId);
        unwatch();
      }
    },
    { immediate: true }
  );

  // Backup: 2 sekunddan keyin qayta tekshirish
  setTimeout(() => {
    if (!socketInitialized) {
      console.log('[SocketPlugin] Backup check after 2s...');
      if (checkAndInit()) {
        unwatch();
      }
    }
  }, 2000);

  // Backup 2: 5 sekunddan keyin oxirgi urinish
  setTimeout(() => {
    if (!socketInitialized) {
      console.log('[SocketPlugin] Final check after 5s...');
      if (checkAndInit()) {
        unwatch();
      } else {
        console.warn('[SocketPlugin] Could not initialize socket - user not found');
      }
    }
  }, 5000);
}
