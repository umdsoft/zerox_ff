export default function ({ $axios, store, redirect, app }) {
  // Global timeout konfiguratsiyasi
  $axios.defaults.timeout = 30000; // 30 sekund

  // Retry konfiguratsiyasi (exponential backoff)
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 1000; // 1 sekund

  // Retry uchun helper funksiya
  const shouldRetry = (error) => {
    // Faqat network xatolar va 5xx serverlar uchun retry
    if (!error.response) return true; // Network xatosi
    const status = error.response.status;
    return status >= 500 && status < 600;
  };

  $axios.onRequest((config) => {
    if (!config?.falseLoading && config.url !== "/user/me") {
      store.commit("ACTIVE_LOADING");
    }

    // Retry counter qo'shish
    if (!config.retryCount) {
      config.retryCount = 0;
    }

    return config;
  });

  $axios.onResponse((res) => {
    store.commit("FALSE_LOADING");
    return res;
  });

  $axios.onError((error) => {
    store.commit("FALSE_LOADING");

    const config = error.config;

    // Retry logikasi
    if (config && shouldRetry(error) && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;

      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve($axios(config));
        }, delay);
      });
    }

    // 401 Unauthorized - login sahifasiga yo'naltirish
    if (error.response && error.response.status === 401) {
      if (app.$auth && app.$auth.loggedIn) {
        app.$auth.logout();
      }
      redirect(app.localePath({ name: 'auth-login' }));
    }

    return Promise.reject(error);
  });
}
