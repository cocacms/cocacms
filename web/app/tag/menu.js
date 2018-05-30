'use strict';

const { asyncBuilder } = require('./util');
const nunjucks = require('egg-view-nunjucks/node_modules/nunjucks');

class ListExtension {
  constructor() {
    this.tags = [ 'menu' ];
    this.lineno = 0;
  }


  parse(parser, nodes) {
    const tok = parser.nextToken();
    this.lineno = tok.lineno + 1;

    const args = parser.parseSignature(null, true);

    parser.advanceAfterBlockEnd(tok.value);

    const body = parser.parseUntilBlocks('endmenu');

    parser.advanceAfterBlockEnd();

    return new nodes.CallExtensionAsync(this, 'run', args, [ body ]);
  }


  async run(context, args, body, callback) {
    callback = arguments[arguments.length - 1];

    if (arguments.length !== 4) {
      return callback(new Error(`menu标签_缺少参数 [行${this.lineno}]`), null);
    }

    const ctx = context.ctx.ctx;

    if (!Object.prototype.hasOwnProperty.call(args, 'id') || !args.id) {
      args.id = -1;
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'result') || !args.result) {
      args.result = 'result';
    }

    try {
      const ret = [];
      const result = await ctx.service.menu.index(args.id, args.buildTree, args.withMe);
      context.setVariable(args.result, result);
      ret.push(await asyncBuilder(body));
      const val = new nunjucks.runtime.SafeString(ret.join(''));
      return callback(null, val);
    } catch (error) {
      return callback(error);
    }

  }

}

module.exports = ListExtension;
