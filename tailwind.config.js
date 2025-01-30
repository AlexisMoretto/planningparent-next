/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Dossier `app` de Next.js
    "./pages/**/*.{js,ts,jsx,tsx}", // Dossier `pages` de Next.js
    "./components/**/*.{js,ts,jsx,tsx}", // Dossier `components` de Next.js
  ],
  theme: {
    extend: {}, // Vous pouvez personnaliser ici vos styles
  },
  plugins: [],
};
