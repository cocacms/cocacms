'use strict';

const Controller = require('./base');

/**
 * 通用控制器，用于操作模型
 *
 * @class GeneralController
 * @extends {Controller}
 */
class GeneralController extends Controller {
  /**
   * 初始化
   *
   * @memberof GeneralController
   */
  async init() {

    if (this.ctx.params.model) { // 模型
      const model = await this.service.model.single([[ 'key', this.ctx.params.model ]]);
      if (model === null) {
        this.error('表单不存在！');
      }
      const modelName = this.ctx.params.model;
      this.service.base._table = `${this.config.model.prefix}${modelName}`;
      return;
    }

    if (this.ctx.params.form) { // 表单
      const form = await this.service.form.single([[ 'key', this.ctx.params.form ]]);
      if (form === null) {
        this.error('表单不存在！');
      }

      const model = await this.service.model.show(form.model_id);
      if (model === null) {
        this.error('模型不存在！');
      }
      const modelName = model.key;
      this.service.base._table = `${this.config.model.prefix}${modelName}`;
    }

  }

  /**
   * 自动表单验证
   *
   * @return {object} 输入数据
   * @memberof GeneralController
   */
  async validate() {
    await this.init();
    const rules = await this.service.base.getValidateRules();
    let body = this.ctx.query.body;
    if (Object.keys(rules).length > 0) {
      body = await this.ctx.validate(rules);
    }
    // 自动加上site
    body.site_id = this.ctx.site.id;


    // transform
    for (const key in rules) {
      if (rules.hasOwnProperty(key)) {
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
   * 列表
   *
   * @memberof GeneralController
   */
  async index() {
    await this.init();
    try {
      this.ctx.query.where = JSON.parse(this.ctx.query.where);
      if (this.ctx.query.where) {
        const category_id_where = [];
        this.ctx.query.where = this.ctx.query.where.filter(search => {
          const _search = {};
          if (Array.isArray(search)) {
            _search.key = search[0];
            if (search.length === 3) {
              _search.condition = search[1];
            }
            _search.value = search[search.length - 1];
          }
          if (!search.condition) {
            _search.condition = '=';
          }

          if (_search.key === 'category_id' && !Array.isArray(_search.value)) {
            // 获取子栏目的，且model id匹配的
            category_id_where.push('category_id');
            category_id_where.push(_search.value);
            return false;
          }

          return true;
        });

        if (category_id_where.length >= 2) {
          const categorys = await this.service.category.index(category_id_where[1], false, true);
          if (categorys && categorys.length > 0) {
            this.ctx.query.where.push([ 'category_id', 'in', categorys.map(i => i.id) ]);
          }
        }

      }
    } catch (error) {
      this.ctx.query.where = [];
    }

    const result = await this.service.base.index(
      this.ctx.query.page,
      this.ctx.query.pageSize,
      this.ctx.query.where,
      this.ctx.query.field,
      this.ctx.query.order
    );

    result.data = await this.service.base.many2one(result.data, 'category', 'category_id', 'id');
    this.ctx.body = result;

  }

  /**
   * 单条数据
   *
   * @memberof GeneralController
   */
  async show() {
    await this.init();
    this.ctx.body = await this.service.base.show(this.ctx.params.id);
  }

  /**
   * 创建数据
   *
   * @memberof GeneralController
   */
  async create() {
    const body = await this.validate();
    this.ctx.body = await this.service.base.create(body);
  }

  /**
   * 更新数据
   *
   * @memberof GeneralController
   */
  async update() {
    const body = await this.validate();
    this.ctx.body = await this.service.base.update({
      ...body,
      id: this.ctx.params.id,
    });
  }

  /**
   * 更新数据[单]
   *
   * @memberof GeneralController
   */
  async updateOne() {
    await this.init();
    const body = await this.ctx.validate({
      key: [{ required: true, message: '请设置key' }],
      value: [{ required: true, message: '请设置value' }],
    });

    const data = {};
    data[body.key] = body.value;

    this.ctx.body = await this.app.mysql.update(this.service.base._table, data, { where: { id: this.ctx.params.id } });
  }

  /**
   * 删除数据
   *
   * @memberof GeneralController
   */
  async destroy() {
    await this.init();
    this.ctx.body = await this.service.base.destroy(this.ctx.params.id);
  }

  /**
   * 前后端通用 - 表单验证规则
   *
   * @memberof GeneralController
   */
  async rules() {
    await this.init();
    this.ctx.body = await this.service.base.getValidateRules(true);
  }

}

module.exports = GeneralController;
