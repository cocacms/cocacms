'use strict';

const Application = require('./lib/framework');
const Agent = require('./lib/agent');
const Plugin = require('./lib/plugin');
const egg = require('egg');


// clone egg API
Object.assign(exports, egg);

// override Application
exports.Application = Application;
exports.Agent = Agent;
exports.Plugin = Plugin;

