'use strict';

const Service = require('./base');
const path = require('path');
const fs = require('fs');

class ThemeService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'theme';
  }

  /**
   * 获取目前主题
   *
   * @return {object} 当前主题
   * @memberof ThemeService
   */
  async getActive() {
    const theme = await this.app.mysql.get(this._table, { use: 1 });
    if (theme === null) {
      return await this.app.mysql.get(this._table);
    }

    return theme;
  }

  /**
   * 规整主题数据
   *
   * @return {object} 处理结果
   * @memberof ThemeService
   */
  async load() {
    const themeRootPath = path.resolve('./app/theme');
    const dirs = fs.readdirSync(themeRootPath, 'utf8');
    const packages = [];
    for (const dirname of dirs) {
      const dir = path.join(themeRootPath, dirname);
      if (fs.statSync(dir).isDirectory()) {
        const configPath = path.join(dir, 'config.js');
        if (fs.existsSync(configPath)) {
          let config = Object.assign({}, require(configPath));
          config = await this.ctx.validate({
            package: [{ required: true, message: `主题(${dirname})配置文件中缺少“包名”[package]字段` }],
            name: [{ required: true, message: `主题(${dirname})配置文件中缺少“名称”[name]字段` }],
            author: [{ required: true, message: `主题(${dirname})配置文件中缺少“作者”[author]字段` }],
          }, config);
          const exist = await this.app.mysql.count(this._table, { package: config.package });

          packages.push(config.package);

          if (exist > 0) {
            await this.app.mysql.update(this._table, {
              ...config,
              dirname,
            }, { where: { package: config.package } });
          } else {
            await this.app.mysql.insert(this._table, {
              ...config,
              dirname,
            });
          }
        }
      }
    }
    if (packages.length > 0)
      await this.app.mysql.query('DELETE FROM theme WHERE package NOT IN (?)', [ packages ]);

    return {};
  }


  /**
   * 设为当前主题
   *
   * @param {any} id 主题id
   * @return {object}处理结果
   * @memberof ThemeService
   */
  async active(id) {
    await this.app.mysql.query(`UPDATE ${this._table} SET \`use\` = 0`);
    return await this.app.mysql.query(`UPDATE ${this._table} SET \`use\` = 1 WHERE id = ?`, [ id ]);
  }

}

module.exports = ThemeService;
