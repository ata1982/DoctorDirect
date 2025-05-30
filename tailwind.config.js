/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8ff',
          100: '#e6f3ff',
          500: '#007AFF',
          600: '#0056CC',
          700: '#003d99',
        },
        accent: '#30D158',
        'accent-orange': '#FF9500',
        blue: {
          50: '#f0f8ff',
          100: '#e6f3ff',
          500: '#007AFF',
          600: '#0056CC',
          700: '#003d99',
        },
        green: {
          50: '#f0fff4',
          500: '#30D158',
        },
        orange: {
          50: '#fff7ed',
          500: '#FF9500',
        },
        purple: {
          50: '#faf5ff',
          500: '#a855f7',
        },
        red: {
          50: '#fef2f2',
          500: '#ef4444',
        },
        indigo: {
          50: '#eef2ff',
          500: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}