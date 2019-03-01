'use strict';

const Service = require('@cocacms/cocacms').Service;

class PluginService extends Service {
  async index() {
    const result = [];
    for (const name in this.app.cocaPlugin.plugins) {
      const plugin = this.app.cocaPlugin.get(name);
      result.push(plugin);
    }
    return result;
  }

  async show(name) {
    return this.app.cocaPlugin.get(name);
  }

  async update(name, key, value) {
    this.app.cocaPlugin.set(name, key, value);
    return {};
  }
  /**
   * 重载插件
   *
   * @return {object} 处理结果
   * @memberof PluginService
   */
  async load() {
    for (const name in this.app.cocaPlugin.plugins) {
      this.app.cocaPlugin.reload(name);
    }
    return {};
  }

  async install(name) {
    this.app.cocaPlugin.install(name);
    return {};
  }

  async uninstall(name) {
    this.app.cocaPlugin.uninstall(name);
    return {};
  }
}

module.exports = PluginService;
