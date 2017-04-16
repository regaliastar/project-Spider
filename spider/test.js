/**
 *用于测试spider部分函数
 */

/*var HTMLParser = require('./class/HTMLParser');
HTMLParser.parseMutilWork('http://www.pixiv.net/member_illust.php?mode=medium&illust_id=60909471',function(w){
    w.print();
})*/
var Filter = require('./class/Filter');
var filter = new Filter({'rated':0,"rated_pro":0,"view":0,"has_tag_every":[],"has_tag_some":[],"no_tag_any":[],"no_tag_every":['1','10']});
var workList = [{'rated':10,"rated_pro":0,"view":100,"tagList":['1','10']},
                {'rated':10,"rated_pro":0,"view":100,"tagList":['1','2']},
                {'rated':20,"rated_pro":0,"view":200,"tagList":['2']},
                {'rated':30,"rated_pro":0,"view":300,"tagList":['3']}];
var resultSet = filter.filter(workList);
console.log('resultSet: '+JSON.stringify(resultSet));
//filter.print();
