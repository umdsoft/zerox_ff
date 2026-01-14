/**
 * ZeroX - Socket.IO Client Plugin
 * Global socket manager orqali WebSocket ulanish
 */

import Vue from 'vue';
import socketManager, { SOCKET_EVENTS } from '@/services/socketManager';

export default function({ app, $auth, store }, inject) {
  console.log('[SocketPlugin] ====== STARTING INITIALIZATION ======');
  console.log('[SocketPlugin] $nuxtSocket available:', !!app.$nuxtSocket);

  // Make SOCKET_EVENTS available globally
  Vue.prototype.$SOCKET_EVENTS = SOCKET_EVENTS;

  // Inject socket manager immediately (components can use it right away)
  inject('socketManager', socketManager);
  console.log('[SocketPlugin] socketManager injected');

  // Initialize socket manager
  const socket = socketManager.init({ app, $auth, store });

  // Inject socket instance
  inject('socket', socket);
  console.log('[SocketPlugin] socket injected');

  // Attach to root for legacy support
  if (app.nuxt && app.nuxt.$root) {
    app.nuxt.$root.socket = socket;
    app.nuxt.$root.socketManager = socketManager;
    console.log('[SocketPlugin] Attached to $root');
  }

  console.log('[SocketPlugin] ====== INITIALIZATION COMPLETE ======');
}
