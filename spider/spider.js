var config = require('./../default.js');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("数据库成功开启");
});

var Log =require('./../Log');
var log =new Log();
var App = require('./class/App');

var config = {
    'async': 2,                 //并发量
    'tasksNumber': 25,         //任务数量
    'filter':{'bookmarket':0,'follow':0,'comment':0,'praise':0,'pageView':0}    //默认过滤
}

var app1 = new App(config);
//5481866
app1.createPixiverWorkTasks(5481846);
var app2 = new App(config);
//app2.createPixiverTasks(5481846);
