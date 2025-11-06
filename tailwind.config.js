/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#facc15',
          foreground: '#1f2937',
        },
      },
    },
  },
  plugins: [],
};
