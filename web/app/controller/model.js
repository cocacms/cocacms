'use strict';

const Controller = require('./base');
/**
 * 模型管理
 *
 * @class CategoryController
 * @extends {Controller}
 */
class CategoryController extends Controller {
  /**
   * 表单验证
   *
   * @return {object} 表单数据
   * @memberof CategoryController
   */
  async validate() {
    return await this.ctx.validate({
      key: [
        { required: true, message: '请设置模型关键字' },
        { pattern: this.ctx.re.name, message: '模型关键字只能是字母、数字、_' },
      ],
      name: [{ required: true, message: '请设置模型名称' }],
    });
  }

  /**
   * 模型列表
   *
   * @memberof CategoryController
   */
  async index() {
    const models = await this.service.model.index(
      null,
      null,
      [],
      '*',
      [],
      false
    );
    for (const model of models) {
      model.attrs = await this.service.modelAttr.getAttr(model.id, model.key);
    }
    this.ctx.body = models;
  }

  /**
   * 创建模型
   *
   * @memberof CategoryController
   */
  async create() {
    const body = await this.validate();
    await this.service.modelAttr.modelName(body.key);
    const exist = await this.service.modelAttr.tablePreCheck(false);
    if (exist) {
      this.error('数据表已经存在，请检查');
    }
    this.ctx.body = await this.service.model.create(body);
  }

  /**
   * 更新模型
   *
   * @memberof CategoryController
   */
  async update() {
    const body = await this.validate();
    delete body.key; // 不允许修改
    this.ctx.body = await this.service.model.update(Object.assign({}, body, {
      id: this.ctx.params.id,
    }));
  }

  /**
   * 删除模型
   *
   * @memberof CategoryController
   */
  async destroy() {
    const model = await this.service.model.show(this.ctx.params.id);
    if (model === null) {
      this.error('不存在的模型');
    }
    this.ctx.body = await this.service.model.destroy(this.ctx.params.id);
    await this.service.modelAttr.modelName(model.key);
    const exist = await this.service.modelAttr.tablePreCheck(false);
    if (this.ctx.body.affectedRows > 0 && exist) {
      // 回收表
      await this.service.modelAttr.retrieve();
    }
  }
}

module.exports = CategoryController;
