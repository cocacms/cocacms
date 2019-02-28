'use strict';
const fs = require('fs');

const loggerError = (err, ctx) => {
  if (err === 404) return 'Page Not Found';

  const message = err.message;

  // 唯一插入报错处理
  if (message.indexOf('Duplicate entry') >= 0) {
    return '内容已存在，请勿重复插入';
  }

  // 表单验证错误
  if (err.status && err.status === 422) {
    if (err.errors && err.errors.errors && err.errors.errors.length > 0) {
      return err.errors.errors[0].message;
    }
  }

  if (!(err instanceof ctx.app.exception.runnerExection)) {
    ctx.logger.warn(err);
  }

  return message;
};

module.exports = () => {
  return async function errorHandler(ctx, next) {
    let handler = false;
    let error = null;
    try {
      await next();
      if (ctx.status === 404) {
        handler = true;
        error = 404;
      }
    } catch (e) {
      handler = true;
      error = e;
    }

    if (handler) {
      ctx.status = error.status || 500;
      if (ctx.acceptJSON) {
        ctx.body = { message: loggerError(error, ctx) };
      } else {
        const theme = await ctx.service.theme.getActive();
        let themeDir = '';
        if (theme !== null) {
          themeDir = `${theme.dirname}/`;
        }
        let hookData = {};
        if (ctx.app.hooks.render) {
          hookData = await ctx.app.hooks.render(ctx);
        }

        try {
          const template = `${themeDir}${error === 404 ? '404' : '500'}.nj`;
          if (fs.existsSync(template)) {
            ctx.body = await ctx.renderView(
              template,
              Object.assign({}, hookData, {
                message: loggerError(error, ctx),
              })
            );
          } else {
            ctx.body = `<h1>${loggerError(error, ctx)}</h1>`;
          }
        } catch (viewerror) {
          ctx.body = `<h1>${loggerError(viewerror, ctx)}</h1>`;
        }
      }
    }
  };
};
