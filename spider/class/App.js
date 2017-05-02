'use strict';
var EventEmitter = require('events').EventEmitter;

/**
 * 该类用来执行具体的任务
 */
class App extends EventEmitter{
    constructor(config){
        super();
        this.config = Object.assign(App.defaultConfig(),config);
    }
}

App.defaultConfig = function(){
    return{
        'async': 5,                 //并发量
        'tasksNumber': 1000,         //任务数量
        'filter':{'bookmarket':1,'follow':1,'comment':1,'praise':1,'pageView':1},    //默认过滤
        'file': 'myFile'            //写文件名
    }
}

/**
 * 分隔任务
 */
App.prototype.createPixiverTasks = function(first){
     var _self =this;
     var DELIM =0;
     var Log = require('./../../Log');
     var log = new Log();
     if(first > 1000){
         DELIM =Math.floor(first/1000);
     }

     var Manager =require('./Manager');
     var manager = new Manager(_self.config);
     manager.createPixiverTasks(first);
     manager.on('message',function(msg){
         console.log('msg: '+msg);
     });
     manager.on('success',function(user){
         var txt =JSON.stringify(user);
         log.writeFile('mmm',txt);
     });
     manager.on('close',function(){
         console.log('close!');
     })
 }

module.exports = App;
