var gulp = require('gulp');

module.exports = function (config) {
	if(!config.configPath) return;

	var browserify = require('browserify');
	var source = require('vinyl-source-stream');
	var buffer = require('vinyl-buffer');
	var brfs = require('brfs');

	return browserify()
		.require([config.configPath])
		.transform({global : true}, brfs)
		.bundle()
		.pipe(source('config.js'))
		.pipe(buffer())
		.pipe(gulp.dest(config.buildPath))
};