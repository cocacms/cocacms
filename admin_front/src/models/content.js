import base from '../services/base';
import { rules } from '../services/general';
import { indexs } from '../services/modelAttr';

const categoryService = base('category');
const modelAttrService = base('modelAttr');

export default {
  namespace: 'content',

  state: {
    category: [],
    current: {
      model: {},
    },
    attrs: [],
    rules: {},
    indexs: [],
  },

  effects: {
    *fetchCategory({ payload, cb }, { call, put, select }) {
      const { data: category } = yield call(categoryService.index);

      const builder = data =>
        data.map(i => {
          if (i.children && i.children.length > 0) {
            i.children = builder(i.children);
          }
          return {
            ...i,
            value: String(i.id),
            label: i.name,
          };
        });

      yield put({
        type: 'save',
        payload: {
          category: builder(category),
        },
      });
    },

    *changeCategory({ payload }, { call, put, select }) {
      const category = yield select(state => state.content.category);
      // 递归查询栏目
      const find = data => {
        for (const iterator of data) {
          if (iterator.value === payload) {
            return iterator;
          }
          if (iterator.children && iterator.children.length > 0) {
            const _ = find(iterator.children);
            if (_ !== false) {
              return _;
            }
          }
        }
        return false;
      };

      const current = find(category);

      if (!current) {
        return;
      }

      // 未绑定模型栏目不显示
      if (current.model_id === null || !current.model) {
        current.type = -1;
        yield put({
          type: 'save',
          payload: {
            current: {
              ...current,
              model: {},
            },
            attrs: [],
            rules: {},
          },
        });
        return;
      }

      const { data: attrs } = yield call(
        modelAttrService.index,
        {},
        `/${current.model_id}`
      );
      const { data: ruleData } = yield call(rules, current.model.key);
      const { data: indexsData } = yield call(indexs, current.model_id);
      yield put({
        type: 'save',
        payload: {
          current,
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

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
