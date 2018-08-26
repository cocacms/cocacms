'use strict';
const path = require('path');
module.exports = app => {
  // hook机制
  const directory = path.join(__dirname, 'app/hook');
  app.logger.info(
    '[cocacms] Loading Hook Extend to App, hook is %j',
    directory
  );
  app.loader.loadToApp(directory, 'hooks');

  // 注册自定义模板标签
  const tagMap = ['list', 'single', 'menu', 'category', 'static', 'hook'];
  app.logger.info('[cocacms] Loading Nunjucks Tag to App, tags is %j', tagMap);

  for (const tag of tagMap) {
    const targetPath = `./app/tag/${tag}`;
    const tagInstance = require(targetPath);
    app.nunjucks.addExtension(`${tag}Extension`, new tagInstance());
  }

  // 加载插件
  Object.defineProperty(app.context, 'plugin', {
    configurable: true,
  });
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();

    await ctx.reloadPlugin();
    if (app.hooks && typeof app.hooks.appLoaded === 'function') {
      await app.hooks.appLoaded(ctx);
    }

    if (app.pluginHook.appLoaded && Array.isArray(app.pluginHook.appLoaded)) {
      for (const appLoaded of app.pluginHook.appLoaded) {
        await appLoaded(ctx);
      }
    }
  });
};
