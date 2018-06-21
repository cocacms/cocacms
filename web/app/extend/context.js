'use strict';
const path = require('path');
const fs = require('fs');

module.exports = {

  async reloadPlugin() {
    await this.service.plugin.load();
    const enableList = await this.service.plugin.index(null, null, [[ 'enable', 1 ]], '*', [], false);
    // 加载插件
    const pluginPaths = [];
    const match = [];
    for (const plugin of enableList) {
      const dir = path.join(__dirname, `../plugin/${plugin.dirname}`);
      match.push(`${plugin.dirname}.js`);
      if (fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, `${plugin.dirname}.js`))) {
        pluginPaths.push(dir);
      }
    }

    this.app.loader.loadToContext(pluginPaths, 'plugin', {
      call: true,
      override: true,
      match,
      fieldClass: 'pluginClasses',
    });

  },

};
