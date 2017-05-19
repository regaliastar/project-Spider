var express = require('express'),
    Operator = require('./../lib/operator'),
    fs = require('fs'),
    Download = require('./../spider/class/Download'),
    path = require('path');

var router = express.Router();
var op_Pixiver = new Operator({schema:'Pixiver'});
var op_Work = new Operator({schema:'Work'});

router.get('/more',function(req,res){
    console.log('pixiver/more');
    var No =0;
    var number =30;
    op_Pixiver.getPixiver(number,function(resultSet){
        for(o in resultSet){
            var avator =resultSet[o].avator;
            No++;
            resultSet[o].No =No;
            resultSet[o].url ='http://www.pixiv.net/member.php?id='+resultSet[o].id;
            resultSet[o].avator =avator.substring(avator.lastIndexOf('/')+1);
            //使用闭包保护变量环境
            (function(avatorUrl,name){
                fs.exists('./public/images/avator/'+name,function(exists){
                    if(!exists){
                        console.log(resultSet[o].avator+'不存在');
                        var download = new Download({path:'./public/images/avator'});
                        download.load(avatorUrl);
                        download.exec();
                        download.on('close',function(){
                            console.log(name+'下载完成');
                        })
                    }
                });
            })(avator,resultSet[o].avator)
        }
        res.render('more-pixiver',{
            pixiver:resultSet,
            number:number
        });
    });

})

module.exports = router;
