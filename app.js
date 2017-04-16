var express = require('express'),
    path = require('path'),
    routes = require('./routes/index');

var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

routes(app);

if (module.parent){
  module.exports = app;
}else{
  // 监听端口，启动程序
  app.listen(3000, function () {
    console.log('project-Spider listening on port 3000');
  });
}
