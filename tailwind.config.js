/**
 * ZeroX - Tailwind CSS Configuration
 * Tailwind CSS 2.x format (@nuxtjs/tailwindcss@4.2.1 uchun)
 */

module.exports = {
  // JIT mode - tezroq va barcha klasslar ishlaydi
  mode: 'jit',

  // Purge konfiguratsiyasi
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      // Color Palette
      colors: {
        primary: {
          50: '#EBF4FF',
          100: '#C3DAFE',
          200: '#A3BFFA',
          300: '#7F9CF5',
          400: '#667EEA',
          500: '#3182CE',
          600: '#2B6CB0',
          700: '#2C5282',
          800: '#2A4365',
          900: '#1A365D',
          DEFAULT: '#3182CE',
        },
        secondary: {
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#8692A6',
          600: '#718096',
          700: '#4A5568',
          800: '#2D3748',
          900: '#1A202C',
          DEFAULT: '#8692A6',
        },
        success: {
          50: '#F0FFF4',
          100: '#C6F6D5',
          200: '#9AE6B4',
          300: '#68D391',
          400: '#48BB78',
          500: '#38A169',
          600: '#2F855A',
          700: '#276749',
          800: '#22543D',
          900: '#1C4532',
          DEFAULT: '#48BB78',
        },
        error: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#E53E3E',
          600: '#C53030',
          700: '#9B2C2C',
          800: '#822727',
          900: '#63171B',
          DEFAULT: '#F56565',
        },
        warning: {
          50: '#FFFAF0',
          100: '#FEEBC8',
          200: '#FBD38D',
          300: '#F6AD55',
          400: '#ED8936',
          500: '#DD6B20',
          600: '#C05621',
          700: '#9C4221',
          800: '#7B341E',
          900: '#652B19',
          DEFAULT: '#ED8936',
        },
        info: {
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3182CE',
          600: '#2B6CB0',
          700: '#2C5282',
          800: '#2A4365',
          900: '#1A365D',
          DEFAULT: '#4299E1',
        },
        // Legacy colors
        t_primary: '#3182CE',
        t_secondary: '#8692A6',
        t_gray: 'rgba(41, 121, 212, 0.1)',
        t_error: '#F56565',
        t_black: '#37363C',
        t_blue: '#2D62B6',
        t_bl: '#2D3748',
        t_gr: '#48BB78',
        t_grayy: '#F7FAFC',
        t_lime: '#60C48A',
        t_white: '#FFFFFF',
        customBlue: '#4E91D3',
        background: '#F7FAFC',
        surface: '#FFFFFF',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },

      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Width / Height
      width: {
        'm_width': '465px',
        'sidebar': '280px',
        'sidebar-collapsed': '80px',
      },

      maxWidth: {
        'container': '1330px',
        'form': '465px',
        'modal': '600px',
        'modal-lg': '800px',
      },

      minHeight: {
        'screen-nav': 'calc(100vh - 64px)',
      },

      // Border Radius
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '6px',
      },

      // Box Shadow
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'button': '0 2px 4px rgba(49, 130, 206, 0.2)',
        'input-focus': '0 0 0 3px rgba(49, 130, 206, 0.3)',
      },

      // Z-Index
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
        'toast': '800',
      },
    },
  },

  plugins: [],
};
