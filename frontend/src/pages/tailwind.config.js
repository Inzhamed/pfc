export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  // ...
  plugins: [
    require('@tailwindcss/forms'),
    // autres plugins...
  ],
}
