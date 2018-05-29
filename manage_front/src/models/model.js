import modelExtend from 'dva-model-extend'
import baseModel from '../common/modelTemplate';


export default modelExtend(baseModel('model', false),
{
  namespace: 'model',
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
