'use strict';

const Service = require('./base');

class FormService extends Service {
  constructor(ctx) {
    super(ctx);
    this._table = 'form';
  }
}

module.exports = FormService;
