export default {
  plugins: [
    'umi-plugin-polyfill',
    'umi-plugin-dva',
    ['umi-plugin-routes', {
      exclude: [
        /components/,
      ],
    }],
  ],
  hashHistory: true
}
