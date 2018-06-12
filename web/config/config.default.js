'use strict';
const path = require('path');
// const fs = require('fs');

module.exports = appInfo => {
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + ''; // 密码加密用到

  // add your config here
  config.middleware = [];

  // 跨域
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };

  // redis配置
  // config.redis = {
  //   client: {
  //     port: 6379,
  //     host: 'localhost',
  //     password: '',
  //     db: 0,
  //   },
  // };

  // mysql数据库配置
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'root',
      // 数据库名
      database: 'cocacms',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };


  // 全局错误处理
  const loggerError = (err, ctx) => {
    const message = err.message;

    // 唯一插入报错处理
    if (message.indexOf('Duplicate entry') >= 0) {
      return '内容已存在，请勿重复插入';
    }

    // 表单验证错误
    if (err.status && err.status === 422) {
      if (err.errors && err.errors.errors && err.errors.errors.length > 0) {
        return err.errors.errors[0].message;
      }
    }

    if (!(err instanceof ctx.app.exception.runnerExection)) {
      ctx.logger.warn(err);
    }

    return message;
  };

  config.onerror = {
    html(err, ctx) {
      ctx.body = `<h3>${loggerError(err, ctx)}</h3>`;
      ctx.status = 500;
      if (err.status) {
        ctx.status = err.status;
      }
    },
    json(err, ctx) {
      ctx.body = { message: loggerError(err, ctx) };
      ctx.status = 500;
      if (err.status) {
        ctx.status = err.status;
      }
    },
  };

  // 安全配置
  config.security = {
    csrf: {
      ignore: [ '/api', '/test' ],
    },
  };

  // JWT配置
  config.jwt = {
    key: path.join(__dirname, './jwt/private.pem'), // 请自行生成
    publicKey: path.join(__dirname, './jwt/public.pem'), // 请自行生成
    expires: 0,
    alg: 'RS512',
  };

  // 权限验证配置
  config.auth = {
    public: [ // 无需权限验证可访问的路由
      'POST@/api/admin/login',
      'GET@/api/permission/my',
      'GET@/api/admin/:id',
      'GET@/api/site',
      'GET@/api/site/new',
      'GET@/api/form',
      'GET@/api/model',
      'GET@/api/modelAttr/:model',
      'GET@/api/modelAttr/:model/indexs',
      'GET@/public/(.*)',
    ],
  };

  // 多语言配置
  config.i18n = {
    // 默认语言，默认 "en_US"
    defaultLocale: 'zh-CN',
    // URL 参数，默认 "locale"
    queryField: 'locale',
    // Cookie 记录的 key, 默认："locale"
    cookieField: 'locale',
    // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
    cookieMaxAge: '1y',
  };

  // 主题模板配置

  config.view = {
    root: path.join(appInfo.baseDir, 'app/theme'),
    mapping: {
      '.nj': 'nunjucks',
    },
    defaultExtension: '.nj',
    cache: false,
  };

  // 模型前缀
  config.model = {
    prefix: 'auto_model_',
  };

  // 文件上传配置
  config.multipart = {
    whitelist: () => true,
  };

  return config;
};
