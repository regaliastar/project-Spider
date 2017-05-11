var express = require('express'),
 path = require('path');

var router = express.Router();

router.post('/',function(req,res){
    console.log(req.body);
    res.render('index');
});

module.exports = router;
