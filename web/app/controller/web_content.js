'use strict';

const Controller = require('./base');
/**
 * 前台-首页
 *
 * @class WebContentController
 * @extends {Controller}
 */
class WebContentController extends Controller {

  /**
   * 首页
   *
   * @memberof WebContentController
   */
  async index() {
    await this.render('home');
  }

  async category() {
    const key = this.ctx.params.key;
    const category = await this.service.category.single([[ 'key', key ]]);
    // 栏目类型：1列表页 2单页 3表单页 4调整链接

    let template = 'category';
    let data = {};
    let model = null;
    if (category.type === 1 && category.template_list) {
      template = category.template_list;

      if (category.model_id) {
        model = await this.service.model.show(category.model_id);
        if (model === null) {
          this.error('模型不存在！');
        }
        this.service.base._table = `${this.config.model.prefix}${model.key}`;
        data = await this.service.base.index(
          this.ctx.query.page,
          this.ctx.query.pageSize ? this.ctx.query.pageSize : 8,
          [[ 'category_id', category.id ]],
          '*',
          [[ 'id', 'desc' ]]
        );
      }

    }

    if (category.type === 2 && category.template_page) {
      template = category.template_page;
      if (category.model_id && category.bind) {
        model = await this.service.model.show(category.model_id);
        if (model === null) {
          this.error('模型不存在！');
        }
        this.service.base._table = `${this.config.model.prefix}${model.key}`;
        data = await this.service.base.show(category.bind);
      }
    }

    await this.render(template, {
      category,
      data,
      model,
    });
  }


  async detail() {
    const key = this.ctx.params.key;
    const category = await this.service.category.single([[ 'key', key ]]);

    let template = 'article';
    let data = {};
    let model = null;

    if (category.template_detail) {
      template = category.template_detail;
    }

    if (category.model_id) {
      model = await this.service.model.show(category.model_id);
      if (model === null) {
        this.error('模型不存在！');
      }
      this.service.base._table = `${this.config.model.prefix}${model.key}`;
      data = await this.service.base.show(this.ctx.params.id);
    }

    await this.render(template, {
      category,
      data,
      model,
    });
  }

}

module.exports = WebContentController;
