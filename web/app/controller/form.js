'use strict';

const Controller = require('./base');
/**
 * 表单
 *
 * @class FormController
 * @extends {Controller}
 */
class FormController extends Controller {
  /**
   * 表单验证
   *
   * @return {object} 表单内容
   * @memberof FormController
   */
  async validate() {
    return await this.ctx.validate({
      key: [
        { required: true, message: '请设置关键字' },
        { pattern: this.ctx.re.name, message: '关键字只能是字母、数字、_' },
      ],
      model_id: [
        { required: true, message: '请设置绑定的模型' },
        { type: 'integer', message: '模型id必须为数字' },
      ],
      name: [{ required: true, message: '请设置表单名称' }],
    });
  }

  /**
   * 列表
   *
   * @memberof FormController
   */
  async index() {
    this.ctx.body = await this.service.form.index(
      null,
      null,
      this.ctx.query.where,
      '*',
      [],
      false
    );
  }

  /**
   * 创建
   *
   * @memberof FormController
   */
  async create() {
    await this.validate();
    this.ctx.body = await this.service.form.create(this.ctx.request.body);
  }

  /**
   * 更新
   *
   * @memberof FormController
   */
  async update() {
    await this.validate();
    this.ctx.body = await this.service.form.update(Object.assign({}, { id: this.ctx.params.id,
    }, this.ctx.request.body));
  }

  /**
   * 删除
   *
   * @memberof FormController
   */
  async destroy() {
    this.ctx.body = await this.service.form.destroy(this.ctx.params.id);
  }
}

module.exports = FormController;
