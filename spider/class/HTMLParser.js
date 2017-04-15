'use strict';
/**
 *created by regaliastar on 4/15
 *
 *解析页面HTML元素
 */
class HTMLParser{
    /**
     *该类禁止使用构造函数
     */
    constructor(){
        throw new Error('HTMLParser could not be a constructor');
    };
}

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
        bookmarket = children_list.eq(0).children('a:first-child').text().trim() || '0';
        follow = children_list.eq(1).children('a:first-child').text().trim() || '0';
        comment = children_list.eq(2).children('a:first-child').text().trim() || '0';
        callback(bookmarket,follow,comment);
    })
}

/**
 *url format:http://www.pixiv.net/member_illust.php?id=2482417
 *传入作品URL，得到作品的名字、浏览量、作者、标签、下载地址的信息（原图及缩率图），传给回调函数
 *
 *warning：只能处理单张图片，不能处理漫画
 */
HTMLParser.parseWork = function(url,callback){
    var header = require('./../requestHeader')(url);
    HTMLParser.fetch(header,function($){
        var workName,   //作品名
            tags = [],  //TAG
            pageView,   //浏览量
            praise,     //点赞数
            pixiver,    //作者
            small_address,  //小图地址
            big_address;    //大图地址

            pixiver = $('.user-link').first().attr('href').split('=')[1];
            big_address = $('img[class=original-image]').attr('data-src');
            small_address = $('._layout-thumbnail').children().first().attr('src');
            var array = small_address.split('/');
            workName = array[array.length - 1];
            pageView = $('.view-count').text();
            praise = $('.rated-count').text();
            var tag_length = $('.tags').children().length;
            $('.tags').children().each(function(){
                let tag = $(this).children('.text').text();
                tag_length --;
                if(tag){
                    tags.push(tag);
                }
                if(!tag_length){
                    var Work = require('./Work');
                    var w = new Work(workName,tags,pageView,praise,pixiver,small_address,big_address);
                    callback(w);
                }
            });

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
