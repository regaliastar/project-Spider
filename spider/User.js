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
	/**
	 *得到个人信息的表格，并传递给callback
	 *当获得完全时，调用回调函数
	 */
	var fetchTable = function($,callback){
		var UserInfo = {};
		var length = $('table[class=ws_table]').first().children().length;
		$('table[class=ws_table]').first().children().each(function(){
			var _left = $(this).children('td:first-child').text();
			var _right = $(this).children('td:last-child').text();
			UserInfo[_left] = _right;
			length--;
			if(!length)	callback(UserInfo);
		});

	}

	return function(ID){
		var url = seed+ID;
		fetch(url,function($){

			fetchTable($,function(UserInfo){
				for(var key in UserInfo){
					//打印
					console.log(key + ' : ' + UserInfo[key]);
				}
			})
		});
	}
})();

exports.getUser = getUser;