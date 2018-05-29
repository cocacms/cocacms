import modelExtend from 'dva-model-extend'
import baseModel from '../common/modelTemplate';


export default modelExtend(baseModel('permission', false),
{
  namespace: 'permission',
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
