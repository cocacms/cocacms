import { message } from 'antd';
import base from '../services/base';

const configService = base('config');


export default {

  namespace: 'config',

  state: {
    config: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(configService.index);
      yield put({
        type: 'save',
        payload: {
          config: data
        }
      })
    },

    *set({ payload }, { call, put, select }) {
      const config = yield select(state => state.config.config);
      config[payload.scope] = payload.data;
      yield call(configService.create, config);
      message.success('修改成功！');
      yield put({
        type: 'fetch',
      })
    },

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
