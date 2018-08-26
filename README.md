# Coca CMS

基于 [egg.js](https://eggjs.org/)、[antd](https://ant.design/index-cn) 的内容管理框架。(Manage front inspired by [ant-design-pro](https://github.com/ant-design/ant-design-pro))

---

## 功能

* **角色权限**：通过角色划分权限，每个管理员可分配不同角色
* **多站点**：支持多站点管理，每个站点数据不同，可实现网站内容多语言
* **主题模板**：支持多主题切换，模板渲染引擎基于 ([nunjucks](http://mozilla.github.io/nunjucks/cn/templating.html))，扩展标签库，能够在模板内直接获取模型的数据
* **栏目导航**：支持无限分级的栏目/导航
* **动态内容管理**：直接在后台配置模型与表单，将栏目/表单绑定至模型，可动态得管理模型数据
* **插件扩展**：动态加载插件机制，可插件扩展，丰富CMS功能。→ 查看[插件列表](https://github.com/topics/cocacms-plugin)

## 使用文档
- [目录结构](./docs/directory.md)
- [内置标签](./docs/tag.md)

## 快速上手
* clone本项目
```
$ git clone https://github.com/rojer95/cocacms.git
```
* 安装依赖

```
$ cd cocacms/web
$ yarn install
```

* 修改配置
> 在`web/config/jwt`目录下生成RSA私钥与公钥
> 修改`web/config/config.default.js`的mysql配置

* 导入sql文件
* 分别启动服务端与后台前端项目
```
$ cd cocacms/web
$ yarn debug
```


* 开始使用
> 后台：`http://localhost:7001/admin`  
> 账户：`admin@admin.com`  
> 密码 `admin123456`  

## TODO
- [x] 扩展模板标签
- [ ] 广告模块
- [ ] 操作日志
- [ ] 数据库定时备份
- [ ] 优化后台-模型选项的操作
- [ ] 自定义表单导出功能
- [ ] 优化角色权限列表UI
- [ ] 插件机制
  - [x] 插件加载机制
  - [x] 插件安装卸载机制
  - [x] 插件hook
  - [ ] 插件hook模板渲染
- [ ] 完善hook机制
- [ ] 完善文档
  - [ ] 目录结构说明
  - [ ] 模板相关说明
    - [ ] 创建主题
    - [ ] 模板标签使用说明
    - [ ] 内置数据
    - [x] 扩展模板标签
    - [ ] 语言包
  - [ ] 插件开发文档

- [ ] 模板Demo

## 更新日志

本项目遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，更新日志由 `conventional-changelog` 自动生成。完整日志请点击 [CHANGELOG.md](./CHANGELOG.md)。