'use strict';

const Service = require('cocacms').BaseService;

class SiteService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'site';
  }

  /**
   * 获取第一个站点
   *
   * @return {object} 站点数据
   * @memberof SiteService
   */
  async first() {
    return await this.app.mysql.get(this._table);
  }

  /**
   * 激活站点
   *
   * @param {any} id id
   * @return {object} 刷新的token
   * @memberof SiteService
   */
  async reset(id) {
    const site = await this.show(id);
    return this.service.admin.signToken(Number(this.ctx.uid), site);
  }


}

module.exports = SiteService;
