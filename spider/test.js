/**
 *用于测试spider部分函数
 */

var HTMLParser = require('./class/HTMLParser');
HTMLParser.parseMutilWork('http://www.pixiv.net/member_illust.php?mode=medium&illust_id=60909471',function(w){
    w.print();
})
