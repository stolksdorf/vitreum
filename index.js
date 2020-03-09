module.exports = {
	pack : require('./lib/pack.js'),
	html : require('./lib/html.js'),
	server : require('./lib/server.js'),
	utils : require('./lib/utils.js'),

	livereload : require('./lib/livereload.js'),
	lr : require('./lib/livereload.js'),


	...require('./lib/utils.js')
};