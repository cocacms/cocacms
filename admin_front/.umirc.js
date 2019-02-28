import path from "path";

export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        dynamicImport: false,
        dva: true,
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
