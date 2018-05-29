'use strict';

const Application = require('./lib/framework');
const Agent = require('./lib/agent');
const egg = require('egg');

const BaseController = require('./app/controller/base');
const BaseService = require('./app/service/base');
const BaseNode = require('./app/service/node');

// clone egg API
Object.assign(exports, egg);

// override Application
exports.Application = Application;
exports.Agent = Agent;

exports.BaseController = BaseController;
exports.BaseService = BaseService;
exports.BaseNode = BaseNode;
