'use strict';

/**
 * @author regaliastar
 *
 * Log类，用于打印日志以调试错误信息
 *
 */
var fs = require('fs');

class Log{
	/**
	 * @param re	支持自定义前缀
	 */
	constructor(re){
		if(re)	re = '['+re+']';
		this.re = re || '';
	}

}

/**
 * 写日志文件
 */
Log.log = function(){
	var date = Log.getDate();
	var time = Log.getTime();

	if(!fs.existsSync('./logs/')){
		fs.mkdirSync('./logs/');
	}

	var args = Array.prototype.slice.call(arguments);
	var txt = [].join.call(args,' ');

	fs.appendFile('./logs/'+date+'.log',time+txt+'\n','utf-8',function(err){
		if(err){
			throw err;
		}
	})
}

/**
 * 写普通文件
 */
Log.prototype.write = function(){
	var date = Log.getDate();

	var args = Array.prototype.slice.call(arguments);
	var txt = [].join.call(args,' ');

	fs.appendFile('./'+date+'.log',txt+'\n','utf-8',function(err){
		if(err){
			throw err;
		}
	})
}

/**
 * 自定义写文件
 */
Log.prototype.writeFile = function(path,txt){
	fs.appendFile('./'+path+'.log',txt+'\n','utf-8',function(err){
		if(err){
			throw err;
		}
	});
}

/**
 * 用于记录一般信息，INFO级别，主要为通知信息
 * 传入任意个字符串，将其按空格分开，并按日期作为文件名写在调用路径的logs目录下
 *
 * @param this.re 在传入前缀re的情况下，info前缀会改变成设定的值
 * @see Log.log()
 */
Log.prototype.info = function(){
	this.re = this.re || '[INFO]';
	var args = Array.prototype.slice.apply(arguments);
	args.unshift(this.re);
	this.re = '';
	Log.log.apply(this,args);
}

/**
 * 用于记录错误信息，ERROR级别
 *
 * @see Log.log()
 */
Log.prototype.error = function(){
	var args = Array.prototype.slice.apply(arguments);
	args.unshift('[ERROR]');
	Log.log.apply(this,args);
}

/**
 * 返回如YYYY-MM-DD格式的日期
 */
Log.getDate = function(){
	var d = new Date();
	var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
	return date;
}

/**
 * 返回如[HH时MM分SS秒]格式的时间
 */
Log.getTime = function(){
	var d = new Date();
	var time = '['+d.getHours()+'时'+d.getMinutes()+'分'+d.getSeconds()+'秒] ';
	return time;
}

module.exports = Log;
