var express = require('express'),
 path = require('path');

var router = express.Router();

router.post('/search',function(req,res){
  console.log(req.body);
  res.end('success');
});

module.exports = router;
