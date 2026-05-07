/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode toggling via 'dark' class on HTML element
  theme: {
    extend: {
      colors: {
        bg: {
          dark: 'var(--bg-dark)',
          card: 'var(--bg-card)',
          cardHover: 'var(--bg-card-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        accent: {
          cyan: 'var(--accent-cyan)',
          purple: 'var(--accent-purple)',
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          error: 'var(--status-error)',
        },
        border: {
          color: 'var(--border-color)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
