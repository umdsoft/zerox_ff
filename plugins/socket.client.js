// plugins/socket.client.js
import Vue from 'vue';

export default ({ app, $auth, store }, inject) => {
  // --- helpers
  const getToken = () => {
    const raw = $auth?.strategy?.token?.get?.() || '';
    return raw.replace(/^Bearer\s+/i, '');
  };
  const getUserId = () => $auth?.user?.id || null;

  // --- create socket instance (nuxt-socket-io)
  const socket = app.$nuxtSocket({
    name: 'home',
    channel: '/',
    default: true,
    reconnection: true,
    secure: false,            // HTTP bo'lsa false, HTTPS bo'lsa true
    // transports: ['websocket'], // xohlasangiz qat'iy faqat websocket
    auth: (() => {            // socket.io v3/v4 uchun tavsiya etilgan usul
      const t = getToken();
      return t ? { token: t } : {};
    })(),
    query: {
      // ba'zi backendlarda hali ham query.id kerak bo'lishi mumkin
      id: getUserId() || undefined
    }
  });

  // --- expose: this.$socket va this.$root.socket
  Vue.prototype.$socket = socket;
  inject('socket', socket);

  // this.$root socket'ini ham set qilamiz (bildirishnoma sahifasi shuni qidiradi)
  const attachToRoot = () => {
    const root = app?.nuxt?.$root;
    if (root) root.socket = socket;
  };
  // Router tayyor bo'lganda root mavjud bo'ladi
  if (app?.router?.onReady) app.router.onReady(attachToRoot);
  else Vue.nextTick(attachToRoot);

  // --- identify helper: backendga user id yuborish (agar kerak bo'lsa)
  const identify = () => {
    const id = getUserId();
    if (socket?.connected && id) {
      // ixtiyoriy identifikatsiya event (server tomonda qo'llab-quvvatlansa)
      socket.emit('identify', { id });
      // birinchi bildirishnomalarni so'rab olamiz
      socket.emit('send_notification', { id });
    }
  };

  // connect/reconnect paytida identify
  socket.on('connect', identify);
  socket.on('reconnect', identify);

  // --- re-auth flow: user o'zgarsa yoki login bo'lsa
  const reauth = () => {
    // 1) yangi tokenni auth'ga qo'yamiz
    const t = getToken();
    if (t) socket.auth = { token: t };
    // 2) ba'zi backendlar query.id ni ham ishlatadi: yangilab qo'yamiz
    const id = getUserId();
    try {
      socket.io.opts.query = { ...(socket.io?.opts?.query || {}), id };
    } catch (e) { /* ignore */ }

    // 3) eski sessiyani yopib, yangisini ochamiz
    if (socket.connected) socket.disconnect();
    socket.connect();
  };

  // --- watch: login/logout holati
  store.watch(
    () => $auth?.loggedIn,
    (logged) => {
      if (logged) {
        reauth();
      } else {
        // logout: toza cleanup
        try { socket.off('recive_notification'); } catch (e) {}
        try { socket.removeAllListeners?.(); } catch (e) {}
        if (socket.connected) socket.disconnect();
      }
    }
  );

  // --- watch: aniq user id o'zgarsa
  store.watch(
    () => $auth?.user?.id,
    (n, o) => {
      if (n && n !== o) reauth();
    }
  );
};
