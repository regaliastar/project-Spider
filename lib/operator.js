'use strict'

class Operator{
	constructor(config){
		var getModel = require('./mongo');
		this.config =Object.assign(Operator.defaultConfig(),config);
		this.BOOK = getModel(this.config.schema);
	}
}

Operator.defaultConfig =function(){
	return{
		schema:'Pixiver'
	}
}

Operator.prototype['save'] = function(item,callback){
	var BOOK = this.BOOK;
	var pi =new BOOK(item);
	pi.save(function(err,res){
		if(err){
			console.log(err);
		}else {
			if(callback){
				callback(res);
			}
		}
	})

}

/**
 * 对于pixiver，flag为ID号: {id:'111'}
 * 对于作品，flag为小图地址: {small_address:'www.xxxxx.xxxx'}
 */
Operator.prototype['find'] = function(flag,callback){
	var BOOK =this.BOOK;
	BOOK.find(flag,function(err,items){
		if(!err){
			var length =items.length;
			var box =new Array();
			items.map(function(item){
				length--;
				box.push(item);
				if(length === 0 && callback)	callback(box);
			})
		}else {
			console.log(err);
		}
	})
}

Operator.prototype['update'] = function(flag,target,callback){
	var BOOK =this.BOOK;
	BOOK.update(flag,target,{multi:true},function(err,numberAffect,raw){
		if(err){
			console.log(err);
			return;
		}
		BOOK.find(target,function(err,items){
			if(!err){
				var length =items.length;
				var box =new Array();
				items.map(function(item){
					length--;
					box.push(item);
					if(length === 0 && callback)	callback(box);
				})
		}else {
			console.log(err);
		}
		})
	})
}

Operator.prototype['remove'] = function(flag,callback){
	var BOOK =this.BOOK;
    BOOK.find(flag,function(err,items){
		if(!err){
			var length =items.length;
			var box =new Array();
			items.map(function(item){
				length--;
				item.remove();
				box.push(item);
				if(length === 0 && callback)	callback(box);
			})
		}else {
			console.log(err);
		}
	})
}


module.exports= Operator;
