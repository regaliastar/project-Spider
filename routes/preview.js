var express = require('express'),
 path = require('path');

var router = express.Router();


router.post('/',function(req,res){
    var data ={
        'tasks':''+1,
        'completed':''+1,
        'time':''+1
    }
    if(req.body.post){
        console.log('req.body');
        res.send('ok');
    }else {
        console.log('else');

        res.send(data);
    }





});

module.exports = router;
