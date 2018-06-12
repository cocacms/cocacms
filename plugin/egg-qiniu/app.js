'use strict';
const Qiniu = require('./qiniu');

module.exports = app => {
  app.qiniu = new Qiniu(app.config.qiniu);
};

