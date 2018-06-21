'use strict';

const Service = require('./base');

class ConfigService extends Service {
  /**
   *设置配置
   *
   * @param {*} data 配置数据
   * @return {any} 处理结果
   * @memberof ConfigService
   */
  async set(data) {
    return await this.app.mysql.update('site', {
      config: JSON.stringify(data),
    }, { where: { id: this.ctx.site.id } });
  }

  /**
   *获取配置
   *
   * @return {object} 配置
   * @memberof ConfigService
   */
  async get() {
    const data = await this.app.mysql.get('site', { id: this.ctx.site.id });
    try {
      const config = JSON.parse(data.config);
      if (config === null) {
        return {};
      }
      return config;
    } catch (error) {
      return {};
    }
  }

}

module.exports = ConfigService;
