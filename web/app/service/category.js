'use strict';

const Service = require('cocacms').BaseNode;

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

}

module.exports = CategoryService;
