'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const subRouter = router.namespace(
    '',
    middleware.front(),
    middleware.hook(app.hooks)
  );
  subRouter.get('home', '/', controller.webCustom.index);
};
