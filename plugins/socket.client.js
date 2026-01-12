/**
 * ZeroX - Socket.IO Client Plugin
 * Global socket manager orqali WebSocket ulanish
 *
 * Bu plugin faqat socketManager'ni ishga tushiradi.
 * Komponentlar socketManager'dan to'g'ridan-to'g'ri foydalanishi kerak.
 *
 * Ishlatilishi:
 * - this.$socketManager.subscribe('recive_notification', handler)
 * - this.$socketManager.emit('send_notification', { id })
 * - this.$socketManager.requestNotifications()
 */

import Vue from 'vue';
import socketManager, { SOCKET_EVENTS } from '@/services/socketManager';

export default ({ app, $auth, store }, inject) => {
  // Initialize socket manager (singleton)
  const socket = socketManager.init({ app, $auth, store });

  // Inject socket manager (recommended)
  inject('socketManager', socketManager);

  // Inject raw socket for legacy compatibility
  // DEPRECATED: Use $socketManager instead
  inject('socket', socket);

  // Also make available on Vue prototype
  Vue.prototype.$socketManager = socketManager;
  Vue.prototype.$SOCKET_EVENTS = SOCKET_EVENTS;

  // Legacy: attach to root (for components using this.$root.socket)
  const attachToRoot = () => {
    try {
      const root = app?.nuxt?.$root;
      if (root) {
        root.socket = socket;
        root.socketManager = socketManager;
      }
    } catch {
      // Ignore
    }
  };

  if (app?.router?.onReady) {
    app.router.onReady(attachToRoot);
  } else {
    Vue.nextTick(attachToRoot);
  }
};
