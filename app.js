var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    routes = require('./routes/index'),
    config = require('./default');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("数据库成功开启");
});

var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(cookieParser(config.cookieSecret));
app.use(expressSession({
    resave: false,
    saveUninitialized: true,
	secret:config.sessionSecret,
	cookie:{maxAge:config.sessionMaxAge}
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

routes(app);

/**
 * 接收路由未能处理的请求
 */
app.use(function(req,res){
    res.render('error');
})

app.use(function(req,res){
    res.end('404');
})

if (module.parent){
  module.exports = app;
}else{
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${config.appName} listening on port ${config.port}`);
  });
}
