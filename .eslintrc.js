module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  plugins: [],
  // Custom rules
  rules: {
    // Console statements faqat warning
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // Vue specifics
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn', // XSS xavfini eslat
    // Boshqalar
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
