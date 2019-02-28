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
   * 自动表单验证
   *
   * @return {object} 输入数据
   * @memberof GeneralController
   */
  async validate() {
    await this.init();
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
      body = await this.ctx.validate(rules, body);
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
   * 栏目
   *
   * @return {object} where数据
   * @memberof GeneralController
   */
  async buildCategoryWhere() {
    let category_id_where = -1;
    let where;
    try {
      where = JSON.parse(this.ctx.query.where);
      if (where instanceof Array) {
        // 过滤 并提取catgory_id
        where = where.filter(search => {
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
            category_id_where = Number(_search.value);
            return false;
          }

          return true;
        });
      }
    } catch (error) {
      where = [];
    }

    const categorys = await this.service.category.index(
      category_id_where,
      [],
      false,
      true
    );

    if (categorys && categorys.length > 0) {
      where.push(['category_id', 'in', categorys.map(i => i.id)]);
    }

    return where;
  }

  /**
   * 列表
   *
   * @memberof GeneralController
   */
  async index() {
    await this.init();

    let where = [];

    if (this._type === 'model') {
      where = await this.buildCategoryWhere();
    }

    const result = await this.service.base.index(
      this.ctx.query.page,
      this.ctx.query.pageSize,
      where,
      this.ctx.query.field,
      this.ctx.query.order
    );

    result.data = await this.service.base.many2one(
      result.data,
      'category',
      'category_id',
      'id'
    );
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
    this.ctx.body = await this.service.base.update(
      Object.assign({}, body, {
        id: this.ctx.params.id,
      })
    );
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

    this.ctx.body = await this.app.mysql.update(
      this.service.base._table,
      data,
      { where: { id: this.ctx.params.id } }
    );
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
