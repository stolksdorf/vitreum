var _ = require('underscore');
var utils = require('../utils');
var gulp = require('gulp');

module.exports = function(config){
	var clean = require('gulp-clean');
	var buildFiles = _.union(utils.makeBlob(config.entryPoints, ['/architecture.json']), [config.buildPath]);
	return gulp.src(buildFiles, {
			read: false
		})
		.pipe(clean());
}