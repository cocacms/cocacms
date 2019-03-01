'use strict';

const Controller = require('./base');
/**
 * 站点管理
 *
 * @class PluginController
 * @extends {Controller}
 */
class PluginController extends Controller {
  /**
   * 列表
   *
   * @memberof PluginController
   */
  async index() {
    this.ctx.body = await this.service.plugin.index();
  }

  /**
   * 加载
   *
   * @memberof PluginController
   */
  async load() {
    this.ctx.body = await this.service.plugin.load();
  }

  /**
   * 开启关闭
   *
   * @memberof PluginController
   */
  async updateEnable() {
    const data = await this.ctx.validate({
      name: [{ required: true, message: '请输入包名' }],
      enable: [{ required: true, message: '请输入状态' }],
    });

    const target = await this.service.plugin.show(data.name);
    if (target.install !== true) this.error('请先安装插件');
    this.ctx.body = await this.service.plugin.update(
      data.name,
      'enable',
      data.enable
    );
  }

  /**
   * 修改配置
   *
   * @memberof PluginController
   */
  async updateSetting() {
    const data = await this.ctx.validate({
      name: [{ required: true, message: '请输入包名' }],
      setting: [
        {
          required: true,
          message: '请输入配置且配置必须为Object',
          type: 'object',
        },
      ],
    });

    const target = await this.service.plugin.show(data.name);
    if (target.install !== true) this.error('请先安装插件');
    if (target.enable !== true) this.error('请先启用插件');
    this.ctx.body = await this.service.plugin.update(
      data.name,
      'setting',
      data.setting
    );
  }

  async install() {
    this.ctx.body = await this.service.plugin.install(this.ctx.params.name);
  }

  async uninstall() {
    this.ctx.body = await this.service.plugin.uninstall(this.ctx.params.name);
  }
}

module.exports = PluginController;
