'use strict';

const { asyncBuilder } = require('./util');
const nunjucks = require('egg-view-nunjucks/node_modules/nunjucks');

class ListExtension {
  constructor() {
    this.tags = [ 'list' ];
    this.lineno = 0;
  }


  parse(parser, nodes) {
    const tok = parser.nextToken();
    this.lineno = tok.lineno + 1;

    const args = parser.parseSignature(null, true);

    parser.advanceAfterBlockEnd(tok.value);
    let nodataBody = null;

    const body = parser.parseUntilBlocks('endlist', 'nodata');
    if (parser.skipSymbol('nodata')) {
      parser.advanceAfterBlockEnd('nodata');
      nodataBody = parser.parseUntilBlocks('endlist');
    }

    parser.advanceAfterBlockEnd();

    return new nodes.CallExtensionAsync(this, 'run', args, [ body, nodataBody ]);
  }


  async run(context, args, body, nodataBody, callback) {
    callback = arguments[arguments.length - 1];

    if (arguments.length !== 5) {
      return callback(new Error(`list标签_缺少参数 [行${this.lineno}]`), null);
    }

    const ctx = context.ctx.ctx;

    if (!Object.prototype.hasOwnProperty.call(args, 'name') || !args.name) {
      return callback(new Error(`list标签_缺少name参数 [行${this.lineno}]`), null);
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'item') || !args.item) {
      args.item = 'item';
    }

    if (!Object.prototype.hasOwnProperty.call(args, '_pager') || !args._pager) {
      args._pager = '_pager';
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'withPage')) {
      args.withPage = true;
    }

    try {
      ctx.service.base._table = `${args.model ? ctx.app.config.model.prefix : ''}${args.name}`;
      const result = await ctx.service.base.index(args.page, args.pageSize, args.where, args.fields, args.order, args.withPage);
      const ret = [];
      const datas = args.withPage === true ? result.data : result;
      for (let index = 0; index < datas.length; index++) {
        const item = datas[index];
        context.setVariable(args.item, item);
        const loop = {
          index: index + 1,
          index0: index,
          revindex: datas.length - index,
          revindex0: datas.length - index - 1,
          first: index === 0,
          last: index === datas.length - 1,
          length: datas.length,
        };
        context.setVariable('loop', loop);
        ret.push(await asyncBuilder(body));
      }

      if (datas.length === 0 && nodataBody) {
        ret.push(await asyncBuilder(nodataBody));
      }

      if (args.withPage === true) {
        context.env.addGlobal(args._pager, result);
      }

      const val = new nunjucks.runtime.SafeString(ret.join(''));
      return callback(null, val);
    } catch (error) {
      return callback(error);
    }

  }

}

module.exports = ListExtension;
