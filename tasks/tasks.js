"use strict";
console.time("Loading vitreum");
var _ = require('lodash');
var defaultConfig = require('./defaultConfig.js');
var watch = require('gulp-watch');
var utils = require('./utils');

module.exports = function(gulp, configOverride){
	var runSequence = require('run-sequence').use(gulp);
	var config = _.extend(defaultConfig, configOverride);

	//the union of these two config values is used often throughout the build process.
	config.projectPaths = _.union(config.entryPoints, config.projectModules);


	//Tasks
	gulp.task('clean', require('./tasks/clean').bind(this, config));
	gulp.task('libs', require('./tasks/libs').bind(this, config));

	gulp.task('js', require('./tasks/js').bind(this, config, false));
	gulp.task('less', require('./tasks/less').bind(this, config));

	gulp.task('js-watch', require('./tasks/js').bind(this, config, true));
	gulp.task('less-watch', ['less'], function(){
		gulp.watch(utils.makeBlob(config.projectPaths, config.styleExts, '/**/'), ['less'])
	});

	gulp.task('template', require('./tasks/template').bind(this, config));
	gulp.task('assets', require('./tasks/assets').bind(this, config));

	gulp.task('livereload', require('./tasks/livereload').bind(this, config));
	gulp.task('runserver', require('./tasks/runserver').bind(this, config));



	/** Hybrid Tasks */

	gulp.task('run', function (callback){
		runSequence(
			'js-watch',
			['assets','less-watch','template'],
			'livereload','runserver',
		callback);
	});

	gulp.task('fresh', function (callback){
		runSequence('clean','libs', callback);
	});

	gulp.task('build', function (callback){
		runSequence(
			'clean',
			['libs','js'],
			['assets','less','template'],
		callback);
	});
	gulp.task('prod', function(callback){
		config.DEV = false;
		runSequence('build', callback);
	});

	gulp.task('cmds', function(){
		console.log('    gulp run   : assets, js-watch, less-watch, template, livereload, runserver');
		console.log('    gulp fresh : clean, libs');
		console.log('    gulp build : clean, libs, assets, js, less, template');
		console.log('    gulp prod  : build (but with the dev flag set to false)');
		console.log('    gulp       : run');
	});

	gulp.task('default', ['run']);




	/**  Experimental */

	//Triggers js-watch when a new js file is added
	gulp.task('js-new', function(){
		watch(utils.makeBlob(config.projectPaths, ['*.js', '*.jsx'], '/**/'), {events : ['add']}, function(){
			console.log('new file!');
			gulp.start('js-watch');
		})
	})



	return gulp;
};
console.timeEnd("Loading vitreum");
