/**
 *用于测试spider部分函数
 */

/*var HTMLParser = require('./class/HTMLParser');
HTMLParser.parseMutilWork('http://www.pixiv.net/member_illust.php?mode=medium&illust_id=60909471',function(w){
    w.print();
})*/

/*
var Filter = require('./class/Filter');
var filter = new Filter({'praise':0,"praise_pro":0,"pageView":0,"has_tag_every":[],"has_tag_some":['2'],"no_tag_any":['1'],"no_tag_every":['1','10']});
var workList = [{'praise':10,"praise_pro":0,"pageView":100,"tags":['1','10'],"url":'www',"pixiver":'118'},
                {'praise':10,"praise_pro":0,"pageView":100,"tags":['1','2'],"url":'www',"pixiver":'118'},
                {'praise':20,"praise_pro":0,"pageView":200,"tags":['2'],"url":'www',"pixiver":'118'},
                {'praise':30,"praise_pro":0,"pageView":300,"tags":['3'],"url":'www',"pixiver":'118'}];
var resultSet = filter.filter(workList);
console.log('resultSet: '+JSON.stringify(resultSet));*/


var Log = require('./../Log');
var log = new Log('555');
log.info('hhh');
log.error('error!!');
