"use strict";
console.time("Loading vitreum");
var _ = require('underscore');
var runSequence = require('run-sequence');

module.exports = function(gulp, configOverride){
	var runSequence = require('run-sequence').use(gulp);
	var config = _.extend({
		entryPoints: [],
		DEV: true,
		serverWatchPaths: [],
		serverScript: null,
		buildPath: './build/',
		projectType : 'STATIC',

		pageTemplate: null,

		projectModules: [],
		jsExts: ['*.js', '*.jsx'],
		styleExts: ['*.less', '*.css'],
		assetExts: ['*.svg', '*.png'],
		cdn: {},
		libs: [],
	}, configOverride);


	gulp.task('architecture', require('./tasks/architecture').bind(this, config));
	gulp.task('js', require('./tasks/js').bind(this, config, false));
	gulp.task('less', require('./tasks/less').bind(this, config));
	gulp.task('html', require('./tasks/html').bind(this, config));
	gulp.task('libs', require('./tasks/libs').bind(this, config));
	gulp.task('assets', require('./tasks/assets').bind(this, config));
	gulp.task('watch', require('./tasks/watch').bind(this, gulp, config));
	gulp.task('clean', require('./tasks/clean').bind(this, config));
	gulp.task('server', require('./tasks/server').bind(this, config));
	gulp.task('livereload', require('./tasks/livereload').bind(this, config));


	gulp.task('build', function (callback) {
		runSequence('clean', 'architecture', ['libs', 'assets', 'js', 'less', 'html'], callback);
	});
	gulp.task('update', function(callback){
		runSequence(['architecture', 'assets'], 'run', callback);
	});
	gulp.task('run', function (callback) {
		runSequence(['watch', 'livereload'], 'server', callback);
	});
	gulp.task('fresh', function(callback){
		runSequence('build', 'run', callback);
	})
	gulp.task('prod', function(callback){
		config.DEV = false;
		runSequence('build', callback);
	})

	gulp.task('cmds', function(){
		console.log('    build   : Cleans and re-builds the entire project');
		console.log('    run     : Sets up watchers, livereload and starts the server');
		console.log('    update  : Picks up new files, then runs the project');
		console.log('    fresh   : Does a full build and then run');
		console.log('    prod    : Does a full build with the DEV flag to false');
		console.log('    default : Runs the project');
	});

	gulp.task('default', ['run']);
	return gulp;
};
console.timeEnd("Loading vitreum");
