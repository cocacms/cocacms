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
    let pagerBody = null;

    const body = parser.parseUntilBlocks('endlist', 'pager', 'nodata');
    if (parser.skipSymbol('nodata')) {
      parser.advanceAfterBlockEnd('nodata');
      nodataBody = parser.parseUntilBlocks('endlist', 'pager');
    }

    if (parser.skipSymbol('pager')) {
      parser.advanceAfterBlockEnd('pager');
      pagerBody = parser.parseUntilBlocks('endlist');
    }

    parser.advanceAfterBlockEnd();

    return new nodes.CallExtensionAsync(this, 'run', args, [ body, nodataBody, pagerBody ]);
  }


  async run(context, args, body, nodataBody, pagerBody, callback) {
    callback = arguments[arguments.length - 1];

    if (arguments.length !== 6) {
      return callback(new Error(`list标签_缺少参数 [行${this.lineno}]`), null);
    }

    const ctx = context.ctx.ctx;

    if (!Object.prototype.hasOwnProperty.call(args, 'name') || !args.name) {
      return callback(new Error(`list标签_缺少name参数 [行${this.lineno}]`), null);
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'item') || !args.item) {
      args.item = 'item';
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'pager') || !args.pager) {
      args.pager = '_pager';
    }

    try {
      ctx.service.base._table = `${args.model ? ctx.app.config.model.prefix : ''}${args.name}`;
      const result = await ctx.service.base.index(args.page, args.pageSize, args.where, args.fields, args.order);
      const ret = [];

      for (let index = 0; index < result.data.length; index++) {
        const item = result.data[index];
        context.setVariable(args.item, item);
        const loop = {
          index: index + 1,
          index0: index,
          revindex: result.data.length - index,
          revindex0: result.data.length - index - 1,
          first: index === 0,
          last: index === result.data.length - 1,
          length: result.data.length,
        };
        context.setVariable('loop', loop);
        ret.push(await asyncBuilder(body));
      }

      if (result.data.length === 0 && nodataBody) {
        ret.push(await asyncBuilder(nodataBody));
      }

      if (pagerBody) {
        context.setVariable(args.pager, result);
        ret.push(await asyncBuilder(pagerBody));
      }

      const val = new nunjucks.runtime.SafeString(ret.join(''));
      return callback(null, val);
    } catch (error) {
      return callback(error);
    }

  }

}

module.exports = ListExtension;
