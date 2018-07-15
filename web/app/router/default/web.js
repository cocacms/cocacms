'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const subRouter = router.namespace('', middleware.front(), middleware.hook(app.hooks));

  subRouter.post('web-form', '/form/:key', controller.webContent.submitForm);
  subRouter.get('web-captcha', '/_/captcha', controller.webContent.captcha);
  subRouter.get('web-category', '/:key', controller.webContent.category);
  subRouter.get('web-detail', '/:key/:id', controller.webContent.detail);
};
