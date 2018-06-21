'use strict';
const path = require('path');

// Mysql数据库
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

// 表单验证
exports.asyncValidator = {
  enable: true,
  package: 'egg-async-validate',
};

// CROS验证
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

// 路由扩展
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};
