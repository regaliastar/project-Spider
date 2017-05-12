var mongoose = require('mongoose');
//var config = require('./../default.js');
//var mongoose = require('mongoose');
/*
mongoose.connect('mongodb://localhost/project-Spider');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("数据库成功开启");
});
*/
var pixiverSchema = mongoose.Schema({
	id:String,
	avator:String,
	bookmarket:String,
	follow:String,
	comment:String
});

var workSchema = mongoose.Schema({
	workName:String,
	tags:[String],
	pixiver:String,
	pageView:String,
	small_address:String,
	big_address:String
});

var mutilWorkSchema = mongoose.Schema({
	workName:String,
	tags:[String],
	pixiver:String,
	pageView:String,
	small_address:String,
	big_address:String,
	box_address:[String]
});

var Util={
	'Pixiver':pixiverSchema,
	'Work':workSchema,
	'MutilWork':mutilWorkSchema
}

var getSchema =function(name){
	return mongoose.model(name,Util[name]);
}

module.exports =getSchema
//exports.Pixiver = mongoose.model('Pixiver',pixiverSchema);
//exports.Work = mongoose.model('Work',workSchema);
//exports.MutilWork = mongoose.model('MutilWork',mutilWorkSchema);

/*
var Pixiverclass = require('./../spider/class/Pixiver');

var p = new Pixiverclass('1','touxiang','22','33','44');


var Pixiver = mongoose.model('Pixiverm',pixiverSchema);

//new Pixiver(p).save();
Pixiver.find({id:'1'},function(err,items){
	if(!err){
		items.map(function(item){
			console.log(JSON.stringify(item));
		})
	}else{
		console.log(err);
	}
})
db.close();
module.exports = getSchema;*/