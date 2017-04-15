/**
 *用于测试spider部分函数
 */

/*var getId = (function(){
	var url = 'http://www.pixiv.net/member.php?id=1184799';

	return function(){
		fetch(url,function($){
			var ID = $('h1[class=user]').text();
			console.log(ID);
		});
	}
})();*/

//getId();
/*
var request = require('request'),
	fs = require('fs'),
	cheerio = require('cheerio'),
	log = require('./../log'),
	createHeader = require('./requestHeader');

var fetch = function(url,callback){

	request(url,function(err,res){
		if(err){
			console.log(err);
			log(err);
			return;
		}
        log(res.body);
		var $ = cheerio.load(res.body);
		callback($);
	}).on('error',function(){
		//监听error事件，当错误发生时代码可继续执行而不中断
		log('error! request in fetch.js');
	})
}*/
var HTMLParser = require('./class/HTMLParser');
HTMLParser.parsePixiver('1184799',function(bookmarket,follow,comment){
    console.log(bookmarket);
    console.log(follow);
    console.log(comment);
})
