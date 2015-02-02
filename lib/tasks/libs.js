var utils = require('../utils');
var gulp = require('gulp');
var _ = require('underscore');


module.exports = function (config) {
	var browserify = require('browserify');
	var uglify = require('gulp-uglify');
	var source = require('vinyl-source-stream');
	var buffer = require('vinyl-buffer');

	return browserify()
		.require(config.libs)
		.bundle()
		.on('error', function(err){
					utils.handleError.call(this, config.DEV, err)
				})
		.pipe(source('libs.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(config.buildPath));
};