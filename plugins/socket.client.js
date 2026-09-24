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

// SS-AUDIT (2026-09-25): debug console.log'lar (token/user id) olib tashlandi
export default function({ app, $auth, store, $config }, inject) {

  // SOCKET_EVENTS va socketManager'ni inject qilish
  inject('SOCKET_EVENTS', SOCKET_EVENTS);
  inject('socketManager', socketManager);

  // Boshlang'ich holat - socket null
  inject('socket', null);

  // Token tekshirish
  const storedToken = getStoredToken();

  // Token yo'q - ulanmaymiz
  if (!storedToken) {
    return;
  }

  // Socket'ni ishga tushirish funksiyasi
  let socketInitialized = false;

  function initSocket(userId) {
    if (socketInitialized) {
      return;
    }

    if (!userId) {
      return;
    }

    socketInitialized = true;

    // Socket manager'ni ishga tushirish
    const socket = socketManager.init({ app, $auth, store, $config });

    // SS-DEV (2026-09-23): "Ulangan qurilmalar"da SHU qurilma tugatilsa — darhol
    // kabinetdan chiqamiz (login sahifasiga). Backend eventni faqat tegishli
    // qurilma socketiga yuboradi; HTTP tomonda ham 401 SESSION_REVOKED keladi.
    socketManager.subscribe('session_revoked', () => {
      try {
        if (typeof app.$sessionLogout === 'function') {
          app.$sessionLogout();
        } else if ($auth) {
          $auth.logout();
        }
      } catch (e) {
        // best-effort
      }
    });

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
      initSocket($auth.user.id);
      return true;
    }

    // 2. Store state tekshirish
    if (store?.state?.auth?.user?.id) {
      initSocket(store.state.auth.user.id);
      return true;
    }

    // 3. window.$nuxt tekshirish
    if (typeof window !== 'undefined' && window.$nuxt?.$auth?.user?.id) {
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

  const unwatch = store.watch(
    (state) => state.auth?.user?.id,
    (userId) => {
      if (userId) {
        initSocket(userId);
        unwatch();
      }
    },
    { immediate: true }
  );

  // Backup: 2 sekunddan keyin qayta tekshirish
  setTimeout(() => {
    if (!socketInitialized) {
      if (checkAndInit()) {
        unwatch();
      }
    }
  }, 2000);

  // Backup 2: 5 sekunddan keyin oxirgi urinish
  setTimeout(() => {
    if (!socketInitialized) {
      if (checkAndInit()) {
        unwatch();
      } else {
        console.warn('[SocketPlugin] Could not initialize socket - user not found');
      }
    }
  }, 5000);
}
