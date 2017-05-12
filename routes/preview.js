var express = require('express'),
 path = require('path');

var router = express.Router();

router.post('/preview',function(req,res){
  console.log(req.body);
  res.end('success');
});

module.exports = router;
