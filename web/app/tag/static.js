'use strict';
const url = require('url');

class StaticExtension {
  constructor() {
    this.tags = ['static'];
    this.lineno = 0;
  }

  parse(parser, nodes) {
    const tok = parser.nextToken();
    this.lineno = tok.lineno + 1;
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);
    return new nodes.CallExtensionAsync(this, 'run', args);
  }

  async run(context, path, callback) {
    callback = arguments[arguments.length - 1];

    if (arguments.length !== 3) {
      return callback(
        new Error(`static 标签_缺少参数 [行${this.lineno}]`),
        null
      );
    }

    const ctx = context.ctx.ctx;

    try {
      const ret = [];
      const theme = await ctx.service.theme.getActive();
      const basePath =
        ctx.helper.urlFor('web-detail', { key: 'static', id: theme.dirname }) +
        '/path';
      ret.push(url.resolve(basePath, path));
      return callback(null, context.ctx.helper.safe(ret.join('')));
    } catch (error) {
      return callback(error, null);
    }
  }
}

module.exports = StaticExtension;
