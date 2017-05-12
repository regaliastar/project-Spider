'use strict';
var EventEmitter = require('events').EventEmitter;
/**
 * 管理者，与其他类是强耦合关系
 * 用于实现具体的功能，通过设置爬虫的生命周期来执行具体的任务
 */
class Manager extends EventEmitter{
    constructor(config){
        super();
        this.config = Object.assign(Manager.defaultConfig(),config);
    }
}

Manager.defaultConfig = function(){
    return{
        'async': 5,                 //并发量
        'tasksNumber': 1000,        //任务数量
        'filter':{'bookmarket':1,'follow':1,'comment':1,'praise':1,'pageView':1},   //默认过滤
        'file': 'myFile'            //写文件名
    }
}

/**
 * @param {number} first    -画师任务队列的起始ID
 */
Manager.prototype.createPixiverTasks = function(first){

    var HTMLParser = require('./HTMLParser'),
        Log = require('./../../Log'),
        Filter = require('./Filter'),
        async = require('async'),
        tasks =[],
        count =0,
        _self =this;

    var filter = new Filter(_self.config.filter);
    var log = new Log();
    //console.log('Manager: first:'+first+ ' config: '+JSON.stringify(_self.config));

    for(var i=first;i<first+_self.config.tasksNumber;i++){
        tasks.push(''+i);
    }
    console.log('length: '+tasks.length+'tasks[0]: '+tasks[0]);

    async.mapLimit(tasks,_self.config.async,function(id,callback){
        HTMLParser.parsePixiver(id,function(user){
            count++;
            console.log(count);
            var u = filter.filterPixiver(user);
            if(u.length !==0){
                //_self.emit('success',u);
                log.writeFile(_self.config.file,JSON.stringify(u));
            }
            if(count === tasks.length){
                _self.emit('close');
            }
        },function(){
            count++;
            console.log('err '+count);
            if(count === tasks.length){
                _self.emit('close');
            }
        });

        callback();
    },function(err,callback){
        if(err){
            console.log(err);
        }
        console.log('fin');
    });

}

/**
 * 利用count计数，当任务序列完成后唯一发送close信号
 */
Manager.prototype.createPixiverWorkTasks = function(Tasks){
    var HTMLParser = require('./HTMLParser'),
        Log = require('./../../Log'),
        Filter = require('./Filter'),
        async = require('async'),
        tasks =[],
        count =0,
        _self =this;

    var filter = new Filter(_self.config.filter);
    var log = new Log();
    tasks =Tasks;
    console.log('tasksLength: '+tasks.length);
    async.mapLimit(tasks,_self.config.async,function(id,callback){
        var htmlParser = new HTMLParser();

        htmlParser.parsePixiverWorks(id);
        htmlParser.on('message',function(msg){
            //_self.emit('message',msg);
            console.log(msg);
        });
        htmlParser.on('success',function(work){
            var w = filter.filter(work);
            if(w.length !== 0){
              var txt =JSON.stringify(work);
              log.writeFile(_self.config.file,txt);
            }
        });
        htmlParser.on('error',function(){
            count++;
            if(count === tasks.length){
                _self.emit('close',id);
            }
        });
        htmlParser.on('close',function(){
            count++;
            console.log('Manager get close signal  count: '+count);
            if(count === tasks.length){
                _self.emit('close',id);
            }
        })

        callback();
    },function(err,callback){
        if(err){
            console.log(err);
        }
        console.log('fin');
    });

}

module.exports = Manager;
