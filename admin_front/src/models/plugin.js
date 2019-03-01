import modelExtend from "dva-model-extend";
import { baseModel } from "./base";
import {
  reload,
  toggle,
  setting,
  install,
  uninstall
} from "../services/plugin";

export default modelExtend(baseModel("plugin", false), {
  namespace: "plugin",
  state: {},
  subscriptions: {},
  effects: {
    *reload({ payload, cb }, { call, put, select }) {
      yield call(reload);
      yield put({ type: "list" });
      if (typeof cb === "function") cb();
    },

    *toggle({ payload, cb }, { call, put, select }) {
      yield call(toggle, payload.name, payload.enable === 1);
      yield put({ type: "list" });
      if (typeof cb === "function") cb();
    },

    *setting({ payload, cb }, { call, put, select }) {
      yield call(setting, payload.name, payload.setting);
      yield put({ type: "list" });
      if (typeof cb === "function") cb();
    },

    *install({ payload, cb }, { call, put, select }) {
      yield call(install, payload.name);
      yield put({ type: "list" });
      if (typeof cb === "function") cb();
    },

    *uninstall({ payload, cb }, { call, put, select }) {
      yield call(uninstall, payload.name);
      yield put({ type: "list" });
      if (typeof cb === "function") cb();
    }
  }
});
