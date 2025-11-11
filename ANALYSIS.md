# Zerox Loan Platform Codebase Analysis

## 1. Project Overview

### 1.1 Directory Structure
```
README.md
assets/
  img/
    … (marketing assets)
  style/
    actModalStyles.css
    style.css
  styles.css
  styles.scss
components/
  ActModal.vue
  LoadingBar.vue
  Notification.vue
  NotificationModal.vue
  … (additional feature-specific components)
layouts/
  default.vue
lang/
  uz.js
  ru.js
  kr.js
libs/
  eimzo.js
middleware/
  auth.js
  checkRole.js
  language.js
  socket.js (empty)
pages/
  index.vue
  notification/index.vue
  mobil-hisob/index.vue
  … (30+ feature routes)
plugins/
  socket.client.js
  axios.js
  main.js
  globalFunctions.js
  router-client.js
  … (UI integrations)
services/
  eimzo/
    index.js
static/
  loading.html
  logo.ico
store/
  index.js
  notification.js
styles/
  global.css
nuxt.config.js
package.json
```

### 1.2 Technology Stack
- **Framework**: Nuxt.js 2.15 (SPA mode `ssr: false`, `target: 'static'`).【F:nuxt.config.js†L39-L80】
- **Language**: Vue 2 single-file components, JavaScript (no TypeScript adoption).
- **State Management**: Vuex (global modules `index.js`, `notification.js`).【F:store/index.js†L1-L79】【F:store/notification.js†L1-L31】
- **UI/Styling**: Tailwind CSS (`@nuxtjs/tailwindcss`), custom SCSS/CSS assets, FontAwesome, Swiper.
- **Auth & Networking**: `@nuxtjs/auth-next` (local strategy) with `@nuxtjs/axios` targeting https://app.zerox.uz/api/v1 APIs.【F:nuxt.config.js†L179-L199】【F:nuxt.config.js†L201-L208】
- **Realtime**: Socket.IO via `nuxt-socket-io` + custom client plugin.【F:nuxt.config.js†L110-L120】【F:plugins/socket.client.js†L4-L96】
- **Other Integrations**: E-IMZO signing (`services/eimzo`), ApexCharts, Quill editor, html2pdf, toast notifications, Yandex Metrika.

### 1.3 Dependency Audit
Key runtime dependencies from `package.json` include: authentication (`@nuxtjs/auth-next`), i18n, toast, websocket (`nuxt-socket-io`, `@deepsource/nuxt-websocket` unused), numerous chart/PDF libraries, and legacy libraries like `node-sass` (deprecated).【F:package.json†L7-L58】 Dev dependencies rely on Tailwind, Nuxt image, FontAwesome, and Sass tooling.【F:package.json†L59-L68】

`yarn audit --summary` fails because the lockfile lacks the workspace entry (`gov_project@workspace:.: This package doesn't seem to be present in your lockfile`).【488703†L1-L10】 This indicates inconsistent package management and blocks vulnerability scanning.

## 2. Nuxt Configuration Analysis
- **Duplicate `router` definitions**: The second `router` block (scroll behavior) overwrites the first, so middleware `['language', 'auth']` and custom active classes never execute. Auth-only pages become publicly accessible—critical security regression.【F:nuxt.config.js†L72-L154】
- **Socket configuration**: `io.sockets[0].url` points to production with TLS, yet the client plugin forces `secure: false`, causing mixed-mode warnings and handshake failures over HTTPS.【F:nuxt.config.js†L110-L118】【F:plugins/socket.client.js†L13-L28】
- **Build optimizations**: `build` section is empty—no transpile directives for legacy libs, no chunk optimization, no analyze usage beyond manual script. SPA mode plus numerous client-only plugins inflates bundles.
- **Plugins**: Many client-only plugins load globally (ApexCharts, Quill, html2Pdf) regardless of usage, increasing initial payload. Mixed path aliases (`./`, `@/`, `~/`) hamper tooling. No guard to ensure auth is ready before socket plugin runs.
- **Axios base headers**: Setting `Access-Control-Allow-Origin` on client requests has no effect and should be removed.【F:nuxt.config.js†L201-L208】

## 3. Socket.IO Deep Dive
### 3.1 Client Setup
- Custom plugin instantiates a socket immediately with `secure: false`, adds bearer tokens via `auth`, and registers `$auth` watchers.【F:plugins/socket.client.js†L13-L95】
- Watchers created with `store.watch` are never unsubscribed, leaking watchers and socket listeners after logout or navigation.
- Plugin injects the socket globally but mutates `socket.io.opts.query` without checking `socket.io` existence, which can throw on reconnect.

### 3.2 Usage in Components/Store
- `pages/notification/index.vue` re-creates sockets via `$nuxtSocket`, handles backoff, and duplicates logic already in the plugin, causing double connections and handlers.【F:pages/notification/index.vue†L1-L205】
- `store/notification.js` registers listeners but assumes `data.notification` exists and never tears listeners down when components unmount.【F:store/notification.js†L18-L30】
- Header and mobile-balance views also attach listeners manually, leading to inconsistent lifecycle management.

### 3.3 Server-Side Setup
- No server implementation is present. The client expects events `recive_notification`, `register`, `send_notification`, so maintainers rely on production behavior for debugging.

