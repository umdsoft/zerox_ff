/**
 * ZeroX - ESLint Configuration
 * Vue 2 + Nuxt 2 uchun professional linting
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  plugins: ['vue'],

  // ============================================
  // Custom Rules
  // ============================================
  rules: {
    // ========== Vue Specific ==========
    'vue/multi-word-component-names': 'off', // Nuxt pages uchun
    'vue/no-v-html': 'warn', // XSS xavfi uchun ogohlantirish
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'error',
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'key',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        ['provide', 'inject'],
        'ROUTER_GUARDS',
        'layout',
        'middleware',
        'validate',
        'scrollToTop',
        'transition',
        'loading',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'emits',
        'setup',
        'asyncData',
        'data',
        'fetch',
        'head',
        'computed',
        'watch',
        'watchQuery',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError',
      ],
    }],
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: false,
    }],

    // ========== JavaScript Best Practices ==========
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'warn',
    'no-nested-ternary': 'warn',
    'no-unneeded-ternary': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'curly': ['error', 'all'],
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // ========== Async/Await ==========
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'warn',
    'require-await': 'warn',
    'no-return-await': 'error',

    // ========== Code Style ==========
    'camelcase': ['warn', { properties: 'never' }],
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    'max-depth': ['warn', 4],
    'max-params': ['warn', 5],
    'complexity': ['warn', 15],

    // ========== Import ==========
    'no-duplicate-imports': 'error',
  },

  // ============================================
  // Overrides
  // ============================================
  overrides: [
    // Test files
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
    },
    // Nuxt config files
    {
      files: ['nuxt.config.js', 'tailwind.config.js'],
      rules: {
        'max-lines': 'off',
      },
    },
  ],

  // ============================================
  // Globals
  // ============================================
  globals: {
    $nuxt: 'readonly',
  },
};
