'use strict';

module.exports = () => {
  return async function front(ctx, next) {
    // 设置站点，语言
    let siteId = ctx.cookies.get('site');

    if (ctx.helper.hasOwnPro(ctx.query, '_site_')) {
      siteId = ctx.query._site_;
      ctx.cookies.set('site', siteId);
    }

    let site = null;
    if (siteId) {
      site = await ctx.app.mysql.get('site', { id: siteId });
    }

    if (site === null) {
      site = await ctx.app.mysql.get('site');
      ctx.cookies.set('site', site.id);
    }


    ctx.site = site;

    ctx.query = {
      ...ctx.request.query,
      locale: site.locale,
    };

    await next();
  };
};
