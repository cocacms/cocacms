'use strict';

const Controller = require('./base');


class UploadController extends Controller {
  async index() {
    this.ctx.body = await this.service.upload.generate();
  }
}

module.exports = UploadController;
