/**
 * ZeroX - Tailwind CSS Configuration
 * Design System asoslari
 */

module.exports = {
  // Tailwind 2.x purge konfiguratsiyasi - optimallashtirilgan
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
      // Aniq safelist - faqat kerakli classlar
      safelist: [
        // Nuxt active classlar
        'nuxt-link-active',
        'nuxt-link-exact-active',
        // Dynamic color classlar (faqat ishlatilganlar)
        'text-red-500',
        'text-green-500',
        'text-orange-500',
        'text-blue-500',
        'text-gray-500',
        'bg-red-500',
        'bg-green-500',
        'bg-orange-500',
        'bg-blue-500',
        'bg-gray-100',
        'bg-blue-50',
        'bg-green-50',
        'border-red-400',
        'border-green-400',
        // Hover states (faqat kerakli)
        'hover:bg-blue-50',
        'hover:bg-green-50',
        'hover:bg-gray-100',
        // Loading animation
        'animate-pulse',
        'animate-spin',
      ],
    },
  },

  darkMode: false, // Kelajakda: 'class'

  theme: {
    extend: {
      // ============================================
      // Color Palette - Design System
      // ============================================
      colors: {
        // Primary colors
        primary: {
          50: '#EBF4FF',
          100: '#C3DAFE',
          200: '#A3BFFA',
          300: '#7F9CF5',
          400: '#667EEA',
          500: '#3182CE', // Asosiy rang
          600: '#2B6CB0',
          700: '#2C5282',
          800: '#2A4365',
          900: '#1A365D',
          DEFAULT: '#3182CE',
        },

        // Secondary / Neutral
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

        // Success
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

        // Error / Danger
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

        // Warning
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

        // Info
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

        // Legacy colors (backward compatibility)
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

        // Background
        background: '#F7FAFC',
        surface: '#FFFFFF',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },

      // ============================================
      // Typography
      // ============================================
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],  // 10px
        'xs': ['0.75rem', { lineHeight: '1rem' }],        // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px
      },

      // ============================================
      // Spacing
      // ============================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ============================================
      // Width / Height
      // ============================================
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

      // ============================================
      // Border Radius
      // ============================================
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'card': '12px',
        'button': '8px',
        'input': '6px',
      },

      // ============================================
      // Box Shadow
      // ============================================
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'button': '0 2px 4px rgba(49, 130, 206, 0.2)',
        'input-focus': '0 0 0 3px rgba(49, 130, 206, 0.3)',
      },

      // ============================================
      // Animation
      // ============================================
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // ============================================
      // Transition
      // ============================================
      transitionDuration: {
        '0': '0ms',
        '250': '250ms',
        '350': '350ms',
      },

      // ============================================
      // Z-Index
      // ============================================
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

  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      borderColor: ['focus', 'active'],
      textColor: ['active', 'disabled'],
      ringColor: ['focus'],
      ringWidth: ['focus'],
    },
  },

  plugins: [],
};
