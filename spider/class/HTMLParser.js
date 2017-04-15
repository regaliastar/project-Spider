'user strict';

class HTMLParser{
    /**
     *该类不能使用构造函数
     */
    constructor(){
        throw new Error('HTMLParser could not be a constructor');
    };
}


/**
 *created by regaliastar on 4/15
 *
 *解析页面HTML元素
 */

/**
 *ID format: '1184799';
 *以不伪装的形式访问作者信息，得到
 *作品数，订阅数，评论数(bookmarket,follow,comment)，并传入回调函数
 */
HTMLParser.parsePixiver = function(ID,callback){
    var seed = 'http://www.pixiv.net/member.php?id='+ID;
    var bookmarket, //作品数
        follow,     //订阅数
        comment;    //评论数

    HTMLParser.fetch(seed,function($){
        var children_list = $('.count-container').children();
        bookmarket = children_list.eq(0).children('a:first-child').text() || 0;
        follow = children_list.eq(1).children('a:first-child').text() || 0;
        comment = children_list.eq(2).children('a:first-child').text() || 0;
        callback(bookmarket,follow,comment);
    })
}

/**
 *设计模式：策略模式;根据不同的回调函数执行不同的方法,降低代码的耦合度
 *
 *传入请求头,取得网页并将网页解析成支持JQuery选择器的$，并将待处理的数据传递给回调函数处理
 */
HTMLParser.fetch = function(header,callback){
    var request = require('request'),
	    cheerio = require('cheerio'),
	    log = require('./../../log');

	request(header,function(err,res){
		if(err){
			console.log(err);
			log(err);
			return;
		}

		var $ = cheerio.load(res.body);
		callback($);
	}).on('error',function(){
		//监听error事件，当错误发生时代码可继续执行而不中断
		log('error! request in fetch.js');
	})
}

module.exports = HTMLParser;
