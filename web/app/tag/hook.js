'use strict';

class HookExtension {
  constructor() {
    this.tags = [ 'hook' ];
    this.lineno = 0;
  }

  parse(parser, nodes) {
    const tok = parser.nextToken();
    this.lineno = tok.lineno + 1;
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);
    return new nodes.CallExtensionAsync(this, 'run', args);
  }


  async run(context, name, callback) {
    callback = arguments[arguments.length - 1];

    if (arguments.length !== 3) {
      return callback(new Error(`hook 标签_缺少参数 [行${this.lineno}]`), null);
    }

    const ctx = context.ctx.ctx;

    try {
      const ret = [];

      if (ctx.app.hooks[name] && typeof ctx.app.hooks[name] === 'function') {
        ret.push(await ctx.app.hooks[name](ctx));
      }

      if (ctx.app.pluginHook[name] && Array.isArray(ctx.app.pluginHook[name])) {
        for (const hookFun of ctx.app.pluginHook[name]) {
          if (typeof hookFun === 'function') {
            ret.push(await hookFun(ctx));
          }
        }
      }

      return callback(null, context.ctx.helper.shtml(ret.join('')));

    } catch (error) {
      return callback(error, null);

    }

  }

}

module.exports = HookExtension;
