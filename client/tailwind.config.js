/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B1A1A',
        'primary-dark': '#6B1414',
        'primary-light': '#A52020',
        secondary: '#D4A017',
        'secondary-dark': '#B8880F',
        accent: '#F5F0E8',
        dark: '#1A1A1A',
        'text-main': '#2D2D2D',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        accent: ['"Yatra One"', 'cursive'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(139, 26, 26, 0.12)',
        'card-hover': '0 8px 30px rgba(139, 26, 26, 0.22)',
        golden: '0 4px 20px rgba(212, 160, 23, 0.25)',
      },
      backgroundImage: {
        'texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
