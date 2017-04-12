/**
 *created by regaliastar on 3/26
 *
 *用于得到P站所有用户的信息，并保存在文件或数据库中
 */
 var fetch = require('./fetch'),
 	fs = require('fs'),
 	cheerio = require('cheerio'),
 	request = require('request'),
 	log = require('./../log'),
	createHeader = require('./requestHeader');

var getUser = (function(){
	var seed = 'http://www.pixiv.net/member.php?id=';

	return function(ID){
		var url = seed+ID;
		fetch(url,function($){
			
		});
	}
})();