import { Icon } from 'antd';

/**
 * name：菜单名称
 * icon：
 *    Allow menu.js config icon as string or ReactNode
 *      icon: 'setting',
 *      icon: 'http://demo.com/icon.png',
 *      icon: <Icon type="setting" />,
 * path：路由，需要保证全局唯一，展开项的path不会生效，但也要填写
 */

const menu = [
  {
    name: '首页',
    icon: <Icon type="home" />,
    path: '/'
  },
  {
    name: '内容管理',
    icon: <Icon type="file-text" />,
    path: '/content'
  },
  {
    name: '数据汇总',
    icon: <Icon type="line-chart" />,
    path: '_form_data_',
    children: [

    ]
  },
  {
    name: '栏目管理',
    icon: <Icon type="layout" />,
    can: 'GET@/api/category',
    path: '/category'
  },
  {
    name: '导航管理',
    icon: <Icon type="profile" />,
    can: 'GET@/api/menu',
    path: '/menu'
  },
  {
    name: '管理与角色',
    icon: <Icon type="lock" />,
    path: '_admin_auth',
    children: [
      {
        name: '管理员管理',
        can: 'GET@/api/admin',
        path: '/manager/admin'
      },
      {
        name: '角色管理',
        can: 'GET@/api/role',
        path: '/manager/role'
      }
    ]
  },
  {
    name: '配置',
    icon: <Icon type="setting" />,
    path: '_setting',
    children: [
      {
        name: '系统配置',
        can: 'GET@/api/config',
        path: {
          reg: '/setting/:activeKey?',
          params: {}
        },
      },
      {
        name: '模型配置',
        can: 'GET@/api/model',
        path: '/model'
      },
      {
        name: '表单配置',
        can: 'GET@/api/form',
        path: '/form'
      },
      {
        name: '站点管理',
        can: 'GET@/api/site',
        path: '/site'
      },
      {
        name: '插件管理',
        can: 'GET@/api/plugin',
        path: '/plugin'
      },
    ]
  },

];

export default function(forms = []) {
  const formChild = []
  for (const form of forms) {
    formChild.push({
      name: form.name,
      can: `GET@/api/f/${form.key}`,
      path: `/form/${form.key}`
    })
  }

  return [ ...menu.slice(0, 2), {
    ...menu[2],
    children: formChild,
  } , ...menu.slice(3)];
}
