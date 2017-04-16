/**
 * @author regaliastar
 *
 * 传入任意个字符串，将其按空格分开，并按时间作为文件名写在调用路径的logs目录下
 */
var fs = require('fs');

function log(){
	var d = new Date();
	var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
	var time = '['+d.getHours()+'时'+d.getMinutes()+'分'+d.getSeconds()+'秒] ';

	if(!fs.existsSync('./logs/')){
		fs.mkdirSync('./logs/');
	}

	var txt = [].join.call(arguments,' ');

	fs.appendFile('./logs/'+date+'.log','\n'+time+txt,'utf-8',function(err){
		if(err){
			throw err;
		}
	})
}

module.exports = log;
