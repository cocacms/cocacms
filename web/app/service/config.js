'use strict';

const Service = require('./base');

class ConfigService extends Service {
  async set(data) {
    return await this.app.mysql.update('site', {
      config: JSON.stringify(data),
    }, { where: { id: this.ctx.site.id } });
  }

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
