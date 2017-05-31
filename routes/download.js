var express = require('express'),
    path = require('path'),
    Operator = require('./../lib/operator'),
    GetModel = require('./../lib/mongo'),
    fs = require('fs'),
    Filter =require('./../spider/class/filter');

var BOOK = GetModel('Work');

var router = express.Router();

router.post('/',function(req,res){
    console.log('POST /download');
    //console.log(req.body);
    var praise =''+req.body.praise || '0';
    var pageView =''+req.body.pageView || '0';
    var pixiver =''+req.body.id || 0;
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

    var filterCondition ={
      "has_tag_every":has_tag_every,
      "has_tag_some":has_tag_some,
      "no_tag_any":no_tag_any,
      "no_tag_every":no_tag_every
    }
    var filter = new Filter(filterCondition);
    //console.log('filterCondition: '+JSON.stringify(filterCondition));
    var condition ={
      'praise': {$gte:praise},
      'pageView': {$gte:pageView}
    }
    if(pixiver){
      condition =Object.assign(condition,{'pixiver':pixiver});
    }
    console.log('condition: '+JSON.stringify(condition));
    var query =BOOK.find(condition);
    query.limit(100);
    query.sort({praise:-1});
    //query.select('small_address');

    query.exec(function(err,resultSet){
      console.log('length: '+resultSet.length);
      resultSet =filter.filter(resultSet);
      req.session.items =resultSet;
      req.session.save();
      res.end('ok');

    });

});

router.get('/',function(req,res,next){
    if(req.session.items){
        res.render('download',{
          items:req.session.items,
          length:req.session.items.length
        });
    }else {
        next();
    }
});

router.get('/works',function(req,res,next){
    if(req.session.items){
        res.render('download_works',{
          group:req.session.group,    //表作品被分到哪一组
          works:req.session.items,
          number:req.session.items.length
        });
    }else {
        next();
    }
});

router.get('/works/:filename',function(req,res,next){
    var filename = req.params.filename;
	console.log('下载请求：'+filename);
    var folder = req.session.group || 'db';
	var filepath = path.join(__dirname,'../','public','images','download',folder,filename);
	var stats = fs.statSync(filepath);
	if(stats.isFile()){
		res.set({
			'Content-Type':'application/octet-stream',
			'Content-Disposition': 'attachment; filename='+filename,
   			'Content-Length': stats.size
		});
		fs.createReadStream(filepath).pipe(res);
	}else{
		res.end(404);
	}
});

module.exports = router;