### 3.4 Issues
- **Auth sync**: Token refresh relies solely on Vuex watchers; it doesn't hook into `@nuxtjs/auth` refresh events, so stale tokens persist.
- **Reconnection**: Plugin-level `disconnect/connect` plus page-level exponential backoff can trigger reconnect storms.
- **Namespace management**: Only the root namespace `/` is used despite module support for multiple sockets; rooms/namespaces are unmanaged.
- **Error handling**: Failures are swallowed (`catch (e) { /* ignore */ }`), so operators have no visibility.
- **Memory leaks**: Missing cleanup for both Vuex watchers and socket listeners in plugin and pages risks growing listener counts.

## 4. Code Quality Issues
- **Missing ESLint/Prettier**: No lint/format tooling is configured, leading to inconsistent style and undetected issues.
- **Dead code/typos**: `store/index.js` mutation assigns `state.socket = socket;` instead of the provided argument, so the socket reference is never stored.【F:store/index.js†L25-L27】 Empty `middleware/socket.js` remains committed.【F:middleware/socket.js†L1-L1】
- **Console noise**: Numerous `console.log` statements remain across auth middleware, notification flows, and pages.【78b5b8†L1-L76】
- **Duplicate imports & unused code**: `components/Notification.vue` imports the same component twice and keeps unused helpers (`conVremya2`).【F:components/Notification.vue†L102-L155】
- **Magic numbers**: Extreme z-index values and string duration in config reduce readability.【F:components/ActModal.vue†L49-L63】【F:nuxt.config.js†L168-L171】
- **Naming inconsistencies**: Mixed casing conventions in Vuex mutations and methods; payload arguments ignored (e.g., `Media_Menu_Close`).【F:store/index.js†L70-L78】
- **Lack of DRY**: Notification rendering repeats dozens of near-identical blocks instead of using configuration-driven rendering.【F:components/Notification.vue†L4-L99】

## 5. Security Vulnerabilities
- **Middleware bypass (Critical)**: Duplicate router config removes `middleware: ['language', 'auth']`, exposing authenticated pages.【F:nuxt.config.js†L72-L154】
- **Hardcoded secrets**: E-IMZO API keys and domain whitelists live in client bundle, enabling key theft.【F:services/eimzo/index.js†L5-L15】
- **XSS risks**: Raw API HTML injected via `v-html` without sanitization (news details, timer helpers) allows stored XSS.【F:pages/news/_id.vue†L1-L52】
- **CSRF exposure**: Auth relies solely on bearer tokens; no CSRF tokens or SameSite strategy for sensitive POSTs.
- **Token leakage**: Socket auth transmits tokens without forcing TLS (`secure: false`), allowing downgrade attacks.【F:plugins/socket.client.js†L13-L28】
- **Dependency vulnerabilities**: Audit cannot run due to broken Yarn workspace; deprecated packages (`node-sass`) remain.【488703†L1-L10】【F:package.json†L59-L63】
- **CORS misconfiguration**: Client attempts to set `Access-Control-Allow-Origin`, which has no effect and may mask server issues.【F:nuxt.config.js†L201-L208】

## 6. Error Handling & Logging
- Axios plugin only toggles loading state and ignores error details; no centralized logging or 401 handling.【F:plugins/axios.js†L1-L12】
- Components catch errors but merely show toasts or swallow exceptions, obscuring failures.【F:components/Notification.vue†L186-L270】【F:pages/notification/index.vue†L206-L323】
- No global error boundary or `error()` usage; user feedback on catastrophic failures is undefined.
- Logging strategy is absent; debugging relies on ad-hoc console statements.

## 7. Performance Issues
- Heavy plugins (Quill, ApexCharts, html2pdf) load on every page, inflating bundles.【F:nuxt.config.js†L47-L70】
- SPA mode (`ssr: false`) shifts all rendering to the client, increasing time-to-first-byte for slow networks.
- `@nuxt/image` is installed but unused; static images remain unoptimized.
- Notification component enumerates many `v-if` blocks, causing inefficient render diffs.【F:components/Notification.vue†L4-L99】
- Notification page serializes notifications to `localStorage` on each update, potentially blocking the main thread.【F:pages/notification/index.vue†L206-L323】
- No caching or memoization strategies beyond manual localStorage usage.

## 8. State Management (Vuex)
- Global store remains flat; socket mutation bug blocks storing socket instances.【F:store/index.js†L25-L27】
- Most async flows live inside components instead of Vuex actions, duplicating logic and complicating testing.
- No persistence layer; components directly touch localStorage, leading to inconsistent state hydration.
- Concurrent toggling of `isLoading` across components can cause flicker because there is no request counter.

## 9. API Integration
- Components call endpoints directly with interpolated IDs, duplicating request logic and complicating error handling.【F:components/Notification.vue†L186-L270】
- No retry or exponential backoff for Axios requests; transient failures require manual reloads.
- Auth strategy disables logout endpoint, so revoked tokens persist client-side until manual cleanup.【F:nuxt.config.js†L193-L197】
- Rate limiting or debounce is absent; repeated clicks can spam APIs.

