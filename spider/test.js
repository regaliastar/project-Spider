/**
 *用于测试spider部分函数
 */

/*var HTMLParser = require('./class/HTMLParser');
HTMLParser.parseMutilWork('http://www.pixiv.net/member_illust.php?mode=medium&illust_id=60909471',function(w){
    w.print();
})*/

/*
var Filter = require('./class/Filter');
var filter = new Filter({'praise':0,"praise_pro":0,"pageView":0,"has_tag_every":[],"has_tag_some":['2'],"no_tag_any":['1'],"no_tag_every":['1','10']});
var workList = [{'praise':10,"praise_pro":0,"pageView":100,"tags":['1','10'],"url":'www',"pixiver":'118'},
                {'praise':10,"praise_pro":0,"pageView":100,"tags":['1','2'],"url":'www',"pixiver":'118'},
                {'praise':20,"praise_pro":0,"pageView":200,"tags":['2'],"url":'www',"pixiver":'118'},
                {'praise':30,"praise_pro":0,"pageView":300,"tags":['3'],"url":'www',"pixiver":'118'}];
var resultSet = filter.filter(workList);
console.log('resultSet: '+JSON.stringify(resultSet));*/

/*
var Log = require('./../Log');
var log = new Log('555');
log.info('hhh','mmm');*/
/*
var Download = require('./class/Download');
var d = new Download({'async':5});
d.load('https://i.pximg.net/c/600x600/img-master/img/2016/12/30/01/17/14/60639674_p0_master1200.jpg');
d.load('https://i.pximg.net/c/600x600/img-master/img/2016/11/11/00/07/26/59888759_p0_master1200.jpg');
//d.load('https://i.pximg.net/img-original/img/2016/11/11/00/07/26/59888759_p0.jpg');
d.load('https://www.baidu.com/');

d.start();

d.on('error',function(url){
    console.log('下载失败：'+url);
});
d.on('message',function(msg){
console.log(msg);
})
d.on('close',function(completed,ready,error){
    console.log('所有资源下载完成');
    console.log('已完成：'+completed);
    console.log('还在等待：'+ready);
    console.log('发生错误：'+error);
})*/
/*
var H = require('./class/HTMLParser');
H.parsePixiver('1184799',function(user){
    user.print();
})*/
/*
var Filter = require('./class/Filter');
var filter = new Filter({'bookmarket':1,'follow':0,'comment':0});
var PList =[{'id':1,'bookmarket':10,'follow':10,'comment':10},
            {'id':2,'bookmarket':100,'follow':100,'comment':100},
            {'id':3,'bookmarket':0,'follow':0,'comment':0}];

var resultSet = filter.filterPixiver(PList);
console.log(JSON.stringify(resultSet));*/
/*
var Log =require('./../Log');
var log =new Log();
log.write('111');*/
/*
var HTMLParser = require('./class/HTMLParser');
var Filter = require('./class/Filter');
var Log = require('./../Log');
var log = new Log();
var async = require('async');
var tasks =[];
var count =0;
var filter = new Filter({'bookmarket':1,'follow':1,'comment':1});
for(var i=1000000;i<1001000;i++){
    tasks.push(''+i);
}
console.log('length: '+tasks.length);

async.mapLimit(tasks,2,function(id,callback){
    console.log('count: '+count);
    count++;
    HTMLParser.parsePixiver(id,function(user){
        var u = filter.filterPixiver(user);
        if(u.length !==0){
            log.write(JSON.stringify(user));
        }
    });
    callback();
},function(err,callback){
    if(err){
        console.log(err);
    }
    console.log('fin');
});*/

/*
var HTMLParser = require('./class/HTMLParser');
var parser =new HTMLParser();
var Log =require('./../Log');
var log =new Log();
parser.parsePixiverWorks('2482417');

parser.on('message',function(msg){
    console.log('msg: '+msg);
});

parser.on('close',function(worksList){
    for(var i in worksList){
        log.write(JSON.stringify(worksList[i]));
    }
})*/
/*
var HTMLParser = require('./class/HTMLParser');
var parser =new HTMLParser();
var Log =require('./../Log');
var log =new Log();
parser.parseGlobalRank(function(worksList){
    for(var i in worksList){
        log.write(JSON.stringify(worksList[i]));
    }
})*/
/*
var Log =require('./../Log');
var log =new Log();
var App = require('./class/App');
var config = {
    'async': 2,                 //并发量
    'tasksNumber': 2100,         //任务数量
    'filter':{'bookmarket':0,'follow':0,'comment':0,'praise':0,'pageView':0}    //默认过滤
}
var app = new App(config);
app.createPixiverTasks(2482417);*/

/*
var Log =require('./../Log');
var log =new Log();
var App = require('./class/App');
var mongoose = require('mongoose');
var mongo = require('mongo');
var config = {
    'async': 2,                 //并发量
    'tasksNumber': 25,         //任务数量
    'filter':{'bookmarket':0,'follow':0,'comment':0,'praise':0,'pageView':0}    //默认过滤
}
var app1 = new App(config);
//5481866
app1.createPixiverWorkTasks(5481846);
var app2 = new App(config);
app2.createPixiverTasks(5481846);
*/

var config = require('./../default.js');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("数据库成功开启");
});

var Pixiverclass = require('./class/Pixiver');
var Workclass = require('./class/Work').Work;
var MutilWorkclass = require('./class/Work').MutilWork;

var p = new Pixiverclass('11','touxiang','22','33','44');
var w = new Workclass('wn',['tag1','tag2'],'1111','55','11','s_a','b_a');
var w2 = new Workclass('w2',['tag1','tag2'],'1111','55','11','s_a','b_a')
var mw = new MutilWorkclass('wn',['tag1','tag2'],'1111','55','11','s_a','b_a',['a1','a2','a3']);

var Operator = require('./../lib/operator');
var op1 = new Operator({'schema':'Pixiver'});
var op2 = new Operator({'schema':'Work'});
//op1.save(p);
//op1.print({id:'11'});
//op2.save(w);
//op2.save(w2);
/*
setTimeout(function(){
    op2.find({small_address:'s_a'},function(items){
        console.log(JSON.stringify(items));
        db.close();
    });
},1000);*/
/*
op2.update({pageView:'1111'},{pixiver:'123',big_address:'b_b'},function(items){
    console.log(JSON.stringify(items));
    db.close();
})*/
op2.remove({workName:'w2'},function(items){
    console.log(JSON.stringify(items));
    db.close();
})