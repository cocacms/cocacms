export default {
  plugins: [
    'umi-plugin-dva',
    ['umi-plugin-routes', {
      exclude: [
        /components/,
      ],
    }],
  ],
  hashHistory: true
}
