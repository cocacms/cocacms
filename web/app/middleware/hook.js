'use strict';

module.exports = hooks => {
  return async function hook(ctx, next) {
    let _matchedRouteName = '';

    if (ctx._matchedRouteName) {
      const property = ctx._matchedRouteName.replace(/[_-][a-z]/gi, s =>
        s.substring(1).toUpperCase()
      );
      let first = property[0];
      first = first.toUpperCase();
      _matchedRouteName = first + property.substring(1);
    }

    if (typeof hooks[`before${_matchedRouteName}`] === 'function') {
      await hooks[`before${_matchedRouteName}`](ctx);
    }

    if (
      ctx.app.pluginHook[`before${_matchedRouteName}`] &&
      Array.isArray(ctx.app.pluginHook[`before${_matchedRouteName}`])
    ) {
      for (const hookFun of ctx.app.pluginHook[`before${_matchedRouteName}`]) {
        if (typeof hookFun === 'function') {
          await hookFun(ctx);
        }
      }
    }

    await next();

    if (ctx._matchedRouteName) {
      if (typeof hooks[`after${_matchedRouteName}`] === 'function') {
        await hooks[`after${_matchedRouteName}`](ctx);
      }
    }

    if (
      ctx.app.pluginHook[`after${_matchedRouteName}`] &&
      Array.isArray(ctx.app.pluginHook[`after${_matchedRouteName}`])
    ) {
      for (const hookFun of ctx.app.pluginHook[`after${_matchedRouteName}`]) {
        if (typeof hookFun === 'function') {
          await hookFun(ctx);
        }
      }
    }
  };
};
