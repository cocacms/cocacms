'use strict';

const Controller = require('./base');

class UploadController extends Controller {
  /**
   *上传
   *
   * @memberof UploadController
   */
  async index() {
    this.ctx.response.type = 'json';
    this.ctx.body = await this.service.upload.generate();
  }
}

module.exports = UploadController;
