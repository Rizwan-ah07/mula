import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Teal — primary brand (#006070)
        brand: {
          50:  '#f0fafb',
          100: '#d9f0f3',
          200: '#b3e2e7',
          300: '#7fced5',
          400: '#40b4be',
          500: '#0d94a0',
          600: '#006070',   // ← main brand teal
          700: '#005060',
          800: '#003d4a',
          900: '#002a34',
        },
        // Coral (#F27A54)
        coral: {
          400: '#f59474',
          500: '#F27A54',   // ← main coral
          600: '#e85f34',
          700: '#cc4a20',
        },
        // Gold (#FFB81C)
        gold: {
          400: '#ffd050',
          500: '#FFB81C',   // ← main gold
          600: '#e09a00',
          700: '#b87a00',
        },
        // Ocean / cyan for kitchen KDS
        ocean: {
          300: '#a5f3fc',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
