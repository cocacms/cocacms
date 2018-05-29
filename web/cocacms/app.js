'use strict';
const path = require('path');
const fs = require('fs');
const debug = require('debug')('application');
const locales = require('koa-locales');

module.exports = app => {

  // 加载异常扩展
  const directory = path.join(__dirname, 'app/exception');
  console.log('====================================');
  console.log('Coca CMS: Loading Exception Extend to App');
  console.log(`Path: ${directory}`);
  console.log('====================================');
  app.loader.loadToApp(directory, 'exception');


  // 添加theme的语言包
  if (!Array.isArray(app.config.i18n.dirs)) {
    app.config.i18n.dirs = [];
  }

  let themes = app.config.view.root ? app.config.view.root : [];
  if (!Array.isArray(themes)) {
    themes = themes.split(',');
  }

  console.log('====================================');
  console.log('Coca CMS: Loading Theme Lauguage to App');
  console.log(`Path: ${themes.join(', ')}`);
  console.log('====================================');

  for (const themeRootPath of themes) {
    const dirs = fs.readdirSync(themeRootPath, 'utf8');
    for (const filename of dirs) {
      const dir = path.join(themeRootPath, filename);
      if (fs.statSync(dir).isDirectory()) {
        const localesDir = path.join(dir, 'locales');
        if (fs.existsSync(localesDir) && fs.statSync(localesDir).isDirectory()) {
          app.config.i18n.dirs.push(localesDir);
        }
      }
    }
  }

  debug('app.config.i18n.dirs:', app.config.i18n.dirs);
  locales(app, app.config.i18n);

  // 注册自定义模板标签
  const tagMap = [ 'list', 'single' ];
  console.log('====================================');
  console.log('Coca CMS: Loading Nunjucks Tag to App');
  console.log(`Tags: ${tagMap.join(', ')}`);
  console.log('====================================');
  for (const tag of tagMap) {
    const targetPath = `./app/tag/${tag}`;
    const tagInstance = require(targetPath);
    app.nunjucks.addExtension(`${tag}Extension`, new tagInstance());
  }

};
