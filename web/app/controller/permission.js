'use strict';

const Controller = require('./base');
/**
 * 权限管理
 *
 * @class PermissionController
 * @extends {Controller}
 */
class PermissionController extends Controller {

  /**
   * 表单验证
   *
   * @return {object} 表单数据
   * @memberof CategoryController
   */
  async validate() {
    return await this.ctx.validate({
      uri: [{ required: true, message: '请设置权限接口' }],
      method: [{ required: true, message: '请设置权限类型' }],
      role_id: [{ required: true, message: '请设置角色id' }],
    });
  }

  /**
   * 获取全部接口
   *
   * @memberof PermissionController
   */
  async index() {
    this.ctx.body = await this.service.permission.allApis();
  }

  /**
   * 获取我的权限接口
   *
   * @memberof PermissionController
   */
  async my() {
    this.ctx.body = await this.service.permission.my();
  }

  /**
   * 获取角色的权限
   *
   * @memberof PermissionController
   */
  async show() {
    this.ctx.body = await this.service.permission.listByRole(this.ctx.params.id);
  }

  /**
   * 创建权限
   *
   * @memberof PermissionController
   */
  async create() {
    const body = await this.validate();
    this.ctx.body = await this.service.permission.create(body);
  }

  /**
   * 删除权限
   *
   * @memberof PermissionController
   */
  async destroy() {
    this.ctx.body = await this.service.permission.destroy(this.ctx.params.id);
  }
}

module.exports = PermissionController;