## 10. Critical Files
### 10.1 `package.json`
```json
{
    "name": "gov_project",
    "version": "1.0.0",
    "private": true,
    "scripts": {
        "dev": "nuxt --host",
        "build": "nuxt build",
        "start": "nuxt start",
        "generate": "nuxt generate",
        "analyze": "nuxt build --analyze"
    },
    "dependencies": {
        "@deepsource/nuxt-websocket": "^1.0.0",
        "@fortawesome/free-brands-svg-icons": "^5.15.3",
        "@fortawesome/free-solid-svg-icons": "^5.15.3",
        "@fortawesome/vue-fontawesome": "^2.0.9",
        "@nuxtjs/auth-next": "^5.0.0-1648802546.c9880dc",
        "@nuxtjs/axios": "^5.13.6",
        "@nuxtjs/i18n": "^7.2.0",
        "@nuxtjs/toast": "^3.3.1",
        "@nuxtjs/yandex-metrika": "^1.4.0",
        "apexcharts": "^3.36.3",
        "base-64": "^1.0.0",
        "console": "^0.7.2",
        "core-js": "^3.15.1",
        "dateformat": "^5.0.3",
        "html2pdf.js": "^0.9.2",
        "jsonwebtoken": "^8.5.1",
        "nuxt": "^2.15.8",
        "nuxt-socket-io": "^2.0.3",
        "pdfjs-dist": "^2.10.377",
        "sweetalert2": "^11.22.2",
        "swiper": "^5.4.5",
        "v-mask": "^2.3.0",
        "v-qr": "^0.0.2",
        "vue-ads-pagination": "^2.1.7",
        "vue-apexcharts": "^1.6.2",
        "vue-awesome": "^4.5.0",
        "vue-awesome-swiper": "^4.1.1",
        "vue-excel-xlsx": "^1.0.11",
        "vue-html2pdf": "^1.8.0",
        "vue-pagination-2": "^3.1.0",
        "vue-pdf": "^4.3.0",
        "vue-qr": "^4.0.6",
        "vue-quill-editor": "^3.0.6",
        "vue-tel-input": "^5.11.0",
        "vue2-datepicker": "^3.11.0",
        "vuelidate": "^0.7.7",
        "ws": "^8.13.0"
    },
    "devDependencies": {
        "@nuxt/image": "^0.7.1",
        "@nuxtjs/fontawesome": "^1.1.2",
        "@nuxtjs/tailwindcss": "^4.2.0",
        "libvips": "^0.0.2",
        "node-sass": "^6.0.1",
        "postcss": "^8.3.5",
        "sass": "^1.43.4",
        "sass-loader": "^10.2.0"
    }
}
```

### 10.2 `nuxt.config.js`
```js
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "ZeroX - ishonch kafolati",
    htmlAttrs: {
      lang: "uz",
    },

    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "ZeroX - ishonch kafolati",
      },
      { name: "format-detection", content: "telephone=no" },
      {
        name: "theme-color",
        content: "#4F92D4",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/logo.ico" },
      {
        rel: "stylesheet",
        href: "https://pro.fontawesome.com/releases/v5.10.0/css/all.css",
        integrity:
          "sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p",
        crossorigin: "anonymous",
      },
    ],
    script: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-J26T5ZP6TZ",
      },
    ],
  },
  ssr: false,
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/assets/style/style.css",
    "@/assets/styles.scss",
    "@/styles/global.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "@/plugins/pagination.js", ssr: false },
    { src: "@/plugins/datepicker.js", ssr: false },
    { src: "@/plugins/html2Pdf.js", ssr: false },
    { src: "@/plugins/main.js", ssr: false },
    { src: "@/plugins/v-icon.js", ssr: false },
    { src: "./plugins/v-mask.js" },
    { src: "./plugins/v-format.js" },
    { src: "./plugins/swiper.js" },
    { src: "./plugins/axios.js" },
    { src: "@/plugins/vue-apexchart.js", ssr: false },
    { src: "./plugins/eimzo.js", ssr: false },
    { src: "./plugins/vuelidate.js", ssr: false },
    { src: "./plugins/vue-tel-input.js", ssr: false },
    { src: "~/plugins/globalFunctions.js", ssr: false },
    { src: "~/plugins/router-client.js", ssr: false },
    { src: "~/plugins/socket.client.js", ssr: false },
    { src: "~/plugins/i18n.js", mode: "client", ssr: false },
    { src: "~/plugins/vue-quill-editor.js", mode: "client" },
    { src: "~/plugins/clock.js", ssr: false },
    { src: "~/plugins/i18n-back.js", ssr: false },
    { src: "~/plugins/i18n-back.client.js", mode: "client" },
  ],

  router: {
    middleware: ["language", "auth"], // ⬅️ shu tariqa qo‘ying
    linkActiveClass: "your-custom-active-link",
    linkExactActiveClass: "your-custom-exact-active-link",
  },
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  target: "static",
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/fontawesome",
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "nuxt-socket-io",
    "@nuxtjs/i18n",
    "@nuxtjs/auth-next",
    "@nuxtjs/toast",
    [
      "@nuxtjs/yandex-metrika",
      {
        id: "90314930",
        webvisor: true,
        // clickmap:true,
        // useCDN:false,
        // trackLinks:true,
        // accurateTrackBounce:true,
      },
    ],
  ],

  // loadingIndicator: "~/static/loading.html",
  // loading: "~/components/LoadingBar.vue",
  io: {
    // module options
    sockets: [
      {
        name: "home",
        // url: "http://localhost:5000",
        default: true,
        url: "https://app.zerox.uz",
      },
    ],
  },

  router: {
    scrollBehavior: async (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }

      const findEl = async (hash, x) => {
        return (
          document.querySelector(hash) ||
          new Promise((resolve, reject) => {
            if (x > 50) {
              return resolve();
            }
            setTimeout(() => {
              resolve(findEl(hash, ++x || 1));
            }, 100);
          })
        );
      };

      if (to.hash) {
        let el = await findEl(to.hash);
        if ("scrollBehavior" in document.documentElement.style) {
          return window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        } else {
          return window.scrollTo(0, el.offsetTop);
        }
      }

      return { x: 0, y: 0 };
    },
    linkActiveClass: "nuxt-link-active",
  },
  i18n: {
    locales: [
      { code: "uz", file: "uz.js" },
      { code: "ru", file: "ru.js" },
      { code: "kr", file: "kr.js" },
    ],
    lazy: true,
    defaultLocale: "uz",
    langDir: "lang/",
    detectBrowserLanguage: false,
    strategy: "prefix_except_default",
  },

  toast: {
    duration: "3000",
    pauseOnHover: true,
  },
  fontawesome: {
    component: "fa",
    icons: {
      solid: true,
      brands: true,
    },
  },
  auth: {
    redirect: {
      login: "/auth/login",
      logout: "/",
      callback: "/",
      // home: false,
    },
    strategies: {
      local: {
        user: {
          property: "data",
          global: true,
          autoFetch: true,
        },
        endpoints: {
          login: { url: "user/login", method: "post" },
          user: { url: "/user/me", method: "get" },
          logout: false,
        },
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseURL: "http://localhost:5000/api/v1",
    baseURL: "https://app.zerox.uz/api/v1",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
```

