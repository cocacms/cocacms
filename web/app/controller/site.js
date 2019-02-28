'use strict';

const Controller = require('./base');
/**
 * 站点管理
 *
 * @class SiteController
 * @extends {Controller}
 */
class SiteController extends Controller {
  /**
   * 表单验证
   *
   * @return {object} 表单数据
   * @memberof SiteController
   */
  async validate() {
    const body = await this.ctx.validate({
      name: [{ required: true, message: '请设置站点名称' }],
      locale: [{ required: true, message: '请设置站点语言' }],
    });

    delete body.config;

    return body;
  }

  /**
   * 列表
   *
   * @memberof SiteController
   */
  async index() {
    this.ctx.body = await this.service.site.index(
      null,
      null,
      [],
      '*',
      [['id', 'asc']],
      false
    );
  }

  /**
   * 创建
   *
   * @memberof SiteController
   */
  async create() {
    const body = await this.validate();
    this.ctx.body = await this.service.site.create(body);
  }

  /**
   * 更新
   *
   * @memberof SiteController
   */
  async update() {
    const body = await this.validate();
    this.ctx.body = await this.service.site.update(
      Object.assign({}, body, {
        id: this.ctx.params.id,
      })
    );
  }

  /**
   * 删除
   *
   * @memberof SiteController
   */
  async destroy() {
    this.ctx.body = await this.service.site.destroy(this.ctx.params.id);
  }

  /**
   * 设置当前
   *
   * @memberof SiteController
   */
  async show() {
    this.ctx.body = await this.service.site.reset(this.ctx.params.id);
  }

  /**
   * 当前的站点
   *
   * @memberof SiteController
   */
  async new() {
    this.ctx.body = this.ctx.site;
  }
}

module.exports = SiteController;
