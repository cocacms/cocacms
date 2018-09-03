'use strict';

const BaseContextClass = require('egg').BaseContextClass;
const path = require('path');

class Plugin extends BaseContextClass {
  constructor(ctx, fullpath = null) {
    super(ctx);
    if (fullpath === null) {
      fullpath = this.fullPath;
    }
    this.loadPluginConfig(fullpath);
  }

  loadPluginConfig(fullpath) {
    const name = path.parse(fullpath).name;
    this.config = this.app.getPluginConfig(name);
  }

}

module.exports = Plugin;