### 10.3 `plugins/socket.client.js`
```js
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
```

### 10.4 Vuex Store
```js
export const state = () => ({
  isLoading: false,
  isOpen: false,
  actType: "",
  contractData: {},
  end_date: null,
  isActModalOpen: false,
  isContractModalOpen: false,
  links: [],
  myInfo: [],
  isModal: false,
  partialAmount: 0,
  renderIndex: 0,
  socket: null,
});
export const getters = {
  isModalInfo: (s) => s.isModal,
};
export const actions = {
  IsActiveModal({ dispatch, commit }) {
    commit("ACTIVE_MODAL");
  },
};
export const mutations = {
  socket(state, socketInstance) {
    state.socket = socket;
  },
  changeRenderIndex(state) {
    state.renderIndex = state.renderIndex + 1;
  },
  changePartialAmount(state, data) {
    state.partialAmount = data;
  },
  changeLoading(state, data) {
    state.isLoading = data;
  },
  ACTIVE_MODAL(state) {
    state.isModal = !state.isModal;
  },
  SHOW_ACT_MODAL(state, payload) {
    state.actType = payload.type;
    state.contractData = payload.contract;
    state.contractData.act = payload.act;
    state.end_date = payload.time;
    state.isActModalOpen = true;
  },
  SHOW_CONTRACT_MODAL(state, payload) {
    state.actType = payload.type;
    state.contractData = payload.contract;
    state.isModal = true;
    state.isContractModalOpen = true;
  },
  HIDE_CONTRACT_MODAL(state, data) {
    (state.isContractModalOpen = false), (state.contractData = {});
  },
  HIDE_ACT_MODAL(state, data) {
    (state.isActModalOpen = false), (state.contractData = {});
  },

  SET_MYINFO(state, data) {
    state.myInfo = data;
  },

  ACTIVE_LOADING(state) {
    state.isLoading = true;
  },
  FALSE_LOADING(state) {
    state.isLoading = false;
  },
  Media_Menu_Open(state) {
    state.isOpen = true;
  },
  Media_Menu_Close(state) {
    state.isOpen = false;
  },
  changeBreadCrumb(state, data) {
    state.links = data;
  },
};
```

```js
// store/notification.js
export const namespaced = true;

export const state = () => ({
  notifications: [],
  balance: 0,
});

export const mutations = {
  setNotifications(state, data) {
    state.notifications = data;
  },
  setBalance(state, amount) {
    state.balance = amount;
  },
};

export const actions = {
  registerSocketListeners({ commit }, { socket, userId }) {
    socket.off("recive_notification");

    socket.on("recive_notification", (data) => {
      const filtered = data.notification.filter((n) => n.reciver === userId);
      commit("setNotifications", filtered); // 👈 bu mutatsiyalar endi local bo'ladi
      commit("setBalance", data.amount?.balance || 0);
    });

    socket.emit("register", { id: userId });
    socket.emit("send_notification", { id: userId });
  },
};
```

