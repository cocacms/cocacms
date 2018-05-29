'use strict';

const Controller = require('egg').Controller;
/**
 * 基础控制器
 *
 * @class BaseController
 * @extends {Controller}
 */
class BaseController extends Controller {
  /**
   * 抛出异常
   *
   * @param {any} msg 异常信息
   * @memberof BaseService
   */
  error(msg) {
    this.ctx.error(msg);
  }

  /**
   * 根据主题渲染
   *
   * @param {any} path 渲染文件（不需要后缀）
   * @param {any} [data={}] 数据
   * @memberof BaseController
   */
  async render(path, data = {}) {
    const theme = await this.service.theme.getActive();
    let themeDir = '';
    if (theme !== null) {
      themeDir = `${theme.dirname}/`;
    }
    await this.ctx.render(`${themeDir}${path}.nj`, data);
  }
}

module.exports = BaseController;
