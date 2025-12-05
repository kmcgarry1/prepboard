/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sand: '#f4ecdf',
        parchment: '#f8f3e7',
        sage: '#dfe7d6',
        basil: '#8fa276',
        clay: '#d1b8a1',
        soot: '#1f262f',
        charcoal: '#2f343b',
        smoke: '#4d5561',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(15, 23, 42, 0.14)',
      },
      backgroundImage: {
        'kitchen-gradient':
          'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8), transparent 28%), radial-gradient(circle at 80% 0%, rgba(223, 231, 214, 0.6), transparent 24%), linear-gradient(140deg, #f8f3e7 0%, #e8f0e0 40%, #f2e6d8 100%)',
        'kitchen-gradient-dark':
          'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.05), transparent 30%), radial-gradient(circle at 80% 0%, rgba(100,116,139,0.2), transparent 24%), linear-gradient(160deg, #0b1423 0%, #0f172a 45%, #0b1423 100%)',
      },
    },
  },
  plugins: [],
}
