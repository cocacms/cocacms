'use strict';
const path = require('path');
const fs = require('fs');
const debug = require('debug')('application');
const locales = require('koa-locales');

module.exports = app => {

  // 加载异常扩展
  const directory = path.join(__dirname, 'app/exception');
  app.logger.info('[cocacms] Loading Exception Extend to App, Exception is %j', directory);
  app.loader.loadToApp(directory, 'exception');


  // 添加theme的语言包
  if (!Array.isArray(app.config.i18n.dirs)) {
    app.config.i18n.dirs = [];
  }

  let themes = app.config.view.root ? app.config.view.root : [];
  if (!Array.isArray(themes)) {
    themes = themes.split(',');
  }

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

  app.logger.info('[cocacms] Loading Theme Lauguage to App, Theme Lauguage is %j', app.config.i18n.dirs);

  locales(app, app.config.i18n);

  // 注册主题静态资源解析
  const index = app.config.coreMiddleware.indexOf('bodyParser');
  if (index === -1) {
    app.config.coreMiddleware.push('themestatic');
  } else {
    app.config.coreMiddleware.splice(index, 0, 'themestatic');
  }

};
