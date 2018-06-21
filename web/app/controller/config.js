'use strict';

const Controller = require('./base');

class ConfigController extends Controller {
  /**
   *获取配置
   *
   * @memberof ConfigController
   */
  async get() {
    this.ctx.body = await this.service.config.get();
  }

  /**
   *设置配置
   *
   * @memberof ConfigController
   */
  async set() {
    this.ctx.body = await this.service.config.set(this.ctx.request.body);
  }


}

module.exports = ConfigController;
