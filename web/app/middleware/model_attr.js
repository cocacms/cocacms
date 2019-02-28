'use strict';

module.exports = () => {
  return async function front(ctx, next) {
    await ctx.service.modelAttr.model(ctx.params.model);
    await next();
  };
};
