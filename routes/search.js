var express = require('express'),
    path = require('path'),
    Operator = require('./../lib/operator'),
    GetModel = require('./../lib/mongo'),
    Filter =require('./../spider/class/filter');

var BOOK = GetModel('Work');

var router = express.Router();

router.use('/',function(req,res){
    var keywords = req.body.keywords ? req.body.keywords.trim().split(' ') : [];
    var reg_keywords =[];
    keywords.map(function(item){
        let t = new RegExp(item,'i');
        reg_keywords.push(t);
    });
    var condition ={
        tags: {$in: reg_keywords}
    }
    var query =BOOK.find(condition);
    query.limit(100);
    query.sort({praise:-1});

    query.exec(function(err,resultSet){
      console.log('length: '+resultSet.length);

      res.render('download',{
          size:'big',
          db:true,
          items:resultSet,
          length:resultSet.length
      })

    });

});

module.exports = router;
