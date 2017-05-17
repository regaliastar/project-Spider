var express = require('express'),
    Operator = require('./../lib/operator'),
    fs = require('fs'),
    Download = require('./../spider/class/Download'),
    path = require('path');

var router = express.Router();
var op_Pixiver = new Operator({schema:'Pixiver'});
var op_Work = new Operator({schema:'Work'});

router.get('/',function(req,res){
    /**
     * 当图片本地不存在时，后台下载图片
     */
    op_Pixiver.getFivePixiver(function(resultSet){
        var No =0;
        for(o in resultSet){
            var avator =resultSet[o].avator;
            No++;
            resultSet[o].No =No;
            resultSet[o].url ='http://www.pixiv.net/member.php?id='+resultSet[o].id;
            resultSet[o].avator =avator.substring(avator.lastIndexOf('/')+1);
            //使用闭包保护变量环境
            (function(avatorUrl,name){
                fs.exists('./public/images/'+name,function(exists){
                    if(!exists){
                        console.log(resultSet[o].avator+'不存在');
                        var download = new Download({path:'./public/images'});
                        download.load(avatorUrl);
                        download.exec();
                        download.on('close',function(){
                            console.log(name+'下载完成');
                        })
                    }
                });
            })(avator,resultSet[o].avator)

        }
        //console.log(resultSet);
        op_Work.getFiveWork(function(workSet){
            for(o in workSet){
                workSet[o].name =workSet[o].small_address.substring(workSet[o].small_address.lastIndexOf('/')+1);
                (function(name,small_address){
                    fs.exists('./public/images/'+name,function(exists){
                        if(!exists){
                            console.log(workSet[o].name+' bu cun zai');
                            var download = new Download({path:'./public/images'});
                            download.load(small_address);
                            download.exec();
                            download.on('close',function(){
                                console.log(name+'下载完成');
                            })
                        }
                    });
                })(workSet[o].name,workSet[o].small_address)

            }
            res.render('index',{
                pixiver:resultSet,
                work:workSet
            });
        })

    })

});

router.post('search/:keyword',function(req,res){
  console.log(keyword);
  res.end('success');
});

module.exports = router;
