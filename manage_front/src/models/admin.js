import modelExtend from 'dva-model-extend'
import router from 'umi/router';
import { message } from 'antd';
import { login, award, undo, resetPassword } from '../services/admin'
import { my as myPermission } from '../services/permission'
import base from '../services/base';
import baseModel from '../common/modelTemplate';


const siteService = base('site');
const adminService = base('admin');
const roleService = base('role');

export default modelExtend(baseModel('admin'),
{

  namespace: 'admin',

  state: {
    permission: [],
    fetch: false,
    info: {},
    site: [],
    currentSite:  {},
    roles: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *login({ payload }, { call, put }) {

      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      const { data } = yield call(login, payload);

      if (payload.remember) {
        localStorage.token = data.token;
      } else {
        sessionStorage.token = data.token;
      }

      yield put({
        type: 'fetch',
      })

      if (sessionStorage.prePath) {
        router.push(sessionStorage.prePath)
      } else {
        router.push('/')
      }
    },

    *logout(_, { call, put }) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('prePath');

      yield put({
        type: 'save',
        payload: {
          permission: [],
          fetch: false,
          info: {},
          currentSite: {},
          site: [],
        }
      })

      router.push('/login');
    },

    *fetch(_, { call, put }) {
      const { data: permission } = yield call(myPermission);
      const { data: site } = yield call(siteService.index);
      const { data: info } = yield call(adminService.show, 1);
      const { data: currentSite } = yield call(siteService.new, 1);

      yield put({
        type: 'save',
        payload: {
          permission,
          site,
          info,
          fetch: true,
          currentSite,
        }
      })
    },

    *changeSite({ payload }, { call, put }) {
      const { data: newToken } = yield call(siteService.show, payload);
      if (localStorage.token) {
        localStorage.token = newToken.token;
      } else {
        sessionStorage.token = newToken.token;
      }

      message.success('修改成功，1秒后刷新数据...')
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      yield put({
        type: 'fetch',
      })
    },

    *fetchRole({ payload }, { call, put}) {
      const { data: roles } = yield call(roleService.index);
      yield put({
        type: 'save',
        payload: {
          roles,
        }
      })
    },

    *award({ payload }, { call, put }) {
      yield call(award, payload);
      message.success('设置角色成功')
      yield put({ type: 'reload' })
    },

    *undo({ payload }, { call, put }) {
      yield call(undo, payload);
      message.success('取消角色成功')
      yield put({ type: 'reload' })
    },

    *resetPassword({ payload }, { call, put }) {
      yield call(resetPassword, payload);
      message.success('修改密码成功，您需要重新登录')
      setTimeout(() => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.reload();
      }, 1000);

    }

  },

}
);
