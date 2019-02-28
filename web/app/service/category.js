'use strict';

const Service = require('./node');

class CategoryService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'category';
  }

  /**
   * 默认数据
   *
   * @return {object} 数据
   * @memberof NodeService
   */
  getDefault() {
    return {
      key: '__root__',
      name: '根节点',
      type: 1,
    };
  }

  /**
   * 根据key获取节点树
   * @param {string} key 父key
   * @param {boolean} buildTree 构建树
   * @param {boolean} withMe 带上自己节点
   *
   * @return {array} 树
   */
  async key(key = false, buildTree = true, withMe = false) {
    let pid = -1;
    if (key) {
      const target = await this.app.mysql.get(this._table, { key });
      if (target) {
        pid = target.id;
      }
    }
    return await this.index(pid, buildTree, withMe);
  }

  /**
   * 获取节点树
   * @param {int} pid pid
   * @param {any} where 条件
   * @param {boolean} buildTree 构建树
   * @param {boolean} withMe 带上自己节点
   *
   * @return {array} 树
   */
  async index(pid = -1, where = [], buildTree = true, withMe = false) {
    let result = await super.index(pid, where, false, withMe);
    result = await this.service.category.one2one(
      result,
      'model',
      'model_id',
      'id'
    );

    result = await this.service.category.one2one(
      result,
      'form',
      'form_id',
      'id',
      'form'
    );

    if (buildTree) {
      result = this.toTree(result);
    }

    return result;
  }
}

module.exports = CategoryService;
