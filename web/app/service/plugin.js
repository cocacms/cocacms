'use strict';

const Service = require('./base');
const path = require('path');
const fs = require('fs');

class PluginService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'plugin';
  }

  /**
   * 规整插件数据
   *
   * @return {object} 处理结果
   * @memberof PluginService
   */
  async load() {
    const pluginRootPath = path.resolve('./app/plugin');
    const dirs = fs.readdirSync(pluginRootPath, 'utf8');
    const dirnames = [];
    for (const dirname of dirs) {
      const dir = path.join(pluginRootPath, dirname);
      if (fs.statSync(dir).isDirectory()) {
        const configPath = path.join(dir, 'config.js');
        if (fs.existsSync(configPath)) {
          let config = Object.assign({}, require(configPath));
          config = await this.ctx.validate({
            name: [{ required: true, message: `插件(${dirname})配置文件中缺少“名称”[name]字段` }],
            author: [{ required: true, message: `插件(${dirname})配置文件中缺少“作者”[author]字段` }],
          }, config);
          const exist = await this.app.mysql.count(this._table, { dirname });

          dirnames.push(dirname);
          config.config = JSON.stringify(config.config);

          if (exist > 0) {
            await this.app.mysql.update(this._table, {
              ...config,
              dirname,
            }, { where: { dirname } });
          } else {
            await this.app.mysql.insert(this._table, {
              ...config,
              dirname,
            });
          }
        }
      }
    }

    await this.app.mysql.query('DELETE FROM plugin WHERE dirname NOT IN (?)', [ dirnames ]);

    return {};
  }

  async _getRunner(id) {
    const target = await this.show(id);
    const dirname = target.dirname;
    const pluginRootPath = path.resolve('./app/plugin');
    const fullpath = path.join(pluginRootPath, `${dirname}/${dirname}.js`);
    if (!fs.existsSync(fullpath)) {
      this.error(`${fullpath}不存在`);
    }
    const Class = require(fullpath);
    return new Class(this.ctx);
  }

  async install(id) {
    const runner = await this._getRunner(id);
    if (typeof runner.install === 'function') {
      const result = await runner.install();
      if (result !== true) {
        return this.error(result);
      }
      return await this.update({
        id,
        installed: 1,
      });
    }
    return this.error('安装程序未定义');
  }

  async uninstall(id) {
    const runner = await this._getRunner(id);

    if (typeof runner.uninstall === 'function') {
      const result = await runner.uninstall();
      if (result !== true) {
        return this.error(result);
      }
      await this.update({
        id,
        installed: 0,
        enable: 0,
      });
      this.ctx.reloadPlugin();
      return {};
    }

    this.error('卸载程序未定义');
  }


}

module.exports = PluginService;
