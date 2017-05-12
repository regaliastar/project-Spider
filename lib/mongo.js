var mongoose = require('mongoose');

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

module.exports = getSchema;
//exports.Pixiver = mongoose.model('Pixiver',pixiverSchema);
//exports.Work = mongoose.model('Work',workSchema);
//exports.MutilWork = mongoose.model('MutilWork',mutilWorkSchema);
