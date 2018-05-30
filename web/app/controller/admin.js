'use strict';

const Controller = require('./base');
/**
 * 后台管理员
 *
 * @class AdminController
 * @extends {Controller}
 */
class AdminController extends Controller {

  /**
   * 表单验证
   *
   * @memberof AdminController
   */
  async validateAward() {
    await this.ctx.validate({
      uid: [{ required: true, message: '请设置用户id' }],
      rid: [{ required: true, message: '请设置角色id' }],
    });
  }


  /**
   * 用户登录
   *
   * @memberof AdminController
   */
  async login() {
    const data = await this.ctx.validate({
      account: [{ required: true, message: '请输入登录邮箱' }, { pattern: this.ctx.re.mail, message: '请输入邮箱' }],
      password: [{ required: true, message: '请输入密码' }],
    });

    this.ctx.body = await this.service.admin.login(data.account, data.password);
  }

  /**
   * 颁发角色
   *
   * @memberof AdminController
   */
  async award() {
    await this.validateAward();
    this.ctx.body = await this.service.role.award(this.ctx.request.body.uid, this.ctx.request.body.rid);
  }

  /**
   * 撤销角色
   *
   * @memberof AdminController
   */
  async undo() {
    await this.validateAward();
    this.ctx.body = await this.service.role.undo(this.ctx.request.body.uid, this.ctx.request.body.rid);
  }

  /**
   * 列表
   *
   * @memberof AdminController
   */
  async index() {
    const result = await this.service.admin.index(this.ctx.query.page, this.ctx.query.pageSize, this.ctx.query.where, 'id,account,nickname,is_super', this.ctx.query.order);
    result.data = await this.service.admin.many2many(result.data, 'role', null, 'uid', 'rid');
    this.ctx.body = result;
  }

  /**
   * 创建
   *
   * @memberof AdminController
   */
  async create() {

    const data = await this.ctx.validate({
      account: [{ required: true, message: '请输入登录邮箱' }, { pattern: this.ctx.re.mail, message: '请输入邮箱' }],
      password: [{ required: true, message: '请输入密码' }],
      nickname: [{ required: true, message: '请输入昵称' }],
    });

    data.password = this.service.admin.signPassword(data.password);
    delete data.is_super;

    this.ctx.body = await this.service.admin.create(data);

  }

  /**
   * 更新
   *
   * @memberof AdminController
   */
  async update() {
    const data = await this.ctx.validate({
      account: [{ required: true, message: '请输入登录邮箱' }, { pattern: this.ctx.re.mail, message: '请输入邮箱' }],
      nickname: [{ required: true, message: '请输入昵称' }],
    });

    if (data.password) {
      data.password = this.service.admin.signPassword(data.password);
    }

    delete data.is_super;

    this.ctx.body = await this.service.admin.update({
      ...this.ctx.request.body,
      id: this.ctx.params.id,
    });
  }

  /**
   * 删除
   *
   * @memberof AdminController
   */
  async destroy() {
    const target = await this.service.admin.show(this.ctx.params.id);
    if (target.is_super === 1) {
      this.error('超级管理员不能被删除！');
    }
    this.ctx.body = await this.service.admin.destroy(this.ctx.params.id);
  }

  /**
   * 我的信息
   *
   * @memberof AdminController
   */
  async show() {
    this.ctx.body = await this.service.admin.show(this.ctx.uid);
    delete this.ctx.body.password;
  }

  /**
   * 修改密码
   *
   * @memberof AdminController
   */
  async resetPassword() {
    const body = await this.ctx.validate({
      oPassword: { required: true, message: '请输入旧密码' },
      newPassword: { required: true, message: '请输入新密码' },
    });
    this.ctx.body = await this.service.admin.resetPassword(body.oPassword, body.newPassword);
  }

}

module.exports = AdminController;
