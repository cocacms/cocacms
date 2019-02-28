'use strict';

const Controller = require('./base');
/**
 * 角色管理
 *
 * @class RoleController
 * @extends {Controller}
 */
class RoleController extends Controller {
  /**
   * 表单验证
   *
   * @return {object} 表单数据
   * @memberof RoleController
   */
  async validate() {
    return await this.ctx.validate({
      name: [{ required: true, message: '请设置角色名称' }],
    });
  }

  /**
   * 角色列表
   *
   * @memberof RoleController
   */
  async index() {
    this.ctx.body = await this.service.role.index(
      null,
      null,
      [],
      '*',
      [['id', 'asc']],
      false
    );
  }

  /**
   * 角色详情
   *
   * @memberof RoleController
   */
  async show() {
    const data = await this.service.role.show(this.ctx.params.id);
    this.ctx.body = (await this.service.role.one2many([data], 'permission'))[0];
  }

  /**
   * 创建角色
   *
   * @memberof RoleController
   */
  async create() {
    await this.validate();
    this.ctx.body = await this.service.role.create(this.ctx.request.body);
  }

  /**
   * 更新
   *
   * @memberof RoleController
   */
  async update() {
    await this.validate();
    this.ctx.body = await this.service.role.update(
      Object.assign({}, this.ctx.request.body, {
        id: this.ctx.params.id,
      })
    );
  }

  /**
   * 删除
   *
   * @memberof RoleController
   */
  async destroy() {
    this.ctx.body = await this.service.role.destroy(this.ctx.params.id);
  }
}

module.exports = RoleController;
