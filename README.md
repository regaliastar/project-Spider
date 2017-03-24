# project-Spider

<img src="public/img/pixiv-logo.png" width="50%">

* 爬取目标网站：http://www.pixiv.net/
* 本网站：http://www.izetta.cn/ (未开放)

***

## 特点
* 前端 bootstrape+JQuery 重写
* 后端 nodejs+express+mongodb+request+cheerio 重写
* 伪造请求头，模拟用户登录，解决图片防盗链问题
* 提供搜索与下载功能！
* 推送最有人气的画师！
* 简约的UI设计

## 功能及路由设计如下
1. 主页
	1. 主页：`GET /`
2. 搜索
	1. 搜索：`POST /search/:keyword=???`
	2. 搜索结果:`GET /search/results`
3. 下载
	1. 下载：`POST /download`

> 路由设计采用`REST`风格

## Lincense
MIT

> If you have any problem, please contact 1183080130@qq.com (ﾉﾟ▽ﾟ)ﾉ