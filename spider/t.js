/*var HTMLParser = require('./class/HTMLParser');
var htmlParser = new HTMLParser();

htmlParser.parseSearchWorks('bdglabglsgbidf');

htmlParser.once('once',function(length){
    tasks =length;
    console.log('tasks: '+tasks);
});
htmlParser.on('message',function(msg){
    console.log(msg);
});
htmlParser.on('success',function(work){
    console.log('success');
    console.log(work);
});
htmlParser.on('error',function(){
    console.log('error');
});
htmlParser.on('close',function(){
    console.log('close');

});
*/

var a =['1','2'];
var b =['3'];
Array.prototype.push.apply(a,b);
console.log(a);
