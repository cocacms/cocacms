import base from "../services/base";

export default {
  namespace: "__g__",
  state: {}
};

export const baseModel = function(serviceName, pager = true) {
  const service = base(serviceName);

  return {
    state: {
      _tag: "",
      list: pager ? {} : [],
      show: {},
      query: {
        page: 1,
        currentPage: 1,
        pageSize: 20,
        where: [],
        order: [],
        noMore: false
      }
    },

    effects: {
      *list({ payload }, { call, put, select }) {
        const _tag = yield select(state => state[serviceName]._tag);
        const { data: list } = yield call(service.index, payload, _tag);

        const query = { ...payload };
        if (pager) {
          query.currentPage = query.page;
          if (list.data.length < query.pageSize) {
            query.noMore = true;
          } else {
            query.noMore = false;
            query.page++;
          }
        }

        yield put({
          type: "save",
          payload: {
            list,
            query
          }
        });
      },

      *show({ payload, cb }, { call, put, select }) {
        const _tag = yield select(state => state[serviceName]._tag);
        const { data: show } = yield call(service.show, payload, _tag);
        yield put({
          type: "save",
          payload: {
            show
          }
        });

        if (cb) {
          cb(show);
        }
      },

      *add({ payload, cb }, { call, put, select }) {
        const _tag = yield select(state => state[serviceName]._tag);
        const { data } = yield call(service.create, payload, _tag);
        if (cb) {
          cb(data);
        }
        yield put({ type: "reload" });
      },

      *edit({ payload, cb }, { call, put, select }) {
        const _tag = yield select(state => state[serviceName]._tag);
        const { data } = yield call(service.update, payload.id, payload, _tag);
        if (cb) {
          cb(data);
        }
        yield put({ type: "reload" });
      },

      *del({ payload, cb }, { call, put, select }) {
        const _tag = yield select(state => state[serviceName]._tag);
        yield call(service.destory, payload, _tag);
        if (cb) {
          cb();
        }
        yield put({ type: "reload" });
      },

      *reload(_, { call, put, select }) {
        const search = yield select(state => state[serviceName].query);
        const _search = { ...search };
        _search.page = _search.currentPage;
        yield put({
          type: "list",
          payload: _search
        });
      }
    },

    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      }
    }
  };
};
