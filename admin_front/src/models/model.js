import modelExtend from "dva-model-extend";
import { baseModel } from "./base";

export default modelExtend(baseModel("model", false), {
  namespace: "model",
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {}
});
