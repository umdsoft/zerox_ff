import Vue from 'vue';

export default ({ app, $auth }, inject) => {
  const userId = $auth?.user?.id;

  const socket = app.$nuxtSocket({
    name: 'home',
    channel: '/',
    secure: false, // agar HTTPS bo‘lmasa
    default: true,
    reconnection: true,
    query: {
      id: userId  // ✅ AYNAN shunday bo‘lishi kerak
    }
  });

  Vue.prototype.$socket = socket;
  inject('socket', socket);
};
