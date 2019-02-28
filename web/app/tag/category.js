'use strict';

const { asyncBuilder } = require('./util');

class CategoryExtension {
  constructor() {
    this.tags = ['category'];
    this.lineno = 0;
  }

  parse(parser, nodes) {
    const tok = parser.nextToken();
    this.lineno = tok.lineno + 1;

    const args = parser.parseSignature(null, true);

    parser.advanceAfterBlockEnd(tok.value);

    const body = parser.parseUntilBlocks('endcategory');

    parser.advanceAfterBlockEnd();

    return new nodes.CallExtensionAsync(this, 'run', args, [body]);
  }

  async run(context, args, body, callback) {
    callback = arguments[arguments.length - 1];

    if (arguments.length !== 4) {
      return callback(
        new Error(`category标签_缺少参数 [行${this.lineno}]`),
        null
      );
    }

    const ctx = context.ctx.ctx;

    if (!Object.prototype.hasOwnProperty.call(args, 'key') || !args.key) {
      args.key = false;
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'id') || !args.id) {
      args.id = false;
    }

    if (!Object.prototype.hasOwnProperty.call(args, '_res') || !args._res) {
      args._res = '_res';
    }

    if (!args.key && !args.id) {
      return callback(
        new Error(`category标签_key与id中至少有一个 [行${this.lineno}]`),
        null
      );
    }

    try {
      const ret = [];
      let result = [];
      if (args.id) {
        result = await ctx.service.category.index(
          args.id,
          [],
          false,
          args.withMe
        );
      } else if (args.key) {
        result = await ctx.service.category.key(args.key, false, args.withMe);
      }

      for (const category of result) {
        // 栏目类型：1列表页 2单页 3表单页 4调整链接
        if (category.type !== 4) {
          category.jump = ctx.helper.urlFor('web-category', {
            key: category.key,
          });
        } else {
          category.jump = category.url;
        }
        try {
          category.pic = JSON.parse(category.pic);
        } catch (error) {
          category.pic = null;
        }
        if (!category.pic) {
          category.pic = [];
        }
      }

      if (args.buildTree === true) {
        result = ctx.service.category.toTree(result);
      }

      context.setVariable(args._res, result);
      ret.push(await asyncBuilder(body));
      return callback(null, context.ctx.helper.safe(ret.join('')));
    } catch (error) {
      return callback(error);
    }
  }
}

module.exports = CategoryExtension;