### 10.5 Key Components
```vue
// components/Navbar.vue
<template>
  <div class="nav !block !md:flex">
    <div class="media-navas px-6 py-3.5 rounded-xl bg-white" style="padding-bottom: 1.5rem">
      <div class="flex justify-center mb-3.5">

        <nuxt-link :to="localePath({ name: 'index' })">
          <img v-if="$i18n.locale == 'ru'" src="@/assets/img/logo_ru.svg" alt="" width="170" />
          <img v-if="$i18n.locale == 'uz'" src="@/assets/img/logo.svg" alt="" width="170" />
          <img v-if="$i18n.locale == 'kr'" src="@/assets/img/logo_kr.svg" alt="" width="170" />
        </nuxt-link>
      </div>
      <hr />
      <div class="ml-6 mr-7">
        <nuxt-link :to="localePath({ name: 'auth-login' })">
          <div @click="$store.commit('Media_Menu_Close', false)" style="background-color: white; cursor: pointer"
            class="flex mt-4 px-2 py-2 rounded items-center">
            <nuxt-link :to="localePath({ name: 'index' })">
              <div class="mr-3">
                <svg width="55" height="55" viewBox="0 0 15 15" fill="#3182CE" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.74534 1.89199C9.17522 1.27646 8.37893 0.9375 7.50003 0.9375C6.61643 0.9375 5.81751 1.27441 5.25003 1.88613C4.6764 2.50459 4.3969 3.34512 4.46253 4.25273C4.59261 6.04336 5.9552 7.5 7.50003 7.5C9.04485 7.5 10.4051 6.04365 10.5372 4.25332C10.6037 3.35391 10.3225 2.51514 9.74534 1.89199Z" />
                  <path
                    d="M12.6564 14.0625H2.34392C2.20894 14.0643 2.07526 14.0359 1.95262 13.9795C1.82997 13.9231 1.72145 13.84 1.63493 13.7364C1.4445 13.5088 1.36775 13.1979 1.42458 12.8836C1.67185 11.5119 2.44353 10.3597 3.65642 9.55078C4.73396 8.83271 6.0989 8.4375 7.50016 8.4375C8.90143 8.4375 10.2664 8.83301 11.3439 9.55078C12.5568 10.3594 13.3285 11.5116 13.5757 12.8833C13.6326 13.1977 13.5558 13.5085 13.3654 13.7361C13.2789 13.8398 13.1704 13.9229 13.0478 13.9794C12.9251 14.0358 12.7914 14.0642 12.6564 14.0625Z" />
                </svg>
              </div>
            </nuxt-link>
            <div class="">
              <div class="">
                <h2 style="font-size: 12px" class="font-s font-bold">
                  {{ $t('a1.a39') }}
                </h2>
              </div>
              <div class="login__btn mt-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.6667 0H1.33333C0.593333 0 0 0.593333 0 1.33333V4H1.33333V1.33333H10.6667V10.6667H1.33333V8H0V10.6667C0 11.0203 0.140476 11.3594 0.390524 11.6095C0.640573 11.8595 0.979711 12 1.33333 12H10.6667C11.0203 12 11.3594 11.8595 11.6095 11.6095C11.8595 11.3594 12 11.0203 12 10.6667V1.33333C12 0.979711 11.8595 0.640573 11.6095 0.390524C11.3594 0.140476 11.0203 0 10.6667 0ZM4.72 8.38667L5.66667 9.33333L9 6L5.66667 2.66667L4.72 3.60667L6.44667 5.33333H0V6.66667H6.44667L4.72 8.38667Z"
                    fill="white" />
                </svg>
                <h2 class="text-center ml-3 font-bold">{{ $t('debt_list.a89') }}</h2>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .nav {
    height: 100%;

    .rounded-xl {
      border-radius: 0 !important;
    }
  }

  .media-navas {
    border-radius: 0 !important;
    height: 100%;
  }
}

.login__btn {
  width: max-content;
  font-size: 12px;
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 5px 18px;
  background: #3182ce;
  color: white;
  border-radius: 5px;
}
</style>
```

```vue
// components/LoadingBar.vue
<template>
  <div class="loading-page-2" v-if="$store.state.isLoading">
    <div class="loading-logo-2">
      <div class="loading-2"></div>
      <img src="@/assets/img/logo.png" alt="ZeroX" />
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingBar",
  data() {
    return {
      loading: false,
    };
  },

  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.loading-page-2 {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
}
.loading-logo-2 {
  width: 5rem;
  height: 5rem;
  position: relative;
  display: flex;
  align-items: center;
}
.loading-logo-2 img {
  width: 3rem;
  height: 3rem;
  display: block;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: auto;
  object-fit: contain;
}

.loading-2 {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 12px solid #3182ce18;
  border-radius: 50%;
  border-top-color: #3182ce;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
```

