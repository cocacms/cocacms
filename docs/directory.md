# 目录结构

```javascript
├─cocacms // cocacms的Egg框架源码（会后续迁出）
│
├─docs // 文档
│
├─web // 前台&后台接口项目
│   │
│   ├─app // 源码目录
│   │   ├─controler // 控制器
│   │   │
│   │   ├─extend // 扩展
│   │   │
│   │   ├─hook // 钩子
│   │   │
│   │   ├─middleware // 中间件
│   │   │
│   │   ├─plugin // 插件
│   │   │
│   │   ├─public //  静态资源
│   │   │
│   │   ├─route //  路由
│   │   │   ├─custom //  用户定义的路由
│   │   │   │
│   │   │   └─default //  系统定义的路由
│   │   │
│   │   ├─service //  服务
│   │   │
│   │   ├─tag //  内置模板标签
│   │   │
│   │   └─theme //  主题模板
│   │
│   ├─manage_front // 后台前端项目
│   │   ├─mock // mock
│   │   │
│   │   └─src // 源码目录
│   │      ├─assets // 静态资源
│   │      │
│   │      ├─common // 全局配置
│   │      │   ├─config.js // 基础配置
│   │      │   │
│   │      │   ├─formCol.js // 表单网格配置
│   │      │   │
│   │      │   └─menu.js // 后台菜单配置
│   │      │
│   │      ├─components // 通用组件
│   │      │   ├─action // 表格删除/编辑操作组件
│   │      │   │
│   │      │   ├─can // 权限组件
│   │      │   │
│   │      │   ├─menu // 菜单组件
│   │      │   │
│   │      │   ├─richeditor // 富文本编辑器
│   │      │   │
│   │      │   ├─switch // 开关组件
│   │      │   │
│   │      │   ├─upload // 上传组件
│   │      │   │
│   │      │   ├─breadcrumb.js // 面包屑组件
│   │      │   │
│   │      │   ├─formItem.js // 表单生成器组件
│   │      │   │
│   │      │   └─name.js // 面包屑名称标记 注解
│   │      │
│   │      ├─layout // 布局文件
│   │      │
│   │      ├─models // 模型文件
│   │      │
│   │      ├─pages // 页面文件
│   │      │   ├─category // 栏目页面
│   │      │   │
│   │      │   ├─content // 内容管理页面
│   │      │   │
│   │      │   ├─form // 表单页面
│   │      │   │
│   │      │   ├─login // 登录页面
│   │      │   │
│   │      │   ├─manager // 管理员、角色与权限页面
│   │      │   │
│   │      │   ├─menu // 菜单导航页面
│   │      │   │
│   │      │   ├─model // 模型管理页面
│   │      │   │
│   │      │   ├─plugin // 插件管理页面
│   │      │   │
│   │      │   ├─setting // 系统设置页面
│   │      │   │
│   │      │   ├─document.ejs // html模板
│   │      │   │
│   │      │   ├─index.js // 首页
│   │      │   │
│   │      │   └─password.js // 重置密码页面
│   │      │
│   │      ├─services // 服务文件
│   │      │
│   │      ├─utils // 工具文件
│   │      │
│   │      ├─dva.js // DVA配置文件
│   │      │
│   │      └─global.css // 全局样式配置
│   │
│   └─config // 配置文件
│
├─manage_front // 前台&后台接口项目
│
├─YYYYMMDD.sql // 数据结构SQL文件
│
└─update_YYYYMMDD.sql // 数据结构更新SQL文件
```
