'use strict';
var EventEmitter = require('events').EventEmitter;
/**
 * @author regaliastar
 *
 * 解析页面HTML元素
 * 所有方法均依赖`HTMLParser.fetch`
 */
class HTMLParser extends EventEmitter{
    /**
     * 构造函数
     */
    constructor(config){
        super();
        this.config = Object.assign(HTMLParser.defaultConfig(),config);
    };
}

HTMLParser.defaultConfig = function(){
    return{
        "async" :   3//默认异步数量
    }
}

/**
 * @param ID format: '1184799';
 * 以不伪装的形式访问作者信息，得到
 * 作品数，订阅数，评论数(bookmarket,follow,comment)，并传入回调函数
 *
 * @see HTMLParser.fetch
 * @callback callback(bookmarket,follow,comment)   cb2 - 异常处理
 */
HTMLParser.parsePixiver = function(ID,callback,cb2){
    var seed = 'http://www.pixiv.net/member.php?id='+ID;
    var avator,     //头像
        bookmarket, //作品数
        follow,     //订阅数
        comment;    //评论数
    var pixiver = require('./Pixiver');

    HTMLParser.fetch(seed,function($){
        var children_list = $('.count-container').children();
        avator = $('.usericon').children('img:first-child').attr('src') || '';
        bookmarket = parseInt(children_list.eq(0).children('a:first-child').text().trim()) || 0;
        follow = parseInt(children_list.eq(1).children('a:first-child').text().trim()) || 0;
        comment = parseInt(children_list.eq(2).children('a:first-child').text().trim()) || 0;
        var p = new pixiver(ID,avator,bookmarket,follow,comment);
        callback(p);
    },cb2)
}

/**
 * @param ID format: '1184799';
 * 将作者的所有(!important)作品的地址信息传递给回调函数，通过递归实现
 * @see Work
 * @param {Work} {MutilWork}    worksList
 * @callback worksUrls
 */
HTMLParser.pushPixiverWorks = function(ID,callback){
    var seed ='https://www.pixiv.net/member_illust.php?id='+ID;
    var worksUrls =[];

    var parseOnePage = function(header){
        HTMLParser.fetch(header,function($){
            /**
             * 将页面内的URL装入容器之中
             * 若没有作品，直接返回
             */

            $('._image-items').children().each(function(){
                worksUrls.push('http://www.pixiv.net'+$(this).children('a:first-child').attr('href'));
            });

            var NEXT =$('.next').first().children().attr('href');
            var NEXT_URL =seed.split('?')[0]+NEXT;
            if(NEXT){
                var h =require('./../requestHeader')(NEXT_URL);
                parseOnePage(h);
            }else {
                callback(worksUrls);
            }
        });
    }
    var header =require('./../requestHeader')(seed);
    parseOnePage(header);
}

/**
 * @param ID format: '1184799';
 * @see HTMLParser.pushPixiverWorks - 严重依赖关系
 * @see HTMLParser.parseWork - 严重依赖关系
 * @see HTMLParser.parseMutilWork - 严重依赖关系
 */
HTMLParser.prototype.parsePixiverWorks = function(ID){
    var async =require('async');
    var worksList =[];
    var _self =this;
    HTMLParser.pushPixiverWorks(ID,function(worksUrls){
        var tasksLength =worksUrls.length;
        _self.emit('once',tasksLength || 1);

        if((!worksUrls[0]) || worksUrls[0] == 'http://www.pixiv.netundefined'){
          console.log('send error in parsePixiverWorks');
           _self.emit('error','');
           return;
        }
        //console.log('worksUrls.length: '+worksUrls.length);
        //console.log('worksUrls: '+worksUrls[0]);
        var originLength =tasksLength;
        //console.log('origin length: '+tasksLength);
        async.mapLimit(worksUrls,_self.config.async,function(url,cb){
            HTMLParser.parseWork(url,function(w){
                //console.log(w);
                //worksList.push(w);
                tasksLength--;
                _self.emit('message',url+'解析完毕 '+'还剩'+tasksLength+' 总共'+originLength);
                _self.emit('success',w);
                if(tasksLength === 0)    _self.emit('close');
            },function(){
                tasksLength--;
                _self.emit('error',url);
                if(tasksLength === 0)    _self.emit('close');
            });
            HTMLParser.parseMutilWork(url,function(mw){
                //console.log(mw);
                //worksList.push(mw);
                tasksLength--;
                _self.emit('message',url+'解析完毕 '+'还剩'+tasksLength+' 总共'+originLength);
                _self.emit('success',mw);
                if(tasksLength === 0)    _self.emit('close');
            },function(){
                //tasksLength--;
                //if(tasksLength === 0)    _self.emit('close');
            });

            cb();
        },function(err,callback){
            if(err){
                console.log(err);
            }
            console.log(ID+' parsePixiverWorks fin');
        });
    });
}

