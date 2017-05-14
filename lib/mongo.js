/**
 * Warning：mongoose无法像js一样比较字符串和数字的大小，故需要正确填写类型！
 */

var mongoose = require('mongoose');

var pixiverSchema = mongoose.Schema({
	id:String,
	avator:String,
	bookmarket:Number,
	follow:Number,
	comment:Number,
	date : { type: Date, default:Date.now}
});

var workSchema = mongoose.Schema({
	workName:String,
	tags:[String],
	pixiver:String,
	praise:Number,
	pageView:Number,
	small_address:String,
	big_address:String,
	date : { type: Date, default:Date.now}
});

var mutilWorkSchema = mongoose.Schema({
	workName:String,
	tags:[String],
	pixiver:String,
	praise:Number,
	pageView:Number,
	small_address:String,
	big_address:String,
	box_address:[String],
	date : { type: Date, default:Date.now}
});

var Util={
	'Pixiver':pixiverSchema,
	'Work':workSchema,
	'MutilWork':mutilWorkSchema
}

var getModel =function(name){
	return mongoose.model(name,Util[name]);
}

module.exports =getModel
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
