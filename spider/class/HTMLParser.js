'use strict';
/**
 * @author regaliastar
 *
 * 解析页面HTML元素
 */
class HTMLParser{
    /**
     * 该类禁止使用构造函数
     */
    constructor(){
        throw new Error('HTMLParser could not be a constructor');
    };
}

/**
 * @param ID format: '1184799';
 * 以不伪装的形式访问作者信息，得到
 * 作品数，订阅数，评论数(bookmarket,follow,comment)，并传入回调函数
 *
 * @see HTMLParser.fetch
 * @callback callback(bookmarket,follow,comment)
 */
HTMLParser.parsePixiver = function(ID,callback){
    var seed = 'http://www.pixiv.net/member.php?id='+ID;
    var avator,     //头像
        bookmarket, //作品数
        follow,     //订阅数
        comment;    //评论数
    var pixiver = require('./Pixiver');

    HTMLParser.fetch(seed,function($){
        var children_list = $('.count-container').children();
        avator = $('.usericon').children('img:first-child').attr('src');
        bookmarket = children_list.eq(0).children('a:first-child').text().trim() || '0';
        follow = children_list.eq(1).children('a:first-child').text().trim() || '0';
        comment = children_list.eq(2).children('a:first-child').text().trim() || '0';
        var p = new pixiver(ID,avator,bookmarket,follow,comment);
        callback(p);
    })
}

/**
 * @param ID format: '1184799';
 * 将作者的作品信息传递给回调函数
 * @see Work
 * @param {Work} {MutilWork}    worksList
 * @callback worksList
 */
HTMLParser.parsePixiverWorks = function(ID,callback){
    var seed ='https://www.pixiv.net/member_illust.php?id='+ID;
    var worksList =[];
    var worksUrls =[];
    var header =require('./../requestHeader')(seed);
    var parseOnePage = function(){
        HTMLParser.fetch(header,function($){
            /**
             * 将页面内的URL装入容器之中
             */
            $('._image-items').children().each(function(){
                worksUrls.push('http://www.pixiv.net'+$(this).children('a:first-child').attr('href'));
            });
            var NEXT =$('.next').first().children().attr('href');
            var NEXT_URL =seed.split('?')[0]+NEXT;
            if(NEXT){
                parseOnePage();
            }else {
                callback(worksUrls);
            }
            //console.log(worksUrls.join(','));
            return true;
        });
    }


}

/**
 * 用来初始化一些parseWork与parseMutilWork都需要用到的变量
 *
 * @see HTMLParser.parseWork
 * @see HTMLParser.parseMutilWork
 * @param {} Util
 * @param {string[]} tags       TAG
 * @param {string}  pageView    浏览量
 * @param {string}  praise      点赞数
 * @param {string}  pixiver     作者
 * @callback        callback(Util)
 */
HTMLParser.initWork = function($,callback){
    var Util = {},
        tags = [],
        pageView,
        praise,
        pixiver;

    Util['pixiver'] = $('.user-link').first().attr('href').split('=')[1];
    Util['pageView'] = $('.view-count').text() || '0';
    Util['praise'] = $('.rated-count').text() || '0';
    var tag_length = $('.tags').children().length;
    $('.tags').children().each(function(){
        let tag = $(this).children('.text').text();
        tag_length --;
        if(tag){
            tags.push(tag);
        }
        if(!tag_length){
            Util['tags'] = tags;
            callback(Util);
        }
    });
}

/**
 * @param url format:http://www.pixiv.net/member_illust.php?id=2482417
 * 传入作品URL，得到作品的名字、浏览量、作者、标签、下载地址的信息（原图及缩率图），传给回调函数
 *
 * warning：只能处理单张图片，不能处理漫画
 * @see HTMLParser.fetch
 * @see HTMLParser.initWork
 * @see require('./../requestHeader')(url);
 * @param {string}  workName        作品名
 * @param {string}  small_address   小图地址
 * @param {string}  big_address     大图地址
 * @callback     {Work}   callback(w)
 */
HTMLParser.parseWork = function(url,callback){
    var header = require('./../requestHeader')(url);
    HTMLParser.fetch(header,function($){
        var workName,
            small_address,
            big_address;

        big_address = $('img[class=original-image]').attr('data-src');
        small_address = $('._layout-thumbnail').children().first().attr('src');
        var array = small_address.split('/');
        workName = array[array.length - 1];
        HTMLParser.initWork($,function(Util){
            var Work = require('./Work').Work;
            var w = new Work(workName,Util['tags'],Util['pageView'],Util['praise'],Util['pixiver'],small_address,big_address);
            callback(w);
        })
    })
}

/**
 * @param url format:http://www.pixiv.net/member_illust.php?mode=medium&illust_id=60909471
 *
 * 用来处理parseWork无法处理的漫画
 * @see HTMLParser.fetch
 * @see HTMLParser.initWork
 * @see require('./../requestHeader')(url);
 * @param {string}  workName        作品名
 * @param {string}  small_address   小图地址
 * @param {string}  big_address     大图地址
 * @param {string[]} box_address    数组变量，用于存放每一张漫画的地址
 * @param {string}  next            存放所有画的页面的URL
 * @callback   {MutilWork}     callback(mw);
 */
HTMLParser.parseMutilWork = function(url,callback){
    var header = require('./../requestHeader')(url);
    HTMLParser.fetch(header,function($){
        var tags = [],
            box_address = [],
            next;

        var small_address = $('._layout-thumbnail').children('img').attr('src');    //小图地址
        var big_address = small_address;                                            //大图地址
        var array = small_address.split('/');
        var workName = array[array.length - 1];
        next = 'http://www.pixiv.net/'+$('._work.multiple').first().attr('href');

        HTMLParser.initWork($,function(Util){
            header = require('./../requestHeader')(next);
            HTMLParser.fetch(header,function($){
                var item_length = $('.item-container').length;
                $('.item-container').each(function(i,item){
                    box_address.push($(this).children('.image').attr('data-src'));
                    item_length--;
                    if(!item_length){
                        var MutilWork = require('./Work').MutilWork;
                        var mw = new MutilWork(workName,Util['tags'],Util['pageView'],Util['praise'],Util['pixiver'],small_address,big_address,box_address);
                        callback(mw);
                    }
                });
            })
        })
    })
}

/**
 *
 */
HTMLParser.parseSearch = function(url,filter,callback){

}

/**
 * 设计模式：策略模式;根据不同的回调函数执行不同的方法,降低代码的耦合度
 *
 * 传入请求头,取得网页并将网页解析成支持JQuery选择器的$，并将待处理的数据传递给回调函数处理
 * @callback callback($)
 */
HTMLParser.fetch = function(header,callback){
    var request = require('request'),
	    cheerio = require('cheerio'),
	    Log = require('./../../log');
    var log = new Log();

	request(header,function(err,res){
		if(err){
			console.log(err);
			log.error(err);
			return;
		}

		var $ = cheerio.load(res.body);
		callback($);
	}).on('error',function(){
		//监听error事件，当错误发生时代码可继续执行而不中断
		log.error('error! request in fetch.js');
	})
}

module.exports = HTMLParser;