/**
 * 解析最新的国际排行榜，并返回所有作品的信息
 */
HTMLParser.prototype.parseGlobalRank = function(callback){
    var seed ='http://www.pixiv.net/ranking_area.php?type=detail&no=6';
    var header =require('./../requestHeader')(seed);
    HTMLParser.fetch(header,function($){
        var worksUrls =[];
        $('.ranking-items').children().each(function(){
            worksUrls.push('http://www.pixiv.net/'+$(this).children().first().next().children().attr('href'));
        });
        callback(worksUrls);
    });
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
        pixiver,
        Log = require('./../../log');
    var log = new Log();
    try {
        Util['pixiver'] = $('.user-link').first().attr('href').split('=')[1];
        Util['pageView'] = parseInt($('.view-count').text()) || 0;
        Util['praise'] = parseInt($('.rated-count').text()) || 0;
        var tag_length = $('.tags').children().length;
    } catch (e) {
        log.error(e);
        return;
    }

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
HTMLParser.parseWork = function(url,callback,cb2){
    var header = require('./../requestHeader')(url);
    HTMLParser.fetch(header,function($){
        var workName,
            small_address,
            big_address;

        big_address = $('img[class=original-image]').attr('data-src');
        //判断该地址是Work还是MutilWork，若不符直接退出
        if(!big_address)    return;

        small_address = $('._layout-thumbnail').children().first().attr('src');
        var array = small_address.split('/');
        workName = array[array.length - 1];
        HTMLParser.initWork($,function(Util){
            var Work = require('./Work').Work;
            var w = new Work(workName,Util['tags'],Util['pageView'],Util['praise'],Util['pixiver'],small_address,big_address);
            callback(w);
        })
    },cb2)
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
HTMLParser.parseMutilWork = function(url,callback,cb2){
    var header = require('./../requestHeader')(url);
    HTMLParser.fetch(header,function($){
        var tags = [],
            box_address = [],
            next;

        var small_address = $('._layout-thumbnail').children('img').attr('src');    //小图地址
        var big_address = small_address;                                            //大图地址
        //判断该地址是Work还是MutilWork，若不符直接退出
        var testUrl =$('img[class=original-image]').attr('data-src');
        if(testUrl)    return;
        if(!small_address)  return;

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
    },cb2)
}

/**
 *
 */
HTMLParser.pushSearchWorks = function(keywords,callback){
    var seed = 'http://www.pixiv.net/search.php?s_mode=s_tag&word='+encodeURI(keywords);
    var workUrls =[];

    var parseOnePage = function(TAG,URL){
        var header = require('./../requestHeader')(URL);
        HTMLParser.fetch(header,function($){
            var no_item = $('._no-item').text();
            if(no_item === '未找到任何相关结果'){
                console.log('未找到任何相关结果，可尝试使用日文原名搜索');
                callback('');
                return;
            }else{
                $('._image-items').children().each(function(i,elem){
                    workUrls.push('http://www.pixiv.net'+$(this).children().first().attr('href'));
                });
            }

            var NEXT = $('.next').first().children().attr('href');
            if(NEXT){
                NEXT = NEXT.getQueryString(keywords);
                var nextUrl = URL.split('?')[0]+NEXT;
                //parseOnePage(TAG,nextUrl);
                setTimeout(function(){
                    parseOnePage(TAG,nextUrl);
                },200);

            }else {
                if(callback)    callback(workUrls);
            }
        })
    }

    parseOnePage(keywords,seed);
}

String.prototype.getQueryString = function(tag){
	if(!this)	return;
	return '?word='+encodeURI(tag)+this.substring(this.indexOf('&'));
}

HTMLParser.prototype.parseSearchWorks = function(keywords,filter){
    var _self =this;
    var async =require('async');

    HTMLParser.pushSearchWorks(keywords,function(worksUrls){
        var tasksLength =worksUrls.length || 0;
        _self.emit('once',tasksLength || 1);

        if((!worksUrls[0]) || worksUrls[0] == 'http://www.pixiv.netundefined' || (!tasksLength)){
            console.log('send error in parsePixiverWorks');
            _self.emit('error');
            return;
        }
        //console.log('worksUrls.length: '+worksUrls.length);
        //console.log('worksUrls: '+worksUrls[0]);
        var originLength =tasksLength;
        //console.log('origin length: '+tasksLength);
        try {
            async.mapLimit(worksUrls,_self.config.async,function(url,cb){
                HTMLParser.parseWork(url,function(w){
                    //console.log(w);
                    //worksList.push(w);
                    tasksLength--;
                    _self.emit('message',url+'解析完毕 '+'还剩'+tasksLength+' 总共'+originLength);
                    _self.emit('success',w);
                    if(tasksLength === 0)    _self.emit('close');
                },function(){
                    //throw new Error('error in fetch');
                    tasksLength--;
                    _self.emit('error',url);
                    if(tasksLength === 0)    _self.emit('close');
                });
                HTMLParser.parseMutilWork(url,function(mw){
                    //console.log(mw);
                    //worksList.push(mw);
                    tasksLength--;
                    _self.emit('message',url+'解析完毕 '+'还剩'+tasksLength+' 总共'+originLength);
                    _self.emit('success',mw);
                    if(tasksLength === 0)    _self.emit('close');
                },function(){
                    //throw new Error('error in fetch');
                    //tasksLength--;
                    //_self.emit('error');
                    //if(tasksLength === 0)    _self.emit('close');
                });

                cb();
            },function(err,callback){
                if(err){
                    console.log(err);
                }
                console.log('parsePixiverWorks fin');
                //_self.emit('error');
            });
        } catch (e) {
            console.log('catch in parsePixiverWorks');
            console.log(e);
            tasksLength--;
            _self.emit('error');
            if(tasksLength === 0)    _self.emit('close');
        }
    })

}

/**
 * 解析给定的作品数组，用于解析不成功的地址
 */
HTMLParser.prototype.parseGivenWorks = function(worksUrls){
    var _self =this;
    var async =require('async');
    var tasksLength =worksUrls.length || 0;
    
    _self.emit('once',tasksLength || 1);

    if((!worksUrls[0]) || worksUrls[0] == 'http://www.pixiv.netundefined' || (!tasksLength)){
        console.log('send error in parsePixiverWorks');
        _self.emit('error','');
        return;
    }
    //console.log('worksUrls.length: '+worksUrls.length);
    //console.log('worksUrls: '+worksUrls[0]);
    var originLength =tasksLength;
    //console.log('origin length: '+tasksLength);
    try {
        async.mapLimit(worksUrls,_self.config.async,function(url,cb){
            HTMLParser.parseWork(url,function(w){
                //console.log(w);
                //worksList.push(w);
                tasksLength--;
                _self.emit('message',url+'解析完毕 '+'还剩'+tasksLength+' 总共'+originLength);
                _self.emit('success',w);
                if(tasksLength === 0)    _self.emit('close');
            },function(){
                //throw new Error('error in fetch');
                tasksLength--;
                _self.emit('error',url);
                if(tasksLength === 0)    _self.emit('close');
            });
            HTMLParser.parseMutilWork(url,function(mw){
                //console.log(mw);
                //worksList.push(mw);
                tasksLength--;
                _self.emit('message',url+'解析完毕 '+'还剩'+tasksLength+' 总共'+originLength);
                _self.emit('success',mw);
                if(tasksLength === 0)    _self.emit('close');
            },function(){
                //throw new Error('error in fetch');
                //tasksLength--;
                //_self.emit('error');
                //if(tasksLength === 0)    _self.emit('close');
            });

            cb();
        },function(err,callback){
            if(err){
                console.log(err);
            }
            console.log('parsePixiverWorks fin');
            //_self.emit('error');
        });
    } catch (e) {
        console.log('catch in parsePixiverWorks');
        console.log(e);
        tasksLength--;
        _self.emit('error');
        if(tasksLength === 0)    _self.emit('close');
    }
}

/**
 * 设计模式：策略模式;根据不同的回调函数执行不同的方法,降低代码的耦合度
 *
 * 传入请求头,取得网页并将网页解析成支持JQuery选择器的$，并将待处理的数据传递给回调函数处理
 * @callback callback($)
 */
HTMLParser.fetch = function(header,callback,cb2){
    var request = require('request'),
	    cheerio = require('cheerio'),
	    Log = require('./../../log');
    var log = new Log();
    var _self =this;
	request(header,function(err,res){
		if(err){
            if(cb2){
                //cb2();
                console.log('fetch reqest error');
                console.log(err);
            }
			//console.log(err);
			log.error(err);
			return;
		}

		var $ = cheerio.load(res.body);
		callback($);
	}).on('error',function(){
		//监听error事件，当错误发生时代码可继续执行而不中断
        if(cb2){
            try {
                cb2();
            } catch (e) {
                console.log(e);
                console.log('catch in fetch');
                this.emit('error');
            } finally {

            }

        }
		log.error('error! request in fetch.js');
	})
}

module.exports = HTMLParser;
