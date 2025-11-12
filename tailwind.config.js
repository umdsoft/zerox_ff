module.exports = {
  // Tailwind 2.x purge konfiguratsiyasi - foydalanilmagan CSS'larni olib tashlash
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
    ],
    options: {
      safelist: [
        // Dynamic class'lar uchun safelist
        /^text-/,
        /^bg-/,
        /^hover:/,
        /^focus:/,
        'nuxt-link-active',
        'nuxt-link-exact-active',
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        t_primary: "#3182CE",
        t_secondary: "#8692A6",
        t_gray: "#2979d41a",
        t_error: "#8692A6",
        t_black: "#37363C",
        t_blue: "#2D62B6",
        t_bl: "#2D3748",
        t_gr: "#48BB78",
        t_grayy: " #F7FAFC",
        t_lime: "#60C48A",
        t_white: "#FFF",
        customBlue: "#4E91D3",
      },
      width: {
        m_width: "465px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
