/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F5EF',
          50: '#FCFBF8',
          100: '#F7F5EF',
          200: '#EFECE2',
          300: '#E3DFD2',
        },
        surface: '#FFFFFF',
        brand: {
          DEFAULT: '#0F766E',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          500: '#14B8A6',
          600: '#0F766E',
          700: '#0D625C',
          800: '#115E59',
          900: '#134E4A',
        },
        secgreen: {
          DEFAULT: '#15803D',
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#16A34A',
          700: '#15803D',
        },
        accent: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        charcoal: {
          DEFAULT: '#17201D',
          50: '#F4F6F5',
          100: '#E6EAE8',
          200: '#C8D1CE',
          600: '#4A5752',
          700: '#2D3A35',
          800: '#1F2825',
          900: '#17201D',
        },
        govmuted: '#64706B',
        govborder: '#DDE3DE',
        govsuccess: '#16803C',
        govwarning: '#B7791F',
        govdanger: '#C2413A',
        navydark: '#0F172A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'gov': '14px',
        'gov-lg': '18px',
      },
      boxShadow: {
        'gov-sm': '0 1px 2px 0 rgba(23, 32, 29, 0.04)',
        'gov': '0 2px 8px -1px rgba(23, 32, 29, 0.06), 0 1px 3px -1px rgba(23, 32, 29, 0.04)',
        'gov-hover': '0 8px 24px -4px rgba(15, 118, 110, 0.10), 0 2px 6px -2px rgba(23, 32, 29, 0.04)',
        'gov-modal': '0 20px 40px -8px rgba(23, 32, 29, 0.16), 0 8px 16px -4px rgba(23, 32, 29, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};