```vue
// components/NotificationModal.vue
<template>
  <div v-if="showModal && item._id" class="notification text-sm bg-white">
    <div class="flex justify-between items-center mt-2">
      <p class="text-gray-600 mb-2">Bildirishnoma</p>
      <svg @click="closeModal" class="h-5 w-5 text-black" style="cursor: pointer" width="24" height="24"
        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>

    <h5 v-if="item.type == 0" class="text-gray-800 mt-2 font-semibold">
      Qarz olish (berish) to`g`risida bildirishnoma
    </h5>
    <div v-if="item.type == 0">
      <p class="mt-2">
        Fuqaro
        <b v-if="$auth.user._id == item.creditor._id">{{
          `${item.debitor.first_name} ${item.debitor.last_name} ${item.debitor.middle_name}`
          }}</b>

        <b v-else>{{
          `${item.creditor.first_name} ${item.creditor.last_name} ${item.creditor.middle_name}`
          }}</b>
        bqlaysizmi?
      </p>
      ilan sizning o`rtangizda
      <b>{{ item.contract.amount }} {{ item.contract.currency }}</b> qarz olish
      (berish) bo`yicha <b>{{ item.contract.date }}</b> sanada
      <b>{{ item.contract.number }}</b>-sonli qarz shartnomasi rasmiylashtirilmoqda. “Tasdiqlash”ni tanlasangiz,
      qarz shartnomasi rasmiylashtiriladi hamda mobil hisobingizdan 1000 so'm
      to’lov amalga oshiriladi. Qarz shartnomasini tasdi
    </div>

    <div v-if="item.type == 1">
      <p class="mt-2">
        Fuqaro
        <b v-if="$auth.user._id == item.creditor._id">{{
          `${item.debitor.first_name} ${item.debitor.last_name} ${item.debitor.middle_name}`
          }}</b>

        <b v-else>{{
          `${item.creditor.first_name} ${item.creditor.last_name} ${item.creditor.middle_name}`
          }}</b>
        bqlaysizmi?
      </p>
      ilan sizning o`rtangizda
      <b>{{ item.contract.amount }} {{ item.contract.currency }}</b> qarz olish
      (berish) bo`yicha <b>{{ item.contract.date }}</b> sanada
      <b>{{ item.contract.number }}</b> Fuqaro Eshmatov Toshmat Gishmatovich
      01.01.2021 yildagi 1sonli qarz shartnomasiga asosan sizdan qarz mablag`ini
      qisman qaytarishingizni talab qilmoqda.
    </div>

    <div v-if="item.type == 2">
      <p class="mt-2">
        Fuqaro
        <b v-if="$auth.user._id == item.creditor._id">{{
          `${item.debitor.first_name} ${item.debitor.last_name} ${item.debitor.middle_name}`
          }}</b>

        <b v-else>{{
          `${item.creditor.first_name} ${item.creditor.last_name} ${item.creditor.middle_name}`
          }}</b>
        bqlaysizmi?
      </p>
      ilan sizning o`rtangizda
      <b>{{ item.contract.amount }} {{ item.contract.currency }}</b> qarz olish
      (berish) bo`yicha <b>{{ item.contract.date }}</b> sanada
      <b>{{ item.contract.number }}</b> Fuqaro Eshmatov Toshmat Gishmatovich
      01.01.2021 yildagi 1sonli qarz shartnomasiga asosan sizdan qarz mablag`ini
      to'liq qaytarishingizni talab qilmoqda.
    </div>
    <div v-if="item.type == 0">
      <div class="flex justify-end mt-4">
        <button @click="affirm" class="bg-blue-500 py-2 px-4 mx-2 rounded font-semibold text-white">
          Tasdiqlash
        </button>
        <button @click="reject" class="bg-red-500 py-2 px-4 font-semibold rounded text-white">
          Rad etish
        </button>
      </div>
    </div>

    <div v-if="item.type == 1 || item.type == 2">
      <div class="flex justify-end mt-4">
        <button @click="affirm(item)" class="bg-blue-500 py-2 px-4 mx-2 rounded font-semibold text-white">
          {{ $t("list.return") }}
        </button>
        <button class="bg-blue-500 py-2 px-4 font-semibold rounded text-white">
          Tanishdm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "notificationModal",
  props: ["item"],
  data: () => ({
    showModal: false,
    timeOut: null,
  }),

  mounted() {
    console.log(this.item);
    this.timeOut = () =>
      setTimeout(() => {
        this.showModal = true;
      }, 2000);

    this.timeOut();
  },

  methods: {
    closeModal() {
      this.showModal = false;
    },

    affirm(item) {
      this.closeModal();
      clearTimeout(this.timeOut);
      this.$router.push(this.localePath({
        name: "debt-refund",
        query: {
          item,
        },
      }));
    },
    reject() {
      this.$emit("reject", this.item._id);
      this.closeModal();
      clearTimeout(this.timeOut);
    },
  },
};
</script>

<style scoped>
.notification {
  position: absolute;
  border-radius: 10px;
  padding: 1rem 2rem;
  z-index: 500;
  max-width: 500px;
  width: 100%;

  top: 7rem;
  right: 2rem;
}
</style>
```

```vue
// components/ActModal.vue
<template>
  <div class="act_bg" v-if="isModalShow" @click="$store.commit('HIDE_ACT_MODAL')">
    <debt-waiver v-if="actType === 'debt-waiver'" :contract="contract" />
    <debt-refund v-if="actType === 'debt-refund'" :contract="contract" />
    <debt-refund-partial v-if="actType === 'debt-refund-partial'" :contract="contract" />
    <debt-extend v-if="actType === 'debt-extend'" :time="end_date" :contract="contract" />

    <debt-demand v-if="actType === 'debt-demand'" :contract="contract" />
    <contract_uz v-if="actType === 'contact'" :contract="contract"/>
  </div>
</template>

<script>
import debtWaiver from "../components/actModals/debt-waiver.vue";
import debtExtend from "../components/actModals/debt-extend.vue";
import debtRefund from "../components/actModals/debt-refund.vue";
import debtDemand from "../components/actModals/debt-demand.vue";
import DebtRefundPartial from "./actModals/debt-refund-partial.vue";
import contract_uz from "./actModals/contract_uz.vue";

export default {
  props: ["amount"],
  components: {
    debtWaiver,
    debtExtend,
    debtRefund,
    debtDemand,
    DebtRefundPartial,
    contract_uz
  },

  computed: {
    isModalShow() {
      return this.$store.state.isActModalOpen;
    },
    contract() {
      return this.$store.state.contractData;
    },
    end_date() {
      return this.$store.state.end_date;
    },
    actType() {
      return this.$store.state.actType;
    },
  },
};
</script>

<style lang="scss" scoped>
.act_bg {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.856);
  z-index: 6000000000000000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
>
```

