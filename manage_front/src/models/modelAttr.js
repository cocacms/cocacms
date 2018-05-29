import modelExtend from 'dva-model-extend'
import baseModel from '../common/modelTemplate';

import { indexs, adjustIndexs } from '../services/modelAttr';
import { message } from 'antd';

export default modelExtend(baseModel('modelAttr', false),
{
  namespace: 'modelAttr',
  state: {
    indexs : {
      keys: [],
      fulltexts: [],
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
    },
  },
  effects: {
    *fetchIndexs({ payload }, { call, put}) {
      const { data } = yield call(indexs, payload);
      yield put({
        type: 'save',
        payload: {
          indexs: data,
        }
      })
    },

    *adjustIndexs({ payload }, { call, put}) {
      yield call(adjustIndexs, payload.id, payload.data);
      message.success('修改成功');
      yield put({
        type: 'fetchIndexs',
        payload: payload.id
      })
    },
  },
}
);
