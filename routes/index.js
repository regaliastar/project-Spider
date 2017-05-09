module.exports = function(app){
	app.get('/',require('./home'));
	app.get('/')
	app.use(function(req,res){
		res.send('404');
	})
};
