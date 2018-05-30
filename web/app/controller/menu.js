'use strict';

const Controller = require('./base');

/**
 * 导航
 *
 * @class MenuController
 * @extends {Controller}
 */
class MenuController extends Controller {

  /**
   * 表单验证
   *
   * @memberof MenuController
   */
  async validate() {
    const data = await this.ctx.validate({
      name: [{ required: true, message: '请设置导航名称' }],
      type: [{ required: true, message: '请设置导航类型' }],
    });

    // 1-绑定栏目
    if (data.type === 1) {
      await this.ctx.validate({
        category_id: [{ required: true, message: '请设置导航绑定栏目' }],
      });
    }

    // 2-普通URL
    if (data.type === 2) {
      await this.ctx.validate({
        url: [{ required: true, message: '请设置导航菜单链接' }],
      });
    }

  }

  /**
   * 树结构
   *
   * @memberof MenuController
   */
  async index() {
    const result = await this.service.menu.index(-1, this.ctx.query.flat === '1', this.ctx.query.root === '1');
    this.ctx.body = this.service.category.toTree(result);
  }

  /**
   * 创建
   *
   * @memberof MenuController
   */
  async create() {
    await this.validate();
    this.ctx.body = await this.service.menu.create(this.ctx.request.body, this.ctx.query.pid);
  }

  /**
   * 更新
   *
   * @memberof MenuController
   */
  async update() {
    await this.validate();
    this.ctx.body = await this.service.menu.update(this.ctx.params.id, this.ctx.request.body);
  }

  /**
   * 删除
   *
   * @memberof MenuController
   */
  async destroy() {
    this.ctx.body = await this.service.menu.destroy(this.ctx.params.id);
  }

  /**
   * 上移
   *
   * @memberof MenuController
   */
  async moveUp() {
    this.ctx.body = await this.service.menu.moveUp(this.ctx.params.id);
  }

  /**
   * 下移
   *
   * @memberof MenuController
   */
  async moveDown() {
    this.ctx.body = await this.service.menu.moveDown(this.ctx.params.id);
  }

}

module.exports = MenuController;
