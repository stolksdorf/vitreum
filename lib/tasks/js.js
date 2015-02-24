var async = require('async');
var path = require('path');
var _ = require('underscore');
var gulpIf = require('gulp-if');
var gulp = require('gulp');
var utils = require('../utils');

module.exports = function (config, watch, doneTask) {
	var browserify = require('browserify');
	var uglify = require('gulp-uglify');
	var source = require('vinyl-source-stream');
	var buffer = require('vinyl-buffer');
	var reactify = require('reactify');
	var literalify = require('literalify');
	var watchify = require('watchify');
	var colors = require('colors/safe');

	var literalifyConfig = _.object(_.map(config.cdn, function (cdnVal, module) {
		return [module, cdnVal[0]]
	}));

	var entryPoints = _.map(config.entryPoints, function(ep, index){
		var name = path.basename(ep);
		return {
			name : name,
			bundler : browserify({
					debug: config.DEV,
					cache: {},
					packageCache: {},
					fullPaths: true
				})
				.require(ep + '/' + name + '.jsx')
				.transform({global: true}, reactify)
				.transform({global: true} , literalify.configure(literalifyConfig))
				.external(config.libs)
				,
			bundle : function(done){
				done = done || function(){};
				return this.bundler
					.bundle()
					.on('error', function(err){
						utils.handleError.call(this, config.DEV, err)
					})
					.pipe(source('bundle.js'))
					.pipe(buffer())
					.pipe(gulpIf(!config.DEV, uglify()))
					.pipe(gulp.dest(config.buildPath + '/' + name))
					.on('finish', done);
			},
			setupWatch : function(){
				var self = this;
				this.bundler = watchify(this.bundler);
				this.bundler.on('update', function(){
					console.log("[--------] Starting '" + colors.cyan(self.name + " js") +"'...")
					console.time("[--------] Finished '" + colors.cyan(self.name + " js") +"' after");
					self.bundle(function(){
						console.timeEnd("[--------] Finished '" + colors.cyan(self.name + " js") +"' after");
					});
				});
			}
		}
	});

	if(watch){
		return async.map(entryPoints, function(ep, doneMap){
			ep.setupWatch();
			ep.bundle(doneMap);
		}, doneTask);
	}

	return async.map(entryPoints, function(ep,doneMap){
		ep.bundle(doneMap);
	}, doneTask);
}
