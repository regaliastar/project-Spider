var express = require('express'),
 path = require('path');

var router = express.Router();

router.get('/',function(req,res){
	res.render('index');
});

router.post('search/:keyword',function(req,res){
  console.log(keyword);
  res.end('success');
});

module.exports = router;
