'use strict';
const pathToRegexp = require('path-to-regexp');
const Service = require('cocacms').BaseService;

class PermissionService extends Service {

  constructor(ctx) {
    super(ctx);
    this._table = 'permission';
  }

  /**
   * 检查权限
   *
   * @param {any} method 方法
   * @param {any} path 请求路径
   * @param {any} uid 用户id
   * @return {boolean} 是否通过
   * @memberof PermissionService
   */
  async check(method, path, uid) {
    const user = await this.app.mysql.get('admin', { id: uid });
    if (user.is_super === 1) {
      return true;
    }

    const roles = await this.app.mysql.select('admin_role', {
      where: {
        uid,
      },
    });

    if (roles.length < 1) {
      return false;
    }

    const role_ids = [];
    for (const role of roles) {
      role_ids.push(role.rid);
    }
    const permissions = await this.app.mysql.select('permission', {
      where: {
        method: method.toLowerCase(),
        role_id: role_ids,
      },
    });

    for (const permission of permissions) {
      const re = pathToRegexp(permission.uri);
      const match = re.exec(path);
      if (match) {
        return true;
      }
    }

    return false;
  }

  /**
   * 获取全站路由
   *
   * @return {array} 路由数组
   * @memberof PermissionService
   */
  async allApis() {
    let apis = [];
    const _ = {};
    _.models = await this.service.model.index(null, null, [], '*', [], false);
    _.forms = await this.service.form.index(null, null, [], '*', [], false);
    for (const api of this.ctx.app.router.stack) {
      if (api.name) {
        apis.push({
          path: `${api.methods[api.methods.length - 1]}@${api.path}`,
          name: api.name,
        });
      }
    }

    const tags = [ 'model', 'form' ];
    for (const tag of tags) {
      if (_[`${tag}s`] && Array.isArray(_[`${tag}s`])) {
        const modelList = apis.filter(i => i.name.indexOf(`{${tag}}`) !== -1);
        for (const iterator of modelList) {
          for (const target of _[`${tag}s`]) {
            apis.push({
              path: iterator.path.replace(`:${tag}`, target.key),
              name: iterator.name.replace(`{${tag}}`, ` [${target.name}] `),
            });
          }
        }
      }
    }

    apis = apis.filter(i => (i.name.indexOf('{') === -1 && i.name.indexOf('}') === -1));
    return apis;
  }

  /**
   * 我的权限列表
   *
   * @return {array} 权限列表
   * @memberof PermissionService
   */
  async my() {
    return await this.listByUid(this.ctx.uid);
  }

  /**
   * 根据UID获取用户权限
   *
   * @param {any} uid 用户id
   * @return {array} 权限列表
   * @memberof PermissionService
   */
  async listByUid(uid) {
    const user = await this.app.mysql.get('admin', { id: uid });
    const apis = await this.allApis();
    const permissions = await this.app.mysql.query('SELECT permission.* FROM admin_role LEFT JOIN permission ON permission.role_id = admin_role.rid WHERE admin_role.uid = ?', [ uid ]);
    return apis.filter(_ => {
      if (user.is_super === 1) {
        return true;
      }
      const apiDatas = _.path.split('@', 2);
      const method = apiDatas[0];
      const uri = apiDatas[1];
      for (const permission of permissions) {
        const re = pathToRegexp(permission.uri);
        const match = re.exec(uri);
        if (permission.method.toLowerCase() === method && match) {
          return true;
        }
      }
      return false;
    }).map(i => i.path);
  }


  /**
   * 根据角色ID获取用户权限
   *
   * @param {any} rid 角色id
   * @return {array} 权限列表
   * @memberof PermissionService
   */
  async listByRole(rid) {
    const apis = await this.allApis();
    const permissions = await this.app.mysql.query('SELECT permission.* FROM permission WHERE permission.role_id = ?', [ rid ]);
    return apis.filter(_ => {
      const apiDatas = _.path.split('@', 2);
      const method = apiDatas[0];
      const uri = apiDatas[1];
      for (const permission of permissions) {
        const re = pathToRegexp(permission.uri);
        const match = re.exec(uri);
        if (permission.method.toLowerCase() === method && match) {
          return true;
        }
      }
      return false;
    }).map(i => i.path);
  }

}

module.exports = PermissionService;
