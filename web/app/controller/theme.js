'use strict';

const Controller = require('./base');

class CategoryController extends Controller {
  /**
   * 获取主题列表
   *
   * @memberof CategoryController
   */
  async index() {
    this.ctx.body = await this.service.theme.index(
      null,
      null,
      [],
      '*',
      [],
      false
    );
  }

  /**
   * 查询加载主题
   *
   * @memberof CategoryController
   */
  async create() {
    this.ctx.body = await this.service.theme.load();
  }

  /**
   * 设为使用主题
   *
   * @memberof CategoryController
   */
  async update() {
    this.ctx.body = await this.service.theme.active(this.ctx.params.id);
  }
}

module.exports = CategoryController;
