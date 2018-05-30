'use strict';

const Controller = require('./base');
/**
 * 前台-首页
 *
 * @class HomeController
 * @extends {Controller}
 */
class HomeController extends Controller {

  /**
   * 测试
   *
   * @memberof HomeController
   */
  async index() {
    await this.render('index');
  }
}

module.exports = HomeController;
