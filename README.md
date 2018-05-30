# Coca CMS

基于 [egg.js](https://eggjs.org/)、[antd](https://ant.design/index-cn) 的内容管理框架。(Manage front inspired by [ant-design-pro](https://github.com/ant-design/ant-design-pro))

---

## 功能

* **角色权限**：通过角色划分权限，每个管理员可分配不同角色
* **多站点**：支持多站点管理，每个站点数据不同，可实现网站内容多语言
* **主题模板**：支持多主题切换，模板渲染引擎基于 ([nunjucks](http://mozilla.github.io/nunjucks/cn/templating.html))，扩展标签库，能够在模板内直接获取模型的数据
* **栏目导航**：支持无限分级的栏目/导航
* **动态内容管理**：直接在后台配置模型与表单，将栏目/表单绑定至模型，可动态得管理模型数据

## 目录说明
> web - 服务端项目
> manage_front - 管理后台前端项目
> *.sql - 数据库导出文件


## 快速上手
* clone本项目
```
$ git clone https://github.com/rojer95/cocacms.git
```
* 安装依赖

```
$ cd cocacms/web
$ yarn install
$ cd ../manage_front
$ yarn install
```
* 链接依赖的CocoaCms子框架

```
$ cd cocacms/web/cocacms
$ yarn link
$ cd cocacms/web
$ yarn link cocacms
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

```
$ cd cocacms/manage_front
$ yarn start
```

* 开始使用
> 后台：`http://localhost:8000`  
> 账户：`admin@admin.com`  
> 密码 `admin123456`  

## TODO
- [ ] 扩展模板标签
- [ ] 完善文档
  - [ ] 目录结构说明
  - [ ] 模板相关说明
    - [ ] 创建主题
    - [ ] 模板标签使用说明
    - [ ] 内置数据
    - [ ] 扩展模板标签
    - [ ] 语言包
  - [ ] 待补充...
- [ ] 模板Demo