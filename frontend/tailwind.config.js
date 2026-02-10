
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./core/**/*.{js,ts,jsx,tsx}",
    "./assets/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '400px',
        '3xl': '1920px',
      },
      colors: {
        decensat: {
          DEFAULT: '#a3e635',
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05',
        },
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(163,230,53,0.5)',
        'glow-blue': '0 0 25px -5px rgba(59,130,246,0.5)',
        'glow-sm': '0 0 15px -5px rgba(163,230,53,0.3)',
      },
      animation: {
        'scan-line-movement': 'scan-line-logic 4s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        'scan-line-logic': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
};
