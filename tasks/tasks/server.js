var path = require('path');

module.exports = function(config){
	if(!config.serverScript) return;
	var nodemon = require('gulp-nodemon');
	return nodemon({
		script: config.serverScript,
		watch: config.serverWatchPaths
	});
}