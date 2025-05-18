import Vue from 'vue';

export default ({ app, $auth }, inject) => {
  const socket = app.$nuxtSocket({
    name: 'home',
    channel: '/',
    secure: true,
  });

  // 📌 Global saqlash
  Vue.prototype.$socket = socket;
  inject('socket', socket);
};