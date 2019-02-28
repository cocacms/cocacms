import modelExtend from "dva-model-extend";
import baseService from "../services/base";
import { baseModel } from "./base";
import { rules, index } from "../services/general";
import { indexs } from "../services/modelAttr";
const modelService = baseService("model");
const modelAttrService = baseService("modelAttr");
const formService = baseService("form");

export default modelExtend(baseModel("form", false), {
  namespace: "form",
  state: {
    category: [],
    models: [],
    attrs: [],
    rules: {},
    indexs: [],
    current: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {
    *fetchProps({ payload }, { call, put }) {
      const { data: models } = yield call(modelService.index);

      yield put({
        type: "save",
        payload: {
          models
        }
      });
    },

    *fetchForm({ payload }, { call, put }) {
      const { data } = yield call(formService.index, {
        where: [{ key: "key", value: payload }]
      });

      if (data.length === 0) {
        throw new Error("不存在此项目的数据汇总， 请刷新页面！");
      }

      const { data: category } = yield call(
        index,
        { pageSize: 99999 },
        data[0].model.key,
        "g"
      );

      yield put({
        type: "save",
        payload: {
          current: data[0],
          category: category.data
        }
      });

      return data[0];
    },

    *fetchFormDataProps({ payload }, { call, put }) {
      const { data: attrs } = yield call(
        modelAttrService.index,
        {},
        `/${payload.form_id}`
      );

      const { data: ruleData } = yield call(rules, payload.key, "f");
      const { data: indexsData } = yield call(indexs, payload.form_id);

      yield put({
        type: "save",
        payload: {
          attrs,
          rules: ruleData,
          indexs: [
            ...indexsData.keys.map(i => ({ type: "key", key: i })),
            ...indexsData.fulltexts.map(i => ({ type: "fulltext", key: i }))
          ]
        }
      });
    }
  }
});
