import modelExtend from 'dva-model-extend'
import baseModel from '../common/modelTemplate';
import { reload, toggle, install, uninstall } from '../services/plugin';

export default modelExtend(baseModel('plugin', false),
{
  namespace: 'plugin',
  state: {

  },
  subscriptions: {
  },
  effects: {
    *reload({ payload, cb }, { call, put, select }) {
      yield call(reload);
      yield put({ type: 'list' })
    },

    *toggle({ payload, cb }, { call, put, select }) {
      yield call(toggle, payload.id, payload.enable);
      yield put({ type: 'list' })
    },

    *install({ payload, cb }, { call, put, select }) {
      yield call(install, payload.id);
      yield put({ type: 'list' })
    },


    *uninstall({ payload, cb }, { call, put, select }) {
      yield call(uninstall, payload.id);
      yield put({ type: 'list' })
    },
  },
}
);
