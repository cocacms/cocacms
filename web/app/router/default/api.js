'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const subRouter = router.namespace('/api', middleware.auth(app.config.auth));

  /**
   * 上传
   */
  subRouter.post('上传', '/upload', controller.upload.index);

  /**
   * 管理员
   */

  subRouter.post('/admin/login', controller.admin.login);
  subRouter.put('授权角色', '/admin/award', controller.admin.award);
  subRouter.put('取消授权角色', '/admin/undo', controller.admin.undo);
  subRouter.put('修改密码', '/admin/password', controller.admin.resetPassword);
  subRouter.resources('管理员', '/admin', controller.admin);

  /**
   * 栏目管理
   */
  subRouter.put('栏目上移', '/category/moveUp/:id', controller.category.moveUp);
  subRouter.put(
    '栏目下移',
    '/category/moveDown/:id',
    controller.category.moveDown
  );
  subRouter.put('栏目下移', '/category/bind/:id', controller.category.bind);
  subRouter.resources('栏目', '/category', controller.category);

  /**
   * 导航管理
   */
  subRouter.put('导航上移', '/menu/moveUp/:id', controller.menu.moveUp);
  subRouter.put('导航下移', '/menu/moveDown/:id', controller.menu.moveDown);
  subRouter.resources('导航', '/menu', controller.menu);

  /**
   * 主题管理
   */
  subRouter.resources('主题模板', '/theme', controller.theme);

  /**
   * 角色管理
   */
  subRouter.resources('角色', '/role', controller.role);

  /**
   * 权限管理
   */
  subRouter.get('我的权限', '/permission/my', controller.permission.my);
  subRouter.resources('权限', '/permission', controller.permission);

  /**
   * 模型管理
   */
  subRouter.resources('模型', '/model', controller.model);

  /**
   * 模型管理
   */
  subRouter.resources('表单', '/form', controller.form);

  /**
   * 模型字段管理
   */
  const modelAttrRouter = router.namespace(
    '/api/modelAttr',
    middleware.auth(app.config.auth),
    middleware.modelAttr()
  );

  modelAttrRouter.get('模型字段列表', '/:model', controller.modelAttr.index);
  modelAttrRouter.get(
    '模型索引列表',
    '/:model/indexs',
    controller.modelAttr.indexs
  );
  modelAttrRouter.post('创建模型字段', '/:model', controller.modelAttr.create);
  modelAttrRouter.put(
    '编辑模型索引',
    '/:model/indexs',
    controller.modelAttr.adjustIndex
  );
  modelAttrRouter.put(
    '编辑模型字段',
    '/:model/:id',
    controller.modelAttr.update
  );
  modelAttrRouter.delete(
    '删除模型字段',
    '/:model/:id',
    controller.modelAttr.destroy
  );

  /**
   * 通用模型
   */
  subRouter.get('获取{model}列表', '/g/:model', controller.generalModel.index);
  subRouter.get(
    '获取{model}验证规则',
    '/g/:model/rules',
    controller.generalModel.rules
  );
  subRouter.get(
    '获取{model}详情',
    '/g/:model/:id',
    controller.generalModel.show
  );
  subRouter.post('创建{model}', '/g/:model', controller.generalModel.create);
  subRouter.put(
    '编辑{model}数据',
    '/g/:model/:id',
    controller.generalModel.update
  );
  subRouter.put(
    '更新{model}字段',
    '/g/:model/:id/one',
    controller.generalModel.updateOne
  );
  subRouter.delete(
    '删除{model}',
    '/g/:model/:id',
    controller.generalModel.destroy
  );

  /**
   * 表单
   */

  subRouter.get('获取{form}列表', '/f/:form', controller.generalForm.index);
  subRouter.get(
    '获取{form}验证规则',
    '/f/:form/rules',
    controller.generalForm.rules
  );
  subRouter.get('获取{form}详情', '/f/:form/:id', controller.generalForm.show);
  // subRouter.post('创建{form}', '/f/:form', controller.generalForm.create);
  // subRouter.put('编辑{form}数据', '/f/:form/:id', controller.generalForm.update);
  subRouter.put(
    '更新{form}字段',
    '/f/:form/:id/one',
    controller.generalForm.updateOne
  );
  subRouter.delete(
    '删除{form}',
    '/f/:form/:id',
    controller.generalForm.destroy
  );

  /**
   * 配置
   */

  subRouter.get('获取系统配置', '/config', controller.config.get);
  subRouter.post('编辑系统配置', '/config', controller.config.set);

  /**
   * 站点管理
   */

  subRouter.resources('站点', '/site', controller.site);

  /**
   * 插件管理
   */

  subRouter.get('重载插件', '/plugin/load', controller.plugin.load);
  subRouter.post('切换插件', '/plugin', controller.plugin.updateEnable);
  subRouter.post(
    '更新插件配置',
    '/plugin/setting',
    controller.plugin.updateSetting
  );
  subRouter.post('安装插件', '/plugin/:id', controller.plugin.install);
  subRouter.delete('卸载插件', '/plugin/:id', controller.plugin.uninstall);
  subRouter.get('插件列表', '/plugin', controller.plugin.index);
};
