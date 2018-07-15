'use strict';

const range = require('koa-range');
const compose = require('koa-compose');
const staticCache = require('koa-static-cache');
const mkdirp = require('mkdirp');
const LRU = require('ylru');
const fs = require('fs');
const path = require('path');

module.exports = (options, app) => {
  options = app.config.static;

  const staticDirs = [];
  if (options.dynamic && !options.files) {
    options.files = new LRU(options.maxFiles);
  }

  function rangeMiddleware(ctx, next) {
    if (options.prefix && !ctx.path.startsWith(options.prefix)) return next();
    return range(ctx, next);
  }

  const middlewares = [ rangeMiddleware ];

  let themes = app.config.view.root ? app.config.view.root : [];
  if (!Array.isArray(themes)) {
    themes = themes.split(',');
  }

  for (const themeRootPath of themes) {
    const dirs = fs.readdirSync(themeRootPath, 'utf8');
    for (const filename of dirs) {
      const dir = path.join(themeRootPath, filename);
      if (fs.statSync(dir).isDirectory()) {
        const localesDir = path.join(dir, 'static');
        if (fs.existsSync(localesDir) && fs.statSync(localesDir).isDirectory()) {
          staticDirs.push(localesDir);

          // copy origin options to new options
          // ensure the safety of objects
          const newOptions = Object.assign({}, options);
          newOptions.dir = localesDir;
          newOptions.prefix = `/static/${filename}/`;

          // ensure directory exists
          mkdirp.sync(newOptions.dir);

          app.loggers.coreLogger.info('[egg-static] starting static serve %s -> %s', newOptions.prefix, newOptions.dir);

          middlewares.push(staticCache(newOptions));

        }
      }
    }
  }

  app.logger.info('[cocacms] Loading Theme Static to App, Theme Static is %j', staticDirs);

  return compose(middlewares);
};
