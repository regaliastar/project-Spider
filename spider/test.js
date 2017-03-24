var fetch = require('./fetch');

var getId = (function(){
	var url = 'http://www.pixiv.net/member.php?id=1184799';

	return function(){
		fetch(url,function($){
			var ID = $('h1[class=user]').text();
			console.log(ID);
		});
	}
})();

getId();