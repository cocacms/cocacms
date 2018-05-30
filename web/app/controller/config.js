'use strict';

const Controller = require('./base');

class ConfigController extends Controller {
  async get() {
    this.ctx.body = await this.service.config.get();
  }

  async set() {
    this.ctx.body = await this.service.config.set(this.ctx.request.body);
  }


}

module.exports = ConfigController;
