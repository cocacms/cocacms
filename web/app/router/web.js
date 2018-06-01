'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const subRouter = router.namespace('', middleware.front());
  subRouter.get('home', '/', controller.webContent.index);

  subRouter.get('web-category', '/:key', controller.webContent.category);
  subRouter.get('web-detail', '/:key/:id', controller.webContent.detail);
};
