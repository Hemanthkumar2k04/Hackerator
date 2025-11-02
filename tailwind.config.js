/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme
        'surface': {
          'dark': 'hsl(220, 15%, 8%)',
          'darker': 'hsl(220, 12%, 12%)',
          'grid': 'hsl(220, 10%, 20%)',
          'navbar': 'hsl(220, 15%, 10%)',
        },
        // Primary accent (green)
        'accent': {
          'primary': 'hsl(150, 80%, 45%)',
          'primary-hover': 'hsla(150, 80%, 60%, 0.6)',
        },
        // Secondary accent (muted teal)
        'accent-secondary': 'hsl(170, 20%, 50%)',
        // Text colors
        'text': {
          'primary': 'hsl(0, 0%, 95%)',
          'secondary': 'hsl(0, 0%, 70%)',
        },
        // Border/divider
        'border-subtle': 'hsl(220, 10%, 25%)',
      },
      backgroundColor: {
        'dark': 'hsl(220, 15%, 8%)',
        'dark-panel': 'hsl(220, 12%, 12%)',
      },
      borderColor: {
        'subtle': 'hsl(220, 10%, 25%)',
      },
      textColor: {
        'primary': 'hsl(0, 0%, 95%)',
        'secondary': 'hsl(0, 0%, 70%)',
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
    },
  },
  plugins: [],
}
