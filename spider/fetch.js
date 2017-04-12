/**
 *created by regaliastar on 3/24
 *设计模式：策略模式;根据不同的回调函数执行不同的方法,降低代码的耦合度
 *
 *传入目标url,取得网页并将网页解析成支持JQuery选择器的$，并将待处理的数据传递给回调函数处理
 */

var request = require('request'),
	fs = require('fs'),
	cheerio = require('cheerio'),
	log = require('./../log'),
	createHeader = require('./requestHeader');

var fetch = function(url,callback){
	var header = createHeader(url);
	request(header,function(err,res){
		if(err){
			console.log(err);
			log(err);
			return;
		}

		var $ = cheerio.load(res.body);
		callback($);
	}).on('error',function(){
		//监听error事件，当错误发生时代码可继续执行而不中断
		log('error! request in fetch.js');
	})
}

module.exports = fetch;