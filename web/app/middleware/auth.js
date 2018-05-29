'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');
const pathToRegexp = require('path-to-regexp');

module.exports = options => {
  return async function auth(ctx, next) {

    const authorization = ctx.get('Authorization');

    if (authorization) {
      const jwtOption = ctx.app.config.jwt;
      let cert = jwtOption.key;
      if (jwtOption.alg === 'RS512') {
        cert = fs.readFileSync(jwtOption.publicKey);
      }

      try {
        const decoded = jwt.verify(authorization, cert);
        ctx.uid = decoded.uid;
        ctx.site = decoded.site;
      } catch (err) {
        if (!err.status) {
          ctx.throw(401, '身份验证不通过');
          return;
        }
        throw err;
      }
    }


    let needCheck = true;
    for (const publicRoute of options.public) {
      const publicRouteData = publicRoute.split('@', 2);
      const re = pathToRegexp(publicRouteData[1]);
      const match = re.exec(ctx.path);
      if (match && ctx.method.toLowerCase() === publicRouteData[0].toLowerCase()) {
        needCheck = false;
        break;
      }

    }

    if (needCheck) {
      if (!ctx.uid) {
        this.throw(401, '请先登录');
      }

      // 验证权限
      const can = await ctx.service.permission.check(ctx.request.method, ctx.request.path, ctx.uid);

      if (!can) {
        ctx.throw(403, '没有这个操作的权限');
        return;
      }

    }


    await next();

  };
};
