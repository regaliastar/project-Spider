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
        'filter':{'bookmarket':1,'follow':1,'comment':1,'praise':1,'pageView':1}   //默认过滤

    }
}

/**
 * @param {number} first    -画师任务队列的起始ID
 */
Manager.prototype.createPixiverTasks = function(first){

    var HTMLParser = require('./HTMLParser'),
        Filter = require('./Filter'),
        async = require('async'),
        tasks =[],
        count =0,
        _self =this;

    var filter = new Filter(_self.config.filter);

    for(var i=first;i<first+_self.config.tasksNumber;i++){
        tasks.push(''+i);
    }
    console.log('length: '+tasks.length);

    async.mapLimit(tasks,_self.config.async,function(id,callback){

        HTMLParser.parsePixiver(id,function(user){
            count++;
            _self.emit('message','已完成 '+count);
            var u = filter.filterPixiver(user);
            if(u.length !==0){
                _self.emit('success',u);
                //log.writeFile(''+first+'-'+first+_self.config.tasksNumber,JSON.stringify(u));
            }
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

module.exports = Manager;
