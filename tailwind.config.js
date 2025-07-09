/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'huly-bg': '#090A0C',
        'huly-blue': '#478BEB',
        'huly-orange': '#FF5F0B',
        'huly-text-light': '#C9CBCF',
        'huly-border': 'rgba(201, 203, 207, 0.2)',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'title': ['font-title', 'Inter', 'sans-serif'],
      },
      fontSize: {
        '80': '80px',
        '60': '60px',
        '36': '36px',
      },
      spacing: {
        '131': '131px',
        '247': '247px',
      },
      borderRadius: {
        '20': '20px',
        '30': '30px',
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(71, 139, 235, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(71, 139, 235, 0.8), 0 0 40px rgba(71, 139, 235, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}