import path from "path";

export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: "./components/Loading.js"
        },
        dll: {
          exclude: []
        },
        dva: true,
        immer: true,
        antd: true // antd 默认不开启，如有使用需自行配置
      }
    ]
  ],

  theme: {
    "layout-header-background": "#002140"
  },

  alias: {
    components: path.resolve(__dirname, "src/components/")
  },

  history: "hash",
  hash: true
};