```vue
// components/Notification.vue
<template>
  <div class="notification py-4 px-2 lg:px-4 w-full">
    <div class="">
      <div v-if="item.type == 0 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <contract-create :item="item" :getNotifications="getNotifications" :getSockNot="getSockNot" />
      </div>

      <div v-if="item.type === 1 || (item.type === 2 && $auth.user.id === item.reciver)
        " class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-refund :item="item" :getNotifications="getNotifications" />
      </div>
      <div v-if="item.type == 3 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-extend :item="item" :getNotifications="getNotifications" />
      </div>
      <div v-if="item.type == 4 || (item.type === 5 && $auth.user.id === item.reciver)
        " class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-waiver-result :getNotifications="getNotifications" :item="item" />
      </div>

      <div v-if="item.type == 8 || (item.type === 7 && $auth.user.id === item.reciver)
        " class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <contract-create-result :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type === 18 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <contract-create-result :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 9 || (item.type == 10 && $auth.user.id === item.reciver)
        " class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-full-refund-result :getNotifications="getNotifications" :item="item" />
      </div>

      <div v-if="item.type == 11 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-partial-refund-result :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 15 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-partial-refund-reject :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 12 ||
        (item.type === 13 && $auth.user.id === item.reciver)
        " class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-extend-result :getNotifications="getNotifications" :item="item" />
      </div>

      <div v-if="item.type == 17 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-demand :getNotifications="getNotifications" :item="item" />
      </div>

      <div v-if="item.type == 19 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <requestUserVue :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 20" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <requestUserVue :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 21" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <contractVremyaVue :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 22" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <deleteActVue :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 23" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <transfer-money-vue-1 :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 24" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <transfer-money-vue-2 :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 25" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <infocom :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 26" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <infocom2 :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 27" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <exTime :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 31" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <savol :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 30" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <savol2 :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 32" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <notification5dayVue :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 35" class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <passport :getNotifications="getNotifications" :item="item" />
      </div>
      <div v-if="item.type == 16 && $auth.user.id === item.reciver"
        class="py-4 px-4 bg-white shadow-lg rounded-lg w-full notification-card">
        <debt-extend-result :getNotifications="getNotifications" @affirm="affirm" @reject="reject" :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
import notiDebtExtend from "./notification_types/debt-extend/debt-extend.vue";
import infocom2 from "./notification_types/infocom2.vue";
import DebtRefund from "./notification_types/debt-refund/debt-refund.vue";
import DebtExtendResult from "./notification_types/debt-extend/debt-extend-result.vue";
import DebtExtend from "./notification_types/debt-extend/debt-extend.vue";
import ContractCreate from "./notification_types/contract-create/contract-create.vue";
import DebtDemand from "./notification_types/debt-demand.vue";
import ContractCreateResult from "./notification_types/contract-create/contract-create-result.vue";
import DebtWaiverResult from "./notification_types/debt-waiver/debt-waiver-result.vue";
import DebtFullRefundResult from "./notification_types/debt-refund/debt-fullRefund-result/debt-fullRefund-result.vue";
import DebtPartialRefundReject from "./notification_types/debt-refund/debt-partialRefund/debt-partialRefund-reject.vue";
import DebtPartialRefundResult from "./notification_types/debt-refund/debt-partialRefund/debt-partialRefund-result.vue";
import contractVremyaVue from "./notification_types/contract-create/contract-vremya.vue";
import requestUserVue from "./notification_types/request-user.vue";
import deleteActVue from "./notification_types/contract-create/delete-act.vue";
import transferMoneyVue1 from "./notification_types/transfer-money1.vue";
import transferMoneyVue2 from "./notification_types/transfer-money2.vue";
import infocom from "./notification_types/infocom.vue";
import infocom2Vue from './notification_types/infocom2.vue';
import exTime from "./notification_types/ex-time.vue";
import savol from "./notification_types/savol.vue";
import savol2 from "./notification_types/savol2.vue";
import conVremya2 from "./notification_types/contract-create/con-vremya2.vue";
import notification5dayVue from './notification_types/notification_5day.vue';
import passport from "./notification_types/passport.vue";
export default {
  components: {
    DebtExtend,
    exTime,
    savol,
    savol2,
    infocom,
    infocom2,
    notiDebtExtend,
    transferMoneyVue1,
    transferMoneyVue2,
    DebtRefund,
    DebtExtendResult,
    ContractCreate,
    DebtDemand,
    ContractCreateResult,
    DebtWaiverResult,
    DebtFullRefundResult,
    DebtPartialRefundReject,
    DebtPartialRefundResult,
    requestUserVue,
    contractVremyaVue,
    deleteActVue,
    notification5dayVue,
    conVremya2,
    passport
  },
  name: "notification",
  props: ["item", "getNotifications", "getSockNot"],

  mounted() { },
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },

    ok(id) {
      ` `;
      this.$emit("ok", id);
    },

    async qismanQaytarish(id, status) {
      const data = {
        debitor: this.item.act.debitor,
        creditor: this.item.act.creditor,
        contract: this.item.act.contract,
        act: this.item.act._id,
        stype: status,
        reciver:
          this.item.act.reciver == this.item.act.debitor
            ? this.item.act.debitor
            : this.item.act.creditor,
      };

      try {
        const response = await this.$axios.post(
          `/notification/qisman-qaytarish/${id}`,
          data
        );
        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) {
       return this.$toast.error($nuxt.$t('a1.a42'));
       }
      console.log("ok", id);
    },

    async muddatUzaytirishQabul(id, status) {
      const data = {
        debitor: this.item.act.debitor,
        creditor: this.item.act.creditor,
        contract: this.item._id,
        stype: status,
        reciver:
          this.item.act.reciver == this.item.act.debitor
            ? this.item.act.debitor
            : this.item.act.creditor,
      };
      try {
        const response = await this.$axios.post(
          `/notification/time/${id}`,
          data
        );

        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) {
        return this.$toast.error($nuxt.$t('a1.a42'));
      }
    },

    async oneContract(id, status) {
      const data = {
        debitor: this.item.debitor._id,
        creditor: this.item.creditor._id,
        act: this.item._id,
        contract: this.item.contract._id,
        stype: status,
        reciver: this.item.debitor._id,
      };

      try {
        const response = await this.$axios.put(
          `/notification/success/${id}`,
          data
        );
        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) { return this.$toast.error($nuxt.$t('a1.a42')); }
    },

    async oneContract2(id, status) {
      const data = {
        debitor: this.item.debitor._id,
        creditor: this.item.creditor._id,
        act: this.item._id,
        contract: this.item.contract._id,
        stype: status,
        reciver: this.item.creditor._id,
      };

      try {
        const response = await this.$axios.put(
          `/notification/success/${id}`,
          data
        );
        console.log(response);
        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) { return this.$toast.error($nuxt.$t('a1.a42')); }
    },

    affirm(event, id, status, users) {
      this.$emit(event, { id, notiId: this.item._id, users }, status);
    },
    reject(event, id, status, users) {
      this.$emit(event, { id, notiId: this.item._id, users }, status);
    },
  },
};
</script>

<style scoped></style>
```

