import modelExtend from 'dva-model-extend';
import baseService from '../services/base';
import { baseModel } from './base';
import { rules } from '../services/general';
import { indexs } from '../services/modelAttr';

const modelService = baseService('model');
const modelAttrService = baseService('modelAttr');
const formService = baseService('form');

export default modelExtend(baseModel('form', false), {
  namespace: 'form',
  state: {
    models: [],
    attrs: [],
    rules: {},
    indexs: [],
    current: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {},
  },
  effects: {
    *fetchProps({ payload }, { call, put }) {
      const { data: models } = yield call(modelService.index);

      yield put({
        type: 'save',
        payload: {
          models,
        },
      });
    },

    *fetchFormDataProps({ payload }, { call, put }) {
      const { data } = yield call(formService.index, {
        where: [{ key: 'key', value: payload }],
      });
      const { data: attrs } = yield call(
        modelAttrService.index,
        {},
        `/${data[0].model_id}`
      );
      const { data: ruleData } = yield call(rules, payload, 'f');
      const { data: indexsData } = yield call(indexs, data[0].model_id);

      yield put({
        type: 'save',
        payload: {
          current: data[0],
          attrs,
          rules: ruleData,
          indexs: [
            ...indexsData.keys.map(i => ({ type: 'key', key: i })),
            ...indexsData.fulltexts.map(i => ({ type: 'fulltext', key: i })),
          ],
        },
      });
    },
  },
});
