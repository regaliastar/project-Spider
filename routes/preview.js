var express = require('express'),
    path = require('path'),
    Filter = require('./../spider/class/Filter'),
    fs = require('fs'),
    pinyin = require('./../middleware/pinyin'),
    Download = require('./../spider/class/Download'),
    HTMLParser = require('./../spider/class/HTMLParser');

var router = express.Router();


router.post('/',function(req,res){

    var filterCondition ={};
    filterCondition.praise =req.body.praise || 0;
    filterCondition.pageView =req.body.preview || 0;
    if(req.body.has_tag_every){
      var has_tag_every =req.body.has_tag_every.split(' ') || [];
    }else {
      var has_tag_every =[];
    }
    if(req.body.has_tag_some){
      var has_tag_some =req.body.has_tag_some.split(' ') || [];
    }else {
      var has_tag_some =[];
    }
    if(req.body.no_tag_any){
      var no_tag_any =req.body.no_tag_any.split(' ') || [];
    }else {
      var no_tag_any =[];
    }
    if(req.body.no_tag_every){
      var no_tag_every =req.body.no_tag_every.split(' ') || [];
    }else {
      var no_tag_every =[];
    }
    filterCondition.has_tag_every =has_tag_every;
    filterCondition.has_tag_some =has_tag_some;
    filterCondition.no_tag_every =no_tag_every;
    filterCondition.no_tag_any =no_tag_any;
    req.session.filterCondition =filterCondition;

    req.session.selectedSize = req.body.selectedSize;
    req.session.save();

    if(req.body.post && req.body.id){//搜画师
        req.session.preview ={};
        req.session.group =pinyin.getFullChars(req.body.id);
        req.session.save();
        console.log('enter id');
        console.log(req.body);
        var htmlParser = new HTMLParser();
        var pixiver = req.body.id;
        var tasks =0,completed =0,time =0,error =0;
        var items =[];
        var errList =[];

        var filter = new Filter(req.session.filterCondition);

        htmlParser.parsePixiverWorks(pixiver);
        htmlParser.once('once',function(length){
            tasks =length;
            req.session.preview.tasks =tasks;
            req.session.save();
        });
        htmlParser.on('message',function(msg){
            console.log(msg);
        });
        htmlParser.on('success',function(work){
            //console.log('success');
            var address = req.session.selectedSize == 'small'? work.small_address:work.big_address;
            var workname =address.substring(address.lastIndexOf('/')+1);
            (function(url,workname,tag){
                fs.exists('./public/images/download/'+tag+'/'+workname,function(exists){
                    if(!exists){
                        console.log('./public/images/download/'+tag+'/'+workname+'不存在');
                        var download = new Download({path:'./public/images/download/'+tag});
                        download.load(url);
                        download.exec();
                        download.on('close',function(){
                            console.log(workname+'下载完成');
                        });
                    }
                })
            })(address,workname,req.session.group);
            work.workName = workname;
            completed++;
            items.push(work);
            req.session.items =items;
            req.session.preview.completed =completed;
            req.session.save();
        });
        htmlParser.on('error',function(errUrl){
            error++;
            if((error+completed) === tasks){
                req.session.preview.ok =true;
            }
            console.log('error: '+error+'tasks: '+tasks);
            if(errUrl) errList.push(errUrl);
            req.session.errList =errList;
            req.session.error =error;
            req.session.save();
        });
        htmlParser.on('close',function(){
            console.log('close');
            items =filter.filter(items);
            req.session.items =items;
            req.session.preview.ok =true;
            req.session.save();
        });

        res.send('ok');
    }else if (req.body.post && req.body.tag) {//搜TAG

        req.session.preview ={};
        req.session.group =pinyin.getFullChars(req.body.tag);
        req.session.save();

        console.log('enter tag');
        console.log(req.body);
        var tasks =0,completed =0,time =0,error =0;
        var items =[];
        var errList =[];

        var filter = new Filter(req.session.filterCondition);

        var htmlParser = new HTMLParser();

        htmlParser.parseSearchWorks(req.body.tag);

        htmlParser.once('once',function(length){
            tasks =length;
            req.session.preview.tasks =tasks;
            req.session.save();
        });
        htmlParser.on('message',function(msg){
            console.log(msg);
        });
        htmlParser.on('success',function(work){
            //console.log('success');
            var address = req.session.selectedSize == 'small'? work.small_address:work.big_address;
            var workname =address.substring(address.lastIndexOf('/')+1);
            work.workName = workname;
            (function(url,workname,tag){
                fs.exists('./public/images/download/'+tag+'/'+workname,function(exists){
                    if(!exists){
                        console.log('./public/images/download/'+tag+'/'+workname+'不存在');
                        var download = new Download({path:'./public/images/download/'+tag});
                        download.load(url);
                        download.exec();
                        download.on('close',function(){
                            console.log(workname+'下载完成');
                        });
                    }
                })
            })(address,workname,req.session.group);
            completed++;
            items.push(work);
            req.session.items =items;
            req.session.preview.completed =completed;
            req.session.save();
        });
        htmlParser.on('error',function(errUrl){
            error++;
            if((error+completed) === tasks){
                req.session.preview.ok =true;
            }
            req.session.preview.error =error;
            if(errUrl) errList.push(errUrl);
            req.session.errList =errList;
            req.session.save();
        });
        htmlParser.once('close',function(){
            console.log('close');
            items =filter.filter(items);
            req.session.items =items;
            req.session.preview.ok =true;
            req.session.save();

        });

        res.send('ok');
    }else if (!req.body.id && !req.body.tag && req.body.post) {//表单未填写
        console.log(req.body);
        res.send({'ok':true,'no':true});
    }else {//发送近况
        //console.log('else');
        res.send(req.session.preview);
    }
});

