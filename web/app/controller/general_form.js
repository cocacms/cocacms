'use strict';

const Controller = require('./general');

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
    const form = await this.service.form.single([
      ['key', this.ctx.params.form],
    ]);
    if (form === null) {
      this.error('表单预设不存在！');
    }

    const model = await this.service.model.show(form.form_id);
    if (model === null) {
      this.error('表单模型不存在！');
    }

    const modelName = model.key;
    this.service.base._table = `${this.config.model.prefix}${modelName}`;
  }
}

module.exports = GeneralController;
