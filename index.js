module.exports = {
	pack : require('./lib/pack.js'),
	html : require('./lib/html.js'),
	server : require('./lib/simple.server.js'),
	livereload : require('./lib/livereload.js'),

	filewatch: require('./lib/filewatch.js'),
	watchFile: require('./lib/filewatch.js'),

	utils : require('./lib/utils.js'),
	...require('./lib/utils.js')
};