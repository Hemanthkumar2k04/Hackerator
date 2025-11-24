/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: 'hsl(220, 15%, 8%)',
        surface: 'hsl(220, 12%, 14%)',
        panel: 'hsl(220, 12%, 10%)',
        accent: {
          primary: 'hsl(150, 60%, 45%)',
          secondary: 'hsl(150, 55%, 35%)',
          error: 'hsl(0, 65%, 55%)'
        },
        border: {
          muted: 'hsl(220, 10%, 25%)'
        },
        text: {
          primary: 'hsl(0, 0%, 90%)',
          muted: 'hsl(0, 0%, 65%)'
        },
        grid: {
          line: 'hsl(220, 8%, 18%)'
        }
      },
      animation: {
        'grid-fade': 'grid-fade 20s infinite',
      },
      keyframes: {
        'grid-fade': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' },
        },
      },
      height: {
        'screen-navbar': 'calc(100vh - 80px)',
      },
    },
  },
  plugins: [],
}
