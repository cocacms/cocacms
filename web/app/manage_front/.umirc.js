export default {
  outputPath: '../public',
  hashHistory: true,
  disableServiceWorker: true,
  disableDynamicImport: true,
  plugins: [
    'umi-plugin-polyfill',
    'umi-plugin-dva',
    [
      'umi-plugin-routes',
      {
        exclude: [/components/],
      },
    ],
  ],
  hashHistory: true,
};
