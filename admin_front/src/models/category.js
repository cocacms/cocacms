import modelExtend from "dva-model-extend";
import { baseModel } from "./base";
import { create, moveUp, moveDown, bind } from "../services/category";
import base from "../services/base";

const categoryService = base("category");
const modelService = base("model");

export default modelExtend(baseModel("category", false), {
  namespace: "category",
  state: {
    tree: [],
    models: [],
    treeFilterModel: []
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {
    *add({ payload, cb }, { call, put, select }) {
      yield call(create, payload.data, payload.pid);
      if (cb) {
        cb();
      }
      yield put({ type: "reload" });
    },

    *tree({ payload }, { call, put, select }) {
      const { data: tree } = yield call(categoryService.index, { root: 1 });
      const builder = data =>
        data.map(i => {
          if (i.children && i.children.length > 0) {
            i.children = builder(i.children);
          }
          return {
            ...i,
            value: String(i.id),
            label: i.name
          };
        });

      yield put({
        type: "save",
        payload: {
          tree: builder(tree)
        }
      });
    },

    *treeFilterModel({ payload }, { call, put, select }) {
      const { data: tree } = yield call(categoryService.index);
      const builder = data =>
        data.map(i => {
          if ((i.model_id === payload || payload === true) && i.type === 1) {
            i.disabled = false;
          } else {
            i.disabled = true;
          }
          if (i.children && i.children.length > 0) {
            i.children = builder(i.children);
          }

          return {
            ...i,
            value: String(i.id),
            label: i.name
          };
        });

      yield put({
        type: "save",
        payload: {
          treeFilterModel: builder(tree)
        }
      });
    },

    *fetchProps({ payload }, { call, put }) {
      const { data: models } = yield call(modelService.index);

      yield put({
        type: "save",
        payload: {
          models
        }
      });
    },

    *moveUp({ payload, cb }, { call, put, select }) {
      yield call(moveUp, payload);
      if (cb) {
        cb();
      }
      yield put({ type: "reload" });
    },

    *moveDown({ payload, cb }, { call, put, select }) {
      yield call(moveDown, payload);
      if (cb) {
        cb();
      }
      yield put({ type: "reload" });
    },

    *bind({ payload, cb }, { call, put, select }) {
      yield call(bind, payload.id, payload.bind);

      if (cb) {
        cb();
      }
    }
  }
});
