'use strict';

const Controller = require('cocacms').BaseController;


class UploadController extends Controller {
  async index() {
    this.ctx.body = await this.service.upload.generate();
  }
}

module.exports = UploadController;
