var fs = require('fs');
var async = require('async');
var path = require('path');
var _ = require('underscore');
var gulpIf = require('gulp-if');
var gulp = require('gulp');

var utils = require('../utils');


module.exports = function (config, watch, callback) {
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


	//Create bundlers
	var bundlers = _.map(config.entryPoints, function(entryPoint){
		var name = path.basename(entryPoint);
		var bundler = browserify({
			debug: config.DEV,
			insertGlobals : true,
			cache: {},
			packageCache: {},
			fullPaths: watch
		})
			.require(entryPoint + '/' + name + '.jsx')
			.transform({global: true}, reactify)
			.transform({global: true} , literalify.configure(literalifyConfig))
			.external(config.libs)

		return [name, bundler];
	});

	//This is where the action happens
	//Runs each of the bundlers async
	var bundle = function(showTimeStamp, callback){
		if(showTimeStamp){
			console.log("[--------] Starting '" + colors.cyan("js") + "'...")
			console.time("[--------] Finished '" + colors.cyan("js") + "' after");
		}

		async.map(bundlers, function(bundleMap, cb){
			var bundler = bundleMap[1];
			var name = bundleMap[0];

			return bundler
				.bundle()
				.on('error', function(err){
					utils.handleError.call(this, config.DEV, err)
				})
				.pipe(source('bundle.js'))
				.pipe(buffer())
				.pipe(gulpIf(!config.DEV, uglify()))
				.pipe(gulp.dest(config.buildPath + '/' + name))
				.on('finish', cb);
		},function(){
			if(showTimeStamp) console.timeEnd("[--------] Finished '" + colors.cyan("js") + "' after");
			callback();
		});
	}

	//Creates watchify-ied versions of the bundlers
	if(watch){
		bundlers = _.map(bundlers, function(bundleMap){
			var bundler = bundleMap[1];
			var name = bundleMap[0];

			bundler = watchify(bundler);
			bundler.on('update', bundle.bind(this, true, function(){}));
			return [name, bundler];
		});
		return callback();
	}

	return bundle(false, callback);
};

