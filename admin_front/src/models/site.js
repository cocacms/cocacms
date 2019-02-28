import modelExtend from "dva-model-extend";
import { baseModel } from "./base";

export default modelExtend(baseModel("site", false), {
  namespace: "site",
  state: {},
  subscriptions: {},
  effects: {}
});
