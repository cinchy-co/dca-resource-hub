module.exports = {
  mode: 'jit',
  theme: {
    extend: {
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      }
    }
  },
  variants: {
    lineClamp: ['responsive', 'hover']
  },
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}']
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
