'use strict';
var EventEmitter = require('events').EventEmitter;

/**
 * 该类用来执行具体的任务
 *
 * 主要是为了解决Manager无法解决的巨量任务的分配与调度问题
 */
class App extends EventEmitter{
    constructor(config){
        super();
        this.maxTasksLength =1000;  //能单次被async处理的最大任务长度
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
 * @param {number}  first   -从first作者ID开始爬取
 * @param {number}  DELIM   -将任务分成DELIM个小任务
 * @param {number}  POSTFIX -末尾的任务数量,如：若总任务为2100，则DELIM =3，postfix =100
 * @param {number}  COUNT   -记录当前任务是第几个任务
 */
App.prototype['createPixiverTasks'] = function(first){
     var _self =this;
     var DELIM =0;
     var POSTFIX =0;
     var COUNT =0;
     var FIRST =first;

     DELIM =Math.ceil(_self.config.tasksNumber/_self.maxTasksLength);
     POSTFIX =_self.config.tasksNumber-(DELIM-1)*_self.maxTasksLength;
     //console.log('DELIM: '+DELIM+' POSTFIX: '+POSTFIX);
     var tn = (DELIM === 1) ? POSTFIX: _self.maxTasksLength;
     var config =Object.assign(_self.config,{'tasksNumber':tn,'file':'PIXIVER-'+first+'-'+(first+_self.config.tasksNumber-1)});

     App.startPixiverTasks(FIRST,DELIM,POSTFIX,COUNT,config);
 }

/**
 * 注：此函数内无法使用 _self.maxTasksLength
 */
App.startPixiverTasks = function(first,DELIM,POSTFIX,COUNT,config){
    var Log = require('./../../Log');
    var log = new Log();
    var Manager =require('./Manager');
    var manager = new Manager(config);
    var _self =this;
    manager.createPixiverTasks(first);
    manager.once('close',function(){
        console.log('startPixiverTasks close, COUNT: '+COUNT);
        var ct = COUNT+1;
        if(ct === DELIM){
            console.log('startPixiverTasks 任务结束');
        }else {
            var ft =first+1000;
            var conf =((ct+1) === DELIM) ? Object.assign(config,{'tasksNumber':POSTFIX}): config;
            //console.log('ft: '+ft+'first: '+first+'_self.maxTasksLength '+_self.maxTasksLength+' conf: '+JSON.stringify(conf));
            App.startPixiverTasks(ft,DELIM,POSTFIX,ct,conf);
        }

    })
}

/**
 * 注：此函数内无法使用 _self.maxTasksLength
 */
App.prototype['createPixiverWorkTasks'] = function(first){
    var _self =this;
    var DELIM =0;
    var POSTFIX =0;
    var COUNT =0;
    var FIRST =first;

    DELIM =Math.ceil(_self.config.tasksNumber/_self.maxTasksLength);
    POSTFIX =_self.config.tasksNumber-(DELIM-1)*_self.maxTasksLength;
    //console.log('DELIM: '+DELIM+' POSTFIX: '+POSTFIX);
    var tn = (DELIM === 1) ? POSTFIX: _self.maxTasksLength;
    var config =Object.assign(_self.config,{'tasksNumber':tn,'file':'WORKS-'+first+'-'+(first+_self.config.tasksNumber-1)});

    App.startPixiverWorkTasks(FIRST,DELIM,POSTFIX,COUNT,config);
}

App.startPixiverWorkTasks = function(first,DELIM,POSTFIX,COUNT,config){
    var Log = require('./../../Log');
    var log = new Log();
    var Manager =require('./Manager');
    var manager = new Manager(config);
    var _self =this;
    var tasks =[];
    for(var i=first;i<first+config.tasksNumber;i++){
      tasks.push(''+i);
    }
    manager.createPixiverWorkTasks(tasks);
    manager.once('close',function(id){
        //console.log('get close'+' COUNT '+COUNT+'ft: '+(first+10));
        var ct = COUNT+1;
        if(ct === DELIM){
            console.log(id+' 任务结束');
        }else {
            var ft =first+1000;
            var conf =((ct+1) === DELIM) ? Object.assign(config,{'tasksNumber':POSTFIX}): config;
            App.startPixiverWorkTasks(ft,DELIM,POSTFIX,ct,conf);
        }

    })
}

module.exports = App;
