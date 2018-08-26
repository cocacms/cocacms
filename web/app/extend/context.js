'use strict';
const path = require('path');
const fs = require('fs');

module.exports = {
  // 动态加载插件
  async reloadPlugin() {
    await this.service.plugin.load();
    const enableList = await this.service.plugin.index(
      null,
      null,
      [['enable', 1]],
      '*',
      [],
      false
    );
    // 加载插件
    const pluginPaths = [];
    const match = [];
    const hooks = {};
    const configs = {};
    for (const plugin of enableList) {
      const dir = path.join(__dirname, `../plugin/${plugin.dirname}`);
      configs[plugin.dirname] = JSON.parse(plugin.setting);
      if (fs.statSync(dir).isDirectory()) {
        if (fs.existsSync(path.join(dir, `${plugin.dirname}.js`))) {
          pluginPaths.push(dir);
          match.push(`${plugin.dirname}.js`);
        }
        const hookDir = path.join(dir, 'hook');
        if (fs.existsSync(hookDir) && fs.statSync(hookDir).isDirectory()) {
          const hookItems = fs.readdirSync(hookDir, 'utf8');
          for (const hookItem of hookItems) {
            const hookItemPath = path.join(hookDir, hookItem);
            let hookItemName = path
              .parse(hookItemPath)
              .name.replace(/[_-][a-z]/gi, s => s.substring(1).toUpperCase());
            let first = hookItemName[0];
            first = first.toLowerCase();
            hookItemName = first + hookItemName.substring(1);
            if (!hooks[hookItemName]) {
              hooks[hookItemName] = [];
            }
            hooks[hookItemName].push(
              require(hookItemPath)(configs[plugin.dirname])
            );
          }
        }
      }
    }

    this.app.pluginHook = hooks;
    this.app.pluginConfig = configs;

    this.app.loader.loadToContext(pluginPaths, 'plugin', {
      call: true,
      override: true,
      match,
      fieldClass: 'pluginClasses',
    });
  },
};
