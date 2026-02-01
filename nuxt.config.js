// ============================================
// ZeroX Nuxt Configuration
// ============================================

// Environment Variables - markazlashtirilgan
// MUHIM: Production'da .env faylidan foydalaning!
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ============================================
// BACKEND URL - FAQAT SHU JOYNI O'ZGARTIRING!
// ============================================
// Cloudflare tunnel URL'ni shu yerga yozing:
const BACKEND_URL = process.env.BACKEND_URL || (IS_PRODUCTION
  ? "https://app.zerox.uz"
  : "https://installation-patch-highest-strand.trycloudflare.com"
);

const ENV = {
  // Backend URL (yuqoridan olinadi)
  BACKEND_URL,
  // API URL = Backend URL + /api/v1
  API_BASE_URL: `${BACKEND_URL}/api/v1`,
  // Socket URL = Backend URL
  SOCKET_IO_URL: BACKEND_URL,
  // Boshqa sozlamalar
  GTM_ID: process.env.GOOGLE_TAG_MANAGER_ID || "G-J26T5ZP6TZ",
  YANDEX_ID: process.env.YANDEX_METRIKA_ID || "90314930",
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 30000,
  IS_PRODUCTION,
  ENABLE_WEBVISOR: process.env.ENABLE_WEBVISOR !== "false",
};

