var gulp = require('gulp');

module.exports = function(config){
	var livereload = require('gulp-livereload');
	var lr = require('tiny-lr');
	lr();
	livereload.listen({silent : true});
	return gulp.watch(config.buildPath + '**/*').on('change', livereload.changed);
};