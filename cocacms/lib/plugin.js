'use strict';

const BaseContextClass = require('egg').BaseContextClass;
const path = require('path');

class Plugin extends BaseContextClass {
  constructor(ctx) {
    super(ctx);
    this.loadPluginConfig();
  }

  loadPluginConfig() {
    const name = path.parse(this.fullPath).name;
    this.config = this.app.getPluginConfig(name);
  }

}

module.exports = Plugin;
