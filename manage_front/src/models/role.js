import modelExtend from 'dva-model-extend'
import baseModel from '../common/modelTemplate';

export default modelExtend(baseModel('role', false),
{

  namespace: 'role',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
    },
  },
  effects: {
  },
}
);
