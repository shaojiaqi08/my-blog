## react hooks + koa + mysql

> 一个及其简洁的个人博客系统、即插即用，如果你想使用这个博客、动动手改改配置即可使用！！

- 前后台分离式开发
- 博客样式几乎借助于 `antd` 这个优秀的 UI 框架，主打简约风格，是笔者借鉴了 `antd` 官方的风格所设计。
- 具备了代码高亮、权限管理、登录、评论的个人博客...
- 具备文件导入功能，那么你可以直接通过导入 `md` 文件导入文章内容。

* 我的博客地址: http://47.114.46.245/
  

### 实现功能

- [x] 前台：主页 + 列表页 + 搜索页 + 分类页 + 标签页
- [x] 后台：文章管理 + 用户管理 + 分类管理
- [x] `markdown` 代码高亮
- [x] 用户评论与回复
- [x] `md` 文件导入功能！可以直接上传 `md` 文件生成文章内容到md编辑器中

### 技术栈

- 前端 （基于 `create-react-app eject` 后的配置）

  - react v16.9.0 `hooks` + `redux` + `react-router5`
  - `marked highlight.js`
  - `webpack` 打包优化
  - `fetch` 封装

- 后端 （自构建后台项目）
  - `eggjs`
  - `mysql`
  - `jwt` 



## 项目结构

### 目录结构

```js
.
│
├─config                // 构建配置
├─public                // html 入口
├─scripts               // 项目脚本
└─src                   // 前端项目源码
   ├─assets             // 静态文件
   ├─components         // 公用组件
   ├─layout             // 布局组件
   ├─redux              // redux 目录
   ├─routes             // 路由
   ├─styles             // 样式
   ├─utils              // 工具包
   ├─views              // 视图层
   ├─  App.jsx          // 后端主入口文件
   ├─  config.js        // 项目配置 github 个人主页、个人介绍等等
   ├─  index.js         // 主入口文件
   └─...

```