export default {
  // ============================================
  // Global page headers
  // ============================================
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
        content: "ZeroX - ishonch kafolati. Jismoniy va yuridik shaxslarning o'zaro qarz munosabatlarini elektron tarzda ro'yxatga olish va nazorat qilish tizimi.",
      },
      { name: "format-detection", content: "telephone=no" },
      { name: "theme-color", content: "#3182CE" },
      // SEO meta tags
      { name: "author", content: "ZeroX" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "ZeroX - ishonch kafolati" },
      { property: "og:description", content: "Qarz munosabatlarini elektron tarzda boshqarish tizimi" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.png" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/logo.ico" },
      { rel: "apple-touch-icon", href: "/logo.ico" },
      // Font preconnect - tezroq yuklash
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true },
      // DNS prefetch - API va socket uchun
      { rel: "dns-prefetch", href: "https://app.zerox.uz" },
    ],
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${ENV.GTM_ID}`,
        async: true,
      },
      // Telegram WebApp SDK
      {
        src: 'https://telegram.org/js/telegram-web-app.js',
      },
    ],
  },

  // ============================================
  // Vue Configuration
  // ============================================
  vue: {
    config: {
      productionTip: false,
      devtools: !ENV.IS_PRODUCTION,
      silent: ENV.IS_PRODUCTION, // Production'da Vue warning'larni yashirish
    },
  },

  // ============================================
  // Rendering mode
  // ============================================
  ssr: false,
  target: "static",

  // ============================================
  // Global CSS
  // ============================================
  css: [
    "@/assets/style/style.css",
    "@/assets/styles.scss",
  ],

  // ============================================
  // Plugins
  // ============================================
  plugins: [
    // UI Components
    { src: "@/plugins/pagination.js", ssr: false },
    { src: "@/plugins/datepicker.js", ssr: false },
    { src: "@/plugins/vue-apexchart.js", ssr: false },
    { src: "~/plugins/vue-quill-editor.js", mode: "client" },

    // Form & Validation
    { src: "./plugins/v-mask.js" },
    { src: "./plugins/v-format.js" },
    { src: "./plugins/vuelidate.js", ssr: false },
    { src: "./plugins/vue-tel-input.js", ssr: false },

    // Core functionality
    { src: "@/plugins/main.js", ssr: false },
    { src: "@/plugins/v-icon.js", ssr: false },
    { src: "./plugins/swiper.js" },
    { src: "./plugins/axios.js" },

    // Services
    { src: "@/services/api.js", ssr: false },
    { src: "@/plugins/html2Pdf.js", ssr: false },

    // Utilities
    { src: "~/plugins/globalFunctions.js", ssr: false },
    { src: "~/plugins/router-client.js", ssr: false },
    { src: "~/plugins/clock.js", ssr: false },

    // Real-time & i18n
    { src: "~/plugins/socket.client.js", ssr: false },
    { src: "~/plugins/i18n-unified.client.js", mode: "client" },

    // Telegram WebApp
    { src: "~/plugins/telegram.client.js", mode: "client" },

    // Error Handler - Global xatolarni ushlash
    { src: "~/plugins/error-handler.client.js", mode: "client" },
  ],

  // ============================================
  // Auto import components
  // ============================================
  components: true,

  // ============================================
  // Build Modules
  // ============================================
  buildModules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/fontawesome",
  ],

  // ============================================
  // Tailwind CSS Configuration
  // ============================================
  tailwindcss: {
    cssPath: '~/styles/global.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: false,
  },

  // ============================================
  // Image Optimization (@nuxt/image)
  // ============================================
  image: {
    // Rasm sifati (0-100)
    quality: 80,

    // Lazy loading - browser native
    loading: 'lazy',

    // Responsive rasmlar uchun breakpoints
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },

    // Static provider (generate uchun)
    provider: 'static',
  },

  // ============================================
  // Modules
  // ============================================
  modules: [
    "@nuxtjs/axios",
    "nuxt-socket-io",
    "@nuxtjs/i18n",
    "@nuxtjs/auth-next",
    "@nuxtjs/toast",
    [
      "@nuxtjs/yandex-metrika",
      {
        id: ENV.YANDEX_ID,
        webvisor: ENV.ENABLE_WEBVISOR,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      },
    ],
  ],

  // ============================================
  // Socket.IO Configuration
  // Development'da URL bo'sh - socketManager dinamik aniqlaydi
  // ============================================
  io: {
    sockets: [
      {
        name: "home",
        default: true,
        // URL bo'sh bo'lsa, socket.client.js va socketManager dinamik aniqlaydi
        url: ENV.SOCKET_IO_URL,
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
        // Cloudflare tunnel uchun polling birinchi bo'lishi kerak
        transports: ['polling', 'websocket'],
        autoConnect: false, // Biz o'zimiz ulaymiz - dinamik URL bilan
        forceNew: false,
        // CORS: withCredentials faqat production'da kerak
        // Development'da CORS wildcard (*) bilan conflict qiladi
        withCredentials: false,
        path: '/socket.io/',
      },
    ],
  },

  // ============================================
  // Router Configuration
  // ============================================
  router: {
    middleware: ["language", "auth"],
    scrollBehavior: async (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }

      const findEl = async (hash, x = 0) => {
        return (
          document.querySelector(hash) ||
          new Promise((resolve) => {
            if (x > 50) {
              return resolve(null);
            }
            setTimeout(() => {
              resolve(findEl(hash, x + 1));
            }, 100);
          })
        );
      };

      if (to.hash) {
        const el = await findEl(to.hash);
        if (el) {
          return window.scrollTo({
            top: el.offsetTop,
            behavior: "smooth"
          });
        }
      }

      return { x: 0, y: 0 };
    },
    linkActiveClass: "nuxt-link-active",
  },

  // ============================================
  // i18n Configuration
  // ============================================
  i18n: {
    locales: [
      { code: "uz", file: "uz.js", name: "O'zbek" },
      { code: "ru", file: "ru.js", name: "Русский" },
      { code: "kr", file: "kr.js", name: "Ўзбек" },
    ],
    lazy: true,
    defaultLocale: "uz",
    langDir: "lang/",
    detectBrowserLanguage: false,
    strategy: "prefix_except_default",
    vueI18n: {
      fallbackLocale: "uz",
    },
  },

  // ============================================
  // Toast Configuration
  // ============================================
  toast: {
    duration: 3000,
    pauseOnHover: true,
    position: "top-right",
    className: "zerox-toast",
  },

  // ============================================
  // FontAwesome Configuration (Local - CDN o'rniga)
  // ============================================
  fontawesome: {
    component: "fa",
    icons: {
      solid: true,
      brands: true,
      regular: true,
    },
    // CSS'ni local yuklash - CDN xavfsizlik muammosini hal qiladi
    useLayers: false,
    useLayersText: false,
  },

  // ============================================
  // Runtime Configuration (client-side accessible)
  // ============================================
  publicRuntimeConfig: {
    backendURL: ENV.BACKEND_URL,
    apiURL: ENV.API_BASE_URL,
    socketURL: ENV.SOCKET_IO_URL,
    apiTimeout: ENV.API_TIMEOUT,
    isProduction: ENV.IS_PRODUCTION,
  },

  // ============================================
  // Auth Configuration
  // ============================================
  auth: {
    redirect: {
      login: "/auth/login",
      logout: "/",
      callback: "/",
      home: "/",
    },
    strategies: {
      local: {
        token: {
          property: "token",
          global: true,
          type: "Bearer",
          maxAge: 60 * 60 * 24 * 7, // 7 kun
        },
        user: {
          property: "data",
          autoFetch: true,
        },
        endpoints: {
          login: { url: "user/login", method: "post" },
          user: { url: "user/me", method: "get" },
          logout: false,
        },
      },
    },
  },

  // ============================================
  // Axios Configuration
  // ============================================
  axios: {
    // MUHIM: HAR DOIM to'liq backend URL ishlatiladi
    // Chunki frontend va backend ALOHIDA Cloudflare tunnel'larda
    baseURL: ENV.API_BASE_URL,
    timeout: ENV.API_TIMEOUT,
    // CORS headers server tomonida bo'lishi kerak, client-da emas
  },

  // ============================================
  // Build Configuration - Performance Optimized
  // ============================================
  build: {
    // Production optimizatsiya
    extractCSS: ENV.IS_PRODUCTION,

    // Parallel build (tezroq build)
    parallel: true,
    cache: true,
    hardSource: false, // O'chirildi - cache xatoliklarini oldini olish uchun

    // Chunk splitting - yaxshilangan
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        maxSize: 200000, // 200KB - kichikroq chunk'lar
        minSize: 20000,  // 20KB minimum
        cacheGroups: {
          // Vue va Nuxt core
          vue: {
            test: /[\\/]node_modules[\\/](vue|vuex|vue-router|nuxt)[\\/]/,
            name: 'vue',
            chunks: 'all',
            priority: 20,
          },
          // Og'ir kutubxonalar - alohida chunk
          charts: {
            test: /[\\/]node_modules[\\/](apexcharts|vue-apexcharts)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15,
          },
          quill: {
            test: /[\\/]node_modules[\\/](quill|vue-quill-editor)[\\/]/,
            name: 'quill',
            chunks: 'all',
            priority: 15,
          },
          pdf: {
            test: /[\\/]node_modules[\\/](html2pdf|pdfjs-dist|vue-html2pdf|vue-pdf)[\\/]/,
            name: 'pdf',
            chunks: 'all',
            priority: 15,
          },
          // Boshqa vendor'lar
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Umumiy kod
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    },

    // Transpile - kerakli paketlar
    transpile: [
      'vue-apexcharts',
      'apexcharts',
      'vue-tel-input',
    ],

    // Terser - production minification
    terser: {
      terserOptions: {
        compress: {
          drop_console: ENV.IS_PRODUCTION,
          drop_debugger: ENV.IS_PRODUCTION,
          pure_funcs: ENV.IS_PRODUCTION ? ['console.log', 'console.debug'] : [],
        },
        output: {
          comments: false,
        },
        mangle: {
          safari10: true,
        },
      },
    },

    // Babel optimization
    babel: {
      compact: true,
      presets({ isServer }, [preset, options]) {
        options.corejs = { version: 3 }
      },
    },

    // HTML minification
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      },
    },

    // PostCSS
    // MUHIM: tailwindcss va autoprefixer @nuxtjs/tailwindcss tomonidan qo'shiladi
    // Bu yerda faqat qo'shimcha pluginlar
    postcss: {
      postcssOptions: {
        plugins: {
          'cssnano': ENV.IS_PRODUCTION ? {
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifySelectors: true,
            }],
          } : false,
        },
      },
    },

    // Filenames for cache busting
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : '[name].[contenthash:8].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : '[name].[contenthash:8].js',
      css: ({ isDev }) => isDev ? '[name].css' : '[name].[contenthash:8].css',
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[name].[contenthash:8].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[name].[contenthash:8].[ext]',
    },

    // Webpack extend
    extend(config, { isDev, isClient }) {
      if (isClient) {
        // Performance hints
        config.performance = config.performance || {};
        config.performance.hints = false;
        config.performance.maxAssetSize = 300000;
        config.performance.maxEntrypointSize = 500000;
      }

      // Development source maps
      if (isDev) {
        config.devtool = 'eval-cheap-module-source-map';
      }
    },
  },

  // ============================================
  // Render Configuration - preload warning'larni oldini olish
  // ============================================
  render: {
    resourceHints: false, // Prefetch/preload hints'ni o'chirish
    http2: {
      push: false,
    },
  },

  // ============================================
  // Loading Configuration
  // ============================================
  loading: {
    color: "#3182CE",
    height: "3px",
    throttle: 200,
  },
};
