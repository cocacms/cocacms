'use strict';

module.exports = app => {

  // 注册自定义模板标签
  const tagMap = [ 'list', 'single', 'menu', 'category' ];
  console.log('====================================');
  console.log('Coca CMS: Loading Nunjucks Tag to App');
  console.log(`Tags: ${tagMap.join(', ')}`);
  console.log('====================================');
  for (const tag of tagMap) {
    const targetPath = `./app/tag/${tag}`;
    const tagInstance = require(targetPath);
    app.nunjucks.addExtension(`${tag}Extension`, new tagInstance());
  }

};
