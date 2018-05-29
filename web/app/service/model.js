'use strict';

const Service = require('cocacms').BaseService;

class ModelService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'model';
  }

}

module.exports = ModelService;
