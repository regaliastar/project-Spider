module.exports = function(app){
	app.get('/',require('./home'));
	app.use('/download', require('./download'));
	app.use('/preview', require('./preview'));
	app.use('/search', require('./search'));
	app.use('/pixiver', require('./pixiver'));
};
