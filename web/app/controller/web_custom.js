'use strict';
const Controller = require('./base');

/**
 * 前台-用户自定有
 *
 * @class WebCustomController
 * @extends {Controller}
 */
class WebCustomController extends Controller {
  /**
   * 首页
   *
   * @memberof WebCustomController
   */
  async index() {
    await this.render('home');
  }
}

module.exports = WebCustomController;
