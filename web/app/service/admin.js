'use strict';

const Service = require('cocacms').BaseService;
const jwt = require('jsonwebtoken');
const fs = require('fs');

class AdminService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'admin';
  }

  /**
   * 密码签名
   *
   * @param {any} password 密码
   * @return {string} 签名
   * @memberof AdminService
   */
  signPassword(password) {
    return this.ctx.helper.md5(this.ctx.helper.md5(this.config.keys + password) + this.config.keys);
  }

  /**
   * 签名
   * @param {int} uid uid
   * @param {object} site site data
   * @param {object} extraData other data to return
   * @return {object} sign reuslt
   */
  signToken(uid, site = {}, extraData = {}) {
    const options = this.app.config.jwt;
    const jwtOption = {
      algorithm: options.alg,
      issuer: 'coca',
    };

    if (options.expires !== 0) {
      jwtOption.expiresIn = options.expires;
    }


    let cert = options.key;
    if (options.alg === 'RS512') {
      cert = fs.readFileSync(options.key);
    }

    const token = jwt.sign({
      r: Math.random(),
      uid,
      site,
    }, cert, jwtOption);

    const expire = options.expires;
    return { token, expire, ...extraData };
  }

  /**
   * 登录
   *
   * @param {any} account 账户邮箱
   * @param {any} password 密码
   * @return {object} 登录token信息
   * @memberof AdminService
   */
  async login(account, password) {
    const user = await this.app.mysql.get(this._table, { account });
    if (user === null) {
      this.error('用户不存在');
    }

    if (user.password !== this.signPassword(password)) {
      this.error('请检查账号/密码是否错误');
    }

    const site = await this.service.site.first(1);
    if (site === null) {
      this.error('站点不存在，请检查数据库');
    }


    return this.signToken(user.id, site, { site });
  }

  /**
   * 注册
   *
   * @param {any} account 账户邮箱
   * @param {any} password 密码
   * @param {any} nickname 名称
   * @return {object} 处理结果
   * @memberof AdminService
   */
  async register(account, password, nickname) {
    return await this.app.mysql.insert(this._table, {
      account,
      password: this.signPassword(password),
      nickname,
    });
  }


  /**
   * 修改密码
   *
   * @param {any} password 旧密码
   * @param {any} newPassword 新密码
   * @return {object} 处理结果
   * @memberof AdminService
   */
  async resetPassword(password, newPassword) {
    const user = await this.show(this.ctx.uid);

    if (this.signPassword(password) !== user.password) {
      this.error('密码错误');
    }

    return await this.app.mysql.update('admin', {
      id: Number(this.ctx.uid),
      password: this.signPassword(newPassword),
    });
  }
}

module.exports = AdminService;
