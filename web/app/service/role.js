'use strict';

const Service = require('./base');

class RoleService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'role';
  }

  /**
   *颁发角色
   *
   * @param {*} uid 用户id
   * @param {*} rid 角色id
   * @return {*} 处理结果
   * @memberof RoleService
   */
  async award(uid, rid) {
    return await this.app.mysql.insert('admin_role', {
      uid, rid,
    });
  }
  /**
   *撤销角色
   *
   * @param {*} uid 用户id
   * @param {*} rid 角色id
   * @return {*} 处理结果
   * @memberof RoleService
   */
  async undo(uid, rid) {
    return await this.app.mysql.delete('admin_role', {
      uid, rid,
    });
  }
}

module.exports = RoleService;