## 11. Recommendations
### 🔴 Critical
1. **Restore router middleware** – Merge router configs to retain `middleware: ['language', 'auth']`. Without it, protected routes remain public. _Suggested fix_: move scroll behavior into the existing router block. _Priority_: immediate.【F:nuxt.config.js†L72-L154】
2. **Sanitize HTML content** – Sanitize or escape API-provided HTML before binding via `v-html` to block stored XSS. _Suggested fix_: wrap responses with `DOMPurify.sanitize`. _Priority_: immediate.【F:pages/news/_id.vue†L1-L52】
3. **Remove client-side secrets** – Relocate E-IMZO API keys/host list to secure configuration (server proxy or env vars) to prevent misuse. _Priority_: immediate.【F:services/eimzo/index.js†L5-L15】
4. **Enforce secure sockets** – Set `secure: true`, validate TLS certificates, and reject non-TLS connections before sending tokens. _Priority_: immediate.【F:plugins/socket.client.js†L13-L28】

### 🟡 High
1. **Fix Vuex socket mutation** – Assign the provided `socketInstance` parameter to state to avoid null references. _Priority_: high.【F:store/index.js†L25-L27】
2. **Refactor socket lifecycle** – Centralize connection logic, capture unsubscribe functions from `store.watch`, and tear them down on logout to prevent duplicate listeners. _Priority_: high.【F:plugins/socket.client.js†L74-L95】【F:pages/notification/index.vue†L1-L205】
3. **Audit dependencies** – Repair the Yarn workspace entry, run `yarn install`, and resume `yarn audit` to surface known CVEs; replace deprecated `node-sass`. _Priority_: high.【488703†L1-L10】【F:package.json†L59-L63】
4. **Harden auth middleware** – Replace debug logs with telemetry, use context-aware redirects (`redirect(app.localePath(...))`), and re-enable proper logout endpoint. _Priority_: high.【F:middleware/auth.js†L1-L8】【F:nuxt.config.js†L193-L197】

### 🟢 Medium
1. **Introduce linting/formatting** – Add ESLint + Prettier to catch unused imports (`infocom2Vue`, `conVremya2`) and enforce style. _Priority_: medium.【F:components/Notification.vue†L118-L155】
2. **Reduce plugin footprint** – Lazy load heavy plugins (Quill, ApexCharts) only on routes that require them. _Priority_: medium.【F:nuxt.config.js†L47-L70】
3. **Normalize notification rendering** – Replace the long `v-if` chain with data-driven mapping (type → component) for maintainability. _Priority_: medium.【F:components/Notification.vue†L4-L99】
4. **Validate socket payloads** – Guard against missing payload properties before filtering notifications. _Priority_: medium.【F:store/notification.js†L20-L26】

### 🔵 Low
1. **Clean debugging logs** – Remove or gate `console.log` usage; adopt structured logging. _Priority_: low.【78b5b8†L1-L76】
2. **Tidy stylistic issues** – Remove stray characters and replace magic numbers (e.g., modal z-index) with named tokens. _Priority_: low.【F:components/ActModal.vue†L49-L64】
3. **Document or remove empty files** – Implement `middleware/socket.js` or delete it to avoid confusion. _Priority_: low.【F:middleware/socket.js†L1-L1】

## 12. Professional Improvements
- **Logging**: Integrate centralized client logging (e.g., Sentry) and wire Axios/socket interceptors to emit structured errors.【F:plugins/axios.js†L1-L12】【F:plugins/socket.client.js†L54-L85】
- **Testing**: Add Jest + Vue Test Utils for Vuex modules/components and Cypress for end-to-end auth, notification, and signing journeys.
- **CI/CD**: Configure pipeline to run lint, unit tests, `yarn audit`, and `nuxt build` on pull requests.
- **Documentation**: Provide architecture overview, socket event contract, and environment setup instructions to onboard developers faster.
- **Type Safety**: Plan incremental TypeScript adoption (or JSDoc typing) for stores/services to prevent shape mismatches like the socket mutation bug.
- **Monitoring**: Track client performance and socket health (Sentry, LogRocket) and consider alerting on disconnect storms or auth failures.