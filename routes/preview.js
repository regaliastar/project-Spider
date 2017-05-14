var express = require('express'),
    path = require('path'),
    Filter = require('./../spider/class/Filter'),
    HTMLParser = require('./../spider/class/HTMLParser');

var router = express.Router();


router.post('/',function(req,res){
    if(req.body.post && req.body.id){
        var data ={
            'tasks':''+0,
            'completed':''+0,
            'time':''+0
        }
        req.session.preview ={};
        req.session.save();
        console.log('req.body');
        var htmlParser = new HTMLParser();
        var pixiver = req.body.id;
        var tasks =0,completed =0,time =0,error =0;
        var items =[];

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
            console.log('success');
            completed++;
            items.push(work);
            req.session.preview.completed =completed;
            req.session.save();
        });
        htmlParser.on('error',function(){
            error++;
            if((error+completed) === tasks){
                req.session.preview.ok =true;
            }
            console.log('error: '+error+'tasks: '+tasks);
            req.session.preview.error =error;
            req.session.save();
        });
        htmlParser.on('close',function(){
            console.log('close');
            req.session.items =items;
            req.session.preview.ok =true;
            req.session.save();
        });

        res.send('ok');
    }else if (req.body.post && req.body.tag) {
        var data ={
            'tasks':''+0,
            'completed':''+0,
            'time':''+0
        }
        req.session.preview ={};
        req.session.save();
        console.log('req.body');
        var tasks =0,completed =0,time =0,error =0;
        var items =[];

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
            console.log('success');
            completed++;
            items.push(work);
            req.session.preview.completed =completed;
            req.session.save();
        });
        htmlParser.on('error',function(){
            req.session.preview.error =error;
            req.session.save();
        });
        htmlParser.on('close',function(){
            console.log('close');
            req.session.items =items;
            req.session.preview.ok =true;
            req.session.save();
        });

    }else {
        console.log('else');

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
          items:items,
          length:req.session.items.length
        });
    }else {
        next();
    }
})

module.exports = router;
