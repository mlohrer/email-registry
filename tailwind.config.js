module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.js',
  ],
  // mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "kortical": "#38D1FF",
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
