'use strict';

const Service = require('cocacms').BaseNode;

class MenuService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'menu';
  }

  /**
   * 默认数据
   *
   * @return {object} 数据
   * @memberof NodeService
   */
  getDefault() {
    return {
      name: '根节点',
      type: 1,
    };
  }

}

module.exports = MenuService;
