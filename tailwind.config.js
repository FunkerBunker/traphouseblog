// tailwind.config.js
module.exports = {
  darkMode: 'class', // WICHTIG: Verwende "class" für .dark-Klasse (nicht "media")
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.ts', // für lib/posts.ts
    './content/**/*',
  ],
  plugins: [require('@tailwindcss/typography')],
}