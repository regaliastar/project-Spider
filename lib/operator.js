'use strict'

class Operator{
	constructor(config){
		var GetSchema = require('./mongo');
		this.config =Object.assign(Operator.defaultConfig(),config);
		this.BOOK = GetSchema(this.config.schema);
	}
}

Operator.defaultConfig =function(){
	return{
		schema:'Pixiver'
	}
}

Operator.prototype['save'] = function(item){
	var BOOK = this.BOOK;
	new BOOK(item).save();
}

/**
 * 对于pixiver，flag为ID号: {id:'111'}
 * 对于作品，flag为小图地址: {small_address:'www.xxxxx.xxxx'}
 */
Operator.prototype['print'] = function(flag){
	var BOOK =this.BOOK;
	BOOK.find(flag,function(err,items){
		if(!err){
			items.map(function(item){
				console.log(item);
			})
		}else {
			console.log(err);
		}
	})
}
