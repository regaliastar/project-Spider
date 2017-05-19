# project-Spider

<p align="left">
	<img alt="" src="https://img.shields.io/badge/JavaScript-ES6-green.svg" />
	<img alt="MIT" src="https://img.shields.io/npm/l/express.svg" />
</p>

<img src="public/img/pixiv-logo.png" width="50%">

* 爬取目标网站：[P站：pixiv.net](http://www.pixiv.net/)
* 本网站：[未开放](http://www.izetta.cn/)

***

## 特点
* 前端 bootstrape+JQuery+vue.js 重写
* 后端 nodejs+express+mongodb+request+cheerio 重写
* 伪造请求头，模拟用户登录，解决图片防盗链问题
* 提供搜索与下载功能！
* 推送最有人气的画师！
* 简约的UI设计

## 项目说明
* master分支：用于存放稳定版本
* dev分支：用于存放还在开发的版本

项目目录参考：
```text
project-Spider
	bin - 数据库文件
	logs - 记录日志
	public - 公共文件
		|
		css - CSS文件
		|
		img - 静态图片资源
		|
		js - JavaScript文件
	routes - 路由文件
	views - 视图文件
		|
		partials - 碎片管理文件
	spider - 爬虫系统文件
		|
		class - 存放类文件
	app.js - 主文件
```

## 功能及路由设计如下
1. 主页
	1. 主页：`GET /`
2. 搜索
	1. 搜索：`POST /search/:keyword=???`
3. 下载
	1. 下载：`POST /download`
	2. 预览: `GET /download`
4. 爬取
	1. 发送请求：`POST /preview`
	2. 预览：`GET /preview`
	3. 中断：`POST /preview/break`
	4. 中断页面：`GET /preview/break`
	5. 重试：`POST /preview/again`

> 路由设计采用`REST`风格

## 如何使用
1. 安装`nodejs` `mongodb`
2. 在根目录下 `npm install`,再 `node app`
3. 服务器于 `http://127.0.0.1:3000/` 监听

## Lincense
MIT

> If you have any problem, please contact 1183080130@qq.com (ﾉﾟ▽ﾟ)ﾉ
