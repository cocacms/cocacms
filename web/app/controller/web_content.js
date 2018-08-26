'use strict';
const Controller = require('./base');
const svgCaptcha = require('svg-captcha');

/**
 * 前台-首页
 *
 * @class WebContentController
 * @extends {Controller}
 */
class WebContentController extends Controller {
  /**
   * 栏目页
   *
   * @memberof WebContentController
   */
  async category() {
    const key = this.ctx.params.key;
    const category = await this.service.category.single([['key', key]]);
    if (!category) {
      this.error('栏目不存在');
    }
    // 栏目类型：1列表页 2单页 3表单页 4调整链接
    const categorys = await this.service.category.index(
      category.id,
      false,
      true
    );
    const categorys_ids = categorys.map(i => i.id);
    let template = 'category';
    let data = {};
    let model = null;
    let modelAttr = [];
    const modelAttrMap = {};

    if (category.model_id) {
      model = await this.service.model.show(category.model_id);
      if (model === null) {
        this.error('模型不存在！');
      }
      this.service.base._table = `${this.config.model.prefix}${model.key}`;
      const result = await this.service.modelAttr.index(
        null,
        null,
        [['model_id', model.id]],
        '*',
        [['sort']],
        false
      );

      modelAttr = result.map(i => {
        i.optionsArray = this.service.modelAttr.options2array(i.options);
        modelAttrMap[i.key] = i;
        return i;
      });
    }

    if (category.type === 1 && category.template_list) {
      // 列表页
      template = category.template_list;
      if (category.model_id) {
        data = await this.service.base.index(
          this.ctx.query.page,
          this.ctx.query.pageSize ? this.ctx.query.pageSize : 8,
          [['category_id', category.id]],
          '*',
          [['id', 'desc']]
        );
      }
    }

    if (category.type === 2 && category.template_page) {
      template = category.template_page;
      if (category.model_id && category.bind) {
        data = await this.service.base.show(category.bind);
      }
    }

    await this.render(template, {
      category,
      categorys,
      categorys_ids,
      data,
      model,
      modelAttr,
      modelAttrMap,
    });
  }

  /**
   * 详情页
   *
   * @memberof WebContentController
   */
  async detail() {
    const key = this.ctx.params.key;
    let category = await this.service.category.single([['key', key]]);
    if (!category) {
      this.error('栏目不存在');
    }
    const categorys = await this.service.category.index(
      category.id,
      false,
      true
    );
    const categorys_ids = categorys.map(i => i.id);

    let template = 'article';
    let data = {};
    let model = null;
    let modelAttr = [];
    const modelAttrMap = {};

    if (category.template_detail) {
      template = category.template_detail;
    }

    if (category.model_id) {
      model = await this.service.model.show(category.model_id);
      if (model === null) {
        this.error('模型不存在！');
      }

      const result = await this.service.modelAttr.index(
        null,
        null,
        [['model_id', model.id]],
        '*',
        [['sort']],
        false
      );

      this.service.base._table = `${this.config.model.prefix}${model.key}`;
      data = await this.service.base.show(this.ctx.params.id);
      if (data === null) {
        this.error('数据不存在！');
      }

      modelAttr = result.map(i => {
        i.optionsArray = this.service.modelAttr.options2array(i.options);
        if (i.optionsArray.length > 0 && data[i.key]) {
          if (Array.isArray(data[i.key])) {
            data[i.key] = i.optionsArray.filter(item =>
              data[i.key].includes(item.value)
            );
          } else {
            data[i.key] = i.optionsArray.filter(
              item => data[i.key] === item.value
            );
          }
        }
        modelAttrMap[i.key] = i;
        return i;
      });

      if (data.category_id !== category.id) {
        category = await this.service.category.single([
          ['id', data.category_id],
        ]);
      }
    }

    const preData = await this.service.base.single(
      [['id', '<', data.id], ['category_id', 'in', categorys_ids]],
      '*',
      [['id', 'desc']]
    );
    const nextData = await this.service.base.single([
      ['id', '>', data.id],
      ['category_id', 'in', categorys_ids],
    ]);

    await this.render(template, {
      category,
      categorys,
      categorys_ids,
      data,
      model,
      modelAttr,
      modelAttrMap,
      preData,
      nextData,
    });
  }

  /**
   * 自动表单验证
   *
   * @return {object} 输入数据
   * @memberof GeneralController
   */
  async validate() {
    const rules = await this.service.base.getValidateRules();
    let body = this.ctx.request.body;

    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        if (body[key] === null || body[key] === undefined) {
          delete body[key];
        }
      }
    }

    if (Object.keys(rules).length > 0) {
      // remove null value
      body = await this.ctx.validate(rules);
    }

    // 自动加上site
    body.site_id = this.ctx.site.id;

    // transform
    for (const key in rules) {
      if (rules.hasOwnProperty(key) && body.hasOwnProperty(key)) {
        const rule = rules[key];
        for (const item of rule) {
          if (item.transform && typeof item.transform === 'function') {
            body[key] = item.transform(body[key]);
          }
        }
      }
    }

    return body;
  }

  /**
   * 验证码
   *
   * @memberof WebContentController
   */
  async captcha() {
    const captcha = svgCaptcha.createMathExpr({
      color: true,
      noise: 3,
    });
    this.ctx.set('content-type', 'image/svg+xml');
    this.ctx.session.captcha = captcha.text;
    this.ctx.body = captcha.data;
  }

  /**
   * 表单提交
   *
   * @memberof WebContentController
   */
  async submitForm() {
    const key = this.ctx.params.key;
    const form = await this.service.form.single([['key', key]]);
    if (form === null) {
      this.error('表单不存在！');
    }

    if (form.model_id) {
      const model = await this.service.model.show(form.model_id);
      if (model === null) {
        this.error('模型不存在！');
      }
      this.service.base._table = `${this.config.model.prefix}${model.key}`;
    } else {
      this.error('模型不存在！');
    }

    const body = await this.validate();

    delete body.captcha;
    delete body._csrf;
    this.ctx.session.captcha = Math.random();
    if (body.id) {
      this.ctx.body = await this.service.base.update(body);
    } else {
      delete body.id;
      this.ctx.body = await this.service.base.create(body);
    }
  }

  async admin() {
    await this.ctx.render('_admin_.nj');
  }
}

module.exports = WebContentController;
