'use strict';

const Controller = require('./base');
/**
 * 栏目
 *
 * @class CategoryController
 * @extends {Controller}
 */
class CategoryController extends Controller {

  /**
   * 表单验证
   *
   * @return {object} 表单内容
   * @memberof CategoryController
   */
  async validate() {
    const body = await this.ctx.validate({
      key: [{ required: true, message: '请设置栏目关键字' }, { pattern: this.ctx.re.name, message: '栏目关键字只能是字母、数字、_' }],
      name: [{ required: true, message: '请设置栏目名称' }],
      type: [{ required: true, message: '请设置栏目类型' }],
    });

    if (body.pic) {
      body.pic = JSON.stringify(body.pic);
    }

    return body;
  }

  /**
   * 树结构
   *
   * @memberof CategoryController
   */
  async index() {
    let result = await this.service.category.index(-1, this.ctx.query.flat === '1', this.ctx.query.root === '1');
    result = await this.service.category.one2one(result, 'model', 'model_id', 'id');
    result = result.map(i => {
      try {
        i.pic = JSON.parse(i.pic);
        if (!i.pic) {
          i.pic = [];
        }
      } catch (error) {
        i.pic = [];
      }

      return i;
    });
    this.ctx.body = this.service.category.toTree(result);
  }

  /**
   * 创建
   *
   * @memberof CategoryController
   */
  async create() {
    const body = await this.validate();
    this.ctx.body = await this.service.category.create(body, this.ctx.query.pid);
  }

  /**
   * 修改
   *
   * @memberof CategoryController
   */
  async update() {
    const body = await this.validate();
    const old = await this.service.category.show(this.ctx.params.id);
    // 如果更新模型，取消绑定
    if (old.model_id !== body.model_id) {
      await this.service.category.update(this.ctx.params.id, { bind: null });
    }

    this.ctx.body = await this.service.category.update(this.ctx.params.id, body);
    if (body.model_id && this.ctx.body.affectedRows > 0) {
      await this.setChild(this.ctx.params.id, body.model_id);
    }
  }


  /**
   * 修改bind
   *
   * @memberof CategoryController
   */
  async bind() {

    const body = await this.ctx.validate({
      bind: [{ required: true, message: '请设置栏目类型' }],
    });

    this.ctx.body = await this.service.category.update(this.ctx.params.id, { bind: body.bind });
  }

  /**
   * 设置子栏目模块id
   *
   * @param {int} id id
   * @param {int} model_id 模块id
   */
  async setChild(id, model_id) {
    const childs = await this.service.category.index(id, false);
    for (const child of childs) {
      if (child.model_id === null) {
        await this.service.category.update(child.id, {
          model_id,
        });
      }
    }
  }

  /**
   * 删除
   *
   * @memberof CategoryController
   */
  async destroy() {
    this.ctx.body = await this.service.category.destroy(this.ctx.params.id);
  }

  /**
   * 上移
   *
   * @memberof CategoryController
   */
  async moveUp() {
    this.ctx.body = await this.service.category.moveUp(this.ctx.params.id);
  }

  /**
   * 下移
   *
   * @memberof CategoryController
   */
  async moveDown() {
    this.ctx.body = await this.service.category.moveDown(this.ctx.params.id);
  }

}

module.exports = CategoryController;
