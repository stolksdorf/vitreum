var utils = require('../utils');
var gulp = require('gulp');
var async = require('async');
var path = require('path');

module.exports = function(config, callback){

	//For each of the project paths, match on all assets,
	// but maintain their folder paths from the project path
	async.map(config.projectPaths, function(projectPath, cb){
		return gulp.src(utils.makeBlob([projectPath + '/**/'], config.assetExts),
				{ base: path.resolve(projectPath, '../') })
			.pipe(gulp.dest(config.buildPath + 'assets/'))
			.on('end', cb);
	}, callback);
}