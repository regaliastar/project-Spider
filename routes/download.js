var express = require('express'),
    path = require('path'),
    Operator = require('./../lib/operator');

var router = express.Router();

router.post('/',function(req,res){
    console.log(req.body);
    var items =[{url:'url1'},{url:'url2'}];
    req.session.items =items;
    req.session.save();
    res.end('ok');
});

router.get('/',function(req,res,next){
    if(req.session.items){
        res.render('download',{items:req.session.items});
    }else {
        next();
    }
})

module.exports = router;
