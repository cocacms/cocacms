'use strict';

const inflection = require('inflection');
const is = require('is-type-of');
const Router = require('@eggjs/router').EggRouter;

const REST_MAP = {
  index: {
    namePrefix: '?列表',
    suffix: '',
    method: 'GET',
  },
  new: {
    member: true,
    suffix: 'new',
    method: 'GET',
  },
  create: {
    namePrefix: '创建?',
    suffix: '',
    method: 'POST',
  },
  show: {
    namePrefix: '?详情',
    member: true,
    suffix: ':id',
    method: 'GET',
  },
  edit: {
    member: true,
    suffix: ':id/edit',
    method: 'GET',
  },
  update: {
    member: true,
    namePrefix: '编辑?',
    suffix: ':id',
    method: [ 'PATCH', 'PUT' ],
  },
  destroy: {
    member: true,
    namePrefix: '删除?',
    suffix: ':id',
    method: 'DELETE',
  },
};

/**
 * resolve controller from string to function
 * @param  {String|Function} controller input controller
 * @param  {Application} app egg application instance
 * @return {Function} controller function
 */
function resolveController(controller, app) {
  if (is.string(controller)) {
    const actions = controller.split('.');
    let obj = app.controller;
    actions.forEach(key => {
      obj = obj[key];
      if (!obj) throw new Error(`controller '${controller}' not exists`);
    });
    controller = obj;
  }
  // ensure controller is exists
  if (!controller) throw new Error('controller not exists');
  return controller;
}


/**
 * 1. split (name, url, ...middleware, controller) to
 * {
 *   prefix: [name, url]
 *   middlewares [...middleware, controller]
 * }
 *
 * 2. resolve controller from string to function
 *
 * @param  {Object} options inputs
 * @param {Object} options.args router params
 * @param {Object} options.app egg application instance
 * @return {Object} prefix and middlewares
 */
function spliteAndResolveRouterParams({ args, app }) {
  let prefix;
  let middlewares;
  if (args.length >= 3 && (is.string(args[1]) || is.regExp(args[1]))) {
    // app.get(name, url, [...middleware], controller)
    prefix = args.slice(0, 2);
    middlewares = args.slice(2);
  } else {
    // app.get(url, [...middleware], controller)
    prefix = args.slice(0, 1);
    middlewares = args.slice(1);
  }
  // resolve controller
  const controller = middlewares.pop();
  middlewares.push(resolveController(controller, app));
  return { prefix, middlewares };
}

Router.prototype.resources =  function(...args) {
  const splited = spliteAndResolveRouterParams({ args, app: this.app });
  const middlewares = splited.middlewares;
  // last argument is Controller object
  const controller = splited.middlewares.pop();

  let name = '';
  let prefix = '';
  if (splited.prefix.length === 2) {
    // router.get('users', '/users')
    name = splited.prefix[0];
    prefix = splited.prefix[1];
  } else {
    // router.get('/users')
    prefix = splited.prefix[0];
  }

  for (const key in REST_MAP) {
    const action = controller[key];
    if (!action) continue;

    const opts = REST_MAP[key];
    let formatedName;
    if (opts.member) {
      formatedName = inflection.singularize(name);
    } else {
      formatedName = inflection.pluralize(name);
    }
    if (opts.namePrefix) {
      formatedName = opts.namePrefix.replace('?', name);
    }
    prefix = prefix.replace(/\/$/, '');
    const path = opts.suffix ? `${prefix}/${opts.suffix}` : prefix;
    const method = Array.isArray(opts.method) ? opts.method : [ opts.method ];
    this.register(path, method, middlewares.concat(action), { name: formatedName });
  }

  return this;
}

module.exports = Router;
