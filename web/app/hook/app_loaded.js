'use strict';

module.exports = () => {
  return async function hook(ctx) {
    ctx.app.logger.debug('[cocacms] hi this is hook test');
  };
};
