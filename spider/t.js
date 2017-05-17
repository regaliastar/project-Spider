/*var HTMLParser = require('./class/HTMLParser');
var htmlParser = new HTMLParser();

htmlParser.parseSearchWorks('bdglabglsgbidf');

htmlParser.once('once',function(length){
    tasks =length;
    console.log('tasks: '+tasks);
});
htmlParser.on('message',function(msg){
    console.log(msg);
});
htmlParser.on('success',function(work){
    console.log('success');
    console.log(work);
});
htmlParser.on('error',function(){
    console.log('error');
});
htmlParser.on('close',function(){
    console.log('close');

});
*/

var config = require('./../default.js');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("数据库成功开启");
});

var Operator = require('./../lib/operator');
var Download = require('./class/Download');
var download = new Download({path:'./../public/images'});
var operator = new Operator({schema:'Pixiver'});
var op_Work = new Operator({schema:'Work'});
//download.load('https://i.pximg.net/img-original/img/2017/04/17/16/46/51/62450211_p0.jpg');
/*operator.getFivePixiver(function(resultSet){
    var avatorSet =[];
    for(o in resultSet){
        //console.log(resultSet[o].avator);
        avatorSet.push(resultSet[o].avator);
    }
    download.load(avatorSet);
    download.exec();
    download.on('message',function(msg){
        console.log(msg);
    })
    download.on('error',function(err){
        console.log(err);
    })
    download.on('close',function(completed,ready,err){
        db.close();
        console.log('完成：'+completed+' 等待：'+ready+' 错误：'+err);
    })
})*/
var fs = require('fs');

op_Work.getFiveWork(function(workSet){
    var avatorSet =[];
    for(o in workSet){
        //console.log(workSet[o].small_address);
        workSet.push(workSet[o].small_address);
        var name =workSet[o].small_address.substring(workSet[o].small_address.lastIndexOf('/')+1);
        fs.exists('./../public/images/'+name,function(exists){
            if(exists){
                console.log('cun zai');
            }else {
                console.log('bu cun zai');
            }
        });
        (function(n){
            console.log('name');
            console.log(n);
        })(workSet[o].small_address);
    }
    /*download.load(workSet);
    download.exec();
    download.on('message',function(msg){
        console.log(msg);
    })
    download.on('error',function(err){
        console.log(err);
    })
    download.on('close',function(completed,ready,err){
        db.close();
        console.log('完成：'+completed+' 等待：'+ready+' 错误：'+err);
    })*/

})
/*
download.load('https://i.pximg.net/img-original/img/2017/03/09/16/30/02/61821512_p0.png');
download.load('bsfjksf');
download.exec();
download.on('message',function(msg){
    console.log(msg);
})
download.on('error',function(err){
    console.log(err);
})
download.on('close',function(completed,ready,err){
    console.log('完成：'+completed+' 等待：'+ready+' 错误：'+err);
})*/