router.get('/',function(req,res,next){
    if(req.session.items){
        var items =req.session.items;
        items.sort(function(a,b){
            return b.praise - a.praise;
        });
        res.render('download',{
            size:req.session.size || 'big',
            db:false,
            items:items,
            length:items.length
        });
        res.end();
    }else {
        next();
    }
});

router.post('/break',function(req,res,next){
    console.log('POST /preview/break');
    res.send('ok');
    /*req.session.destroy(function(err){
        if(err) console.log(err);
    });*/

});

router.get('/break',function(req,res,next){
    if(req.session.items){
        //console.log('errList: '+req.session.errList);
        var filter = new Filter(req.session.filterCondition);
        var items =req.session.items;
        items =filter.filter(items);
        items.sort(function(a,b){
            return b.praise - a.praise;
        });
        res.render('download',{
            size:req.session.size || 'big',
            db:false,
            items:items,
            length:items.length
        });

        res.end();
    }else {
        next();
    }
})

router.post('/again',function(req,res){

    if(req.body.post){
        try {
            console.log('POST /preview/again');
            //console.log('errList: '+req.session.errList);

            if(req.session.errList){
                console.log(1);
                var tasks =0,completed =0,time =0,error =0;
                var items =req.session.items;
                var errList =[];
                req.session.again ={};
                req.session.save();

                var htmlParser = new HTMLParser();

                htmlParser.parseGivenWorks(req.session.errList);

                htmlParser.on('once',function(length){
                    tasks =length;
                    req.session.again.tasks =tasks;
                    req.session.save();
                });
                htmlParser.on('message',function(msg){
                    console.log(msg);
                });
                htmlParser.on('success',function(work){
                    //console.log('success');
                    completed++;
                    items.push(work);

                    req.session.items =items;
                    req.session.again.completed =completed;
                    req.session.save();
                });
                htmlParser.on('error',function(errUrl){
                    error++;
                    if((error+completed) === tasks){
                        req.session.again.ok =true;
                    }
                    req.session.preview.error =error;
                    errList.push(errUrl);
                    req.session.again.errList =errList;
                    req.session.save();
                });
                htmlParser.once('close',function(){
                    console.log('close');
                    var filter = new Filter(req.session.filterCondition);
                    items =filter.filter(items);
                    req.session.items =items;
                    req.session.again.ok =true;
                    req.session.save();
                });
            }

            res.send('ok');
        } catch (e) {
            console.log(e);
        } finally {

        }

    }else {
        //console.log('else');
        res.send(req.session.again);
    }


});

module.exports = router;
