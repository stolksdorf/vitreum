var path = require('path');
var _ = require('lodash');

module.exports = function(config){
	if(!config.serverScript) return;
	var nodemon = require('gulp-nodemon');
	return nodemon({
		script: config.serverScript,
		watch: _.union(config.serverWatchPaths, [config.serverScript])
	});
}