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
    const model = await this.service.model.single([
      ['key', this.ctx.params.model],
    ]);
    if (model === null) {
      this.error('模型不存在！');
    }
    const modelName = model.key;
    this._type = 'model';
    this.service.base._table = `${this.config.model.prefix}${modelName}`;
  }
}

module.exports = GeneralController;
