import base from "../services/base";
import { rules } from "../services/general";
import { indexs } from "../services/modelAttr";
import builder from "../common/treebuilder";

const categoryService = base("category");
const modelAttrService = base("modelAttr");

export default {
  namespace: "content",

  state: {
    category: [],
    current: {
      model: {}
    },
    attrs: [],
    rules: {},
    indexs: []
  },

  effects: {
    *fetchCategory({ payload, cb }, { call, put, select }) {
      const { data: category } = yield call(categoryService.index);

      yield put({
        type: "save",
        payload: {
          category: builder(category)
        }
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
          type: "model_undefined",
          payload: current
        });
        return;
      }

      let model_id = current.model_id;
      let model_key = current.model.key;
      if (current.type === 3) {
        if (current.form_id === null || !current.form) {
          // 表单未绑定模型栏目不显示
          current.type = -1;
          yield put({
            type: "model_undefined",
            payload: current
          });
          return;
        }

        model_id = current.form.model_id;
        model_key = current.form.key;
      }

      yield put({
        type: "save",
        payload: {
          current
        }
      });

      yield put({
        type: "loadContent",
        payload: {
          model_id,
          model_key
        }
      });
    },

    *loadContent({ payload }, { call, put, select }) {
      const { data: ruleData } = yield call(rules, payload.model_key);
      const { data: indexsData } = yield call(indexs, payload.model_id);
      const { data: attrs } = yield call(
        modelAttrService.index,
        {},
        `/${payload.model_id}`
      );
      yield put({
        type: "save",
        payload: {
          attrs,
          rules: ruleData,
          indexs: [
            ...indexsData.keys.map(i => ({ type: "key", key: i })),
            ...indexsData.fulltexts.map(i => ({ type: "fulltext", key: i }))
          ]
        }
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },

    model_undefined(state, action) {
      return {
        ...state,
        ...{
          current: {
            ...action.payload,
            model: {}
          },
          attrs: [],
          rules: {}
        }
      };
    }
  }
};
