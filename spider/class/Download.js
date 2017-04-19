'use strict';
var Log = require('./../../Log');

/**
 * @author regaliastar
 *
 * 下载类，下载工具的提供者
 */
class Download{
    /**
     * 通过构造函数，可设置文件的下载路径等信息
     * @see Download.defaultConfig
     */
     constructor(config){
         /**
          * @param {string[]} tasks 进行中任务的集合
          * @param {Number} completed 已完成任务的数量
          * @param {Number} ready   等待的任务数量
          */
         this.tasks =[];
         this.ready =0;
         this.completed =0;
         this.config = Object.assign(Download.defaultConfig(),config);
     }

     /**
      * 打印信息，用于调试
      */
      print(){
         console.log('tasks: '+JSON.stringify(this.tasks));
      }
}

/**
 * 装载需要完成的任务
 */
Download.prototype['load'] = function(tasksList){
    if(Object.prototype.toString.call(tasksList) === '[object String]'){
        this.tasks.push(tasksList);
        this.ready++;
        return;
    }
    var args = Array.prototype.slice.call(tasksList);
    Array.prototype.push.apply(this.tasks,args);
    this.ready += args.length;
}

/**
 * 任务开始，执行this.tasks里的任务，将完成信息的传递给回调函数处理
 * @param this.tasks
 * @param this.config
 * @see Log
 */
Download.prototype['start'] = function(cb){
    var async = require('async'),
        request = require('request'),
        fs = require('fs');
    var log = new Log('Download');
    var _self = this;

    if(!fs.existsSync(_self.config.path+'/')){
        fs.mkdirSync(_self.config.path+'/');
    }

    async.mapLimit(_self.tasks,_self.config.async,function(url,callback){
        if(!url)    return;
        var header = Download.createHeader(url);
        var filename =url.substring(url.lastIndexOf('/')+1);

        request(header)
            .on('error',function(err){log.error(err);return;})
                .pipe(fs.createWriteStream(_self.config.path+'/'+filename))
                    .on('error',function(err){log.error(err);return;})
                        .on('close', function(){
                            console.log(filename+'下载完成');
                            _self.completed++;
                            _self.ready--;
                            cb(_self.completed,_self.ready);
                        });

        callback();
    },function(err,callback){
        if(err){
            log.error(err);
        }
    });
}

/**
 * 返回Download的默认配置参数
 */
Download.defaultConfig = function(){
    return{
        'path'  :'./download',//默认下载路径
        'async' :8            //，默认并发量
    }
}

/**
 * 创建请求头
 * @param Referer 解决P站防盗链
 *
 * 小图标格式：'https://i.pximg.net/c/150x150/img-master/img/2017/04/15/19/24/04/62417382_p0_master1200.jpg';
 * 中图格式：  'https://i.pximg.net/c/600x600/img-master/img/2017/04/15/19/24/04/62417382_p0_master1200.jpg';
 * 大图格式：  'https://i.pximg.net/img-original/img/2017/04/15/19/24/04/62417382_p0.jpg';
 */
Download.createHeader = function(url){
    var id= url.substring(url.lastIndexOf('/')+1,url.indexOf('_'));

    return{
        url: url,
        headers: {
            'Accept':'image/webp,image/*,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
            'Connection':'keep-alive',
            'Cookie':'p_ab_id=2; _ga=GA1.2.433897734.1451647016; device_token=6160f7e569c0860ae8a99c98f017c65d;              module_orders_mypage=%5B%7B%22name%22%3A%22everyone_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22spotlight%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22featured_tags%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22contests%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22following_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22mypixiv_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22booth_follow_items%22%2C%22visible%22%3Atrue%7D%5D;  __utma=235335808.433897734.1451647016.1457359994.1457700215.45; __utmc=235335808; __utmz=235335808.1457359994.44.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utmv=235335808.|2=login%20ever=yes=1^3=plan=normal=1^5=gender=male=1^6=user_id=16664186=1; PHPSESSID=16664186_e4ae9f7c7304939796760dd4c7ea7dc1',
            'Host':'i.pximg.net',
            'Referer':'http://www.pixiv.net/member_illust.php?mode=medium&illust_id='+id,
            'Upgrade-Insecure-Requests':1,
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
        }
    };
}

module.exports = Download;
