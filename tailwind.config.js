/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        coursiv: {
          blue: '#5653FE',
          dark: '#24234C',
        },
        // Quiz colors
        'main': '#24234C',
        'secondary': '#6B7280',
        'accent': '#5653FE',
        'accent-main': '#5653FE',
        'navigation': '#F5F5F5',
        'question-fill-unselected': '#F5F5F5',
        'question-fill-selected': '#EEEEFF',
        'magic-page': '#FFFFFF',
      },
      screens: {
        tablet: '768px',
        laptop: '1024px',
      },
    },
  },
  plugins: [],
}

