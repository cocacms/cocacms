import modelExtend from 'dva-model-extend'
import baseModel from '../common/modelTemplate';


export default modelExtend(baseModel('theme', false),
{
  namespace: 'theme',
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
