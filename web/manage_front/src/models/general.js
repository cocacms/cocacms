import {
  index,
  create,
  update,
  destory,
  show,
  switchChange,
} from '../services/general';

export default {
  namespace: 'general',

  state: {
    modelKey: '',
    list: {},
    type: 'g',
    query: {
      page: 1,
      currentPage: 1,
      pageSize: 20,
      where: [],
      order: [],
      noMore: false,
    },

    data: {},
  },

  effects: {
    *reload(_, { call, put, select }) {
      const search = yield select(state => state.general.query);
      const _search = { ...search };
      _search.page = _search.currentPage;
      yield put({
        type: 'list',
        payload: _search,
      });
    },

    *list({ payload }, { call, put, select }) {
      const modelKey = yield select(state => state.general.modelKey);
      const type = yield select(state => state.general.type);
      const query = { ...payload };
      const { data: list } = yield call(index, payload, modelKey, type);
      query.currentPage = query.page;
      if (list.data.length < query.pageSize) {
        query.noMore = true;
      } else {
        query.noMore = false;
        query.page++;
      }

      yield put({
        type: 'save',
        payload: {
          list,
          query,
        },
      });
    },

    *add({ payload, cb, reload = true }, { call, put, select }) {
      const modelKey = yield select(state => state.general.modelKey);
      const type = yield select(state => state.general.type);
      const { data } = yield call(create, payload, modelKey, type);
      if (cb) {
        cb(data);
      }
      if (reload) {
        yield put({ type: 'reload' });
      }
    },

    *edit({ payload, cb, reload = true }, { call, put, select }) {
      const modelKey = yield select(state => state.general.modelKey);
      const type = yield select(state => state.general.type);
      const { data } = yield call(update, payload.id, payload, modelKey, type);
      if (cb) {
        cb(data);
      }
      if (reload) {
        yield put({ type: 'reload' });
      }
    },

    *del({ payload, cb }, { call, put, select }) {
      const modelKey = yield select(state => state.general.modelKey);
      const type = yield select(state => state.general.type);
      yield call(destory, payload, modelKey, type);
      if (cb) {
        cb();
      }
      yield put({ type: 'reload' });
    },

    *switchChange({ payload, cb, reload = true }, { call, put, select }) {
      const modelKey = yield select(state => state.general.modelKey);
      const type = yield select(state => state.general.type);
      const { data } = yield call(
        switchChange,
        payload.id,
        payload,
        modelKey,
        type
      );
      if (cb) {
        cb(data);
      }
      if (reload) {
        yield put({ type: 'reload' });
      }
    },

    *show({ payload, cb }, { call, put, select }) {
      const modelKey = yield select(state => state.general.modelKey);
      const type = yield select(state => state.general.type);
      const { data } = yield call(show, payload, modelKey, type);
      yield put({
        type: 'save',
        payload: {
          data,
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
