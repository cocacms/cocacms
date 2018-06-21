'use strict';
const path = require('path');
module.exports = app => {

  const directory = path.join(__dirname, 'app/hook');
  console.log('====================================');
  console.log('Coca CMS: Loading Hook Extend to App');
  console.log(`Path: ${directory}`);
  console.log('====================================');
  app.loader.loadToApp(directory, 'hooks');

  // 注册自定义模板标签
  const tagMap = [ 'list', 'single', 'menu', 'category' ];
  console.log('====================================');
  console.log('Coca CMS: Loading Nunjucks Tag to App');
  console.log(`Tags: ${tagMap.join(', ')}`);
  console.log('====================================');
  for (const tag of tagMap) {
    const targetPath = `./app/tag/${tag}`;
    const tagInstance = require(targetPath);
    app.nunjucks.addExtension(`${tag}Extension`, new tagInstance());
  }

  Object.defineProperty(app.context, 'plugin', {
    configurable: true,
  });
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();
    await ctx.reloadPlugin();
  });

};
