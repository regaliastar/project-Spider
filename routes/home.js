var express = require('express'),
 path = require('path');

var router = express.Router();

router.get('/',function(req,res){
	res.render('home');
})

module.exports = router;