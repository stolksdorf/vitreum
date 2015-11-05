var fs = require('fs');
var async = require('async');
var path = require('path');
var _ = require('lodash');
var gulpIf = require('gulp-if');
var gulp = require('gulp');
var utils = require('../utils');

var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var watchify = require('watchify');
var colors = require('colors/safe');





var createBundler = function(entryPoint, config){
	var name = path.basename(entryPoint);
	var deps = [];
	var warnings = [];


	var showWarnings = function(warnings){
		if(warnings.length){
			console.log(colors.red("Warning: ") + "The following node modules are in your js bundle.");
			console.log('    ' + colors.yellow(warnings.join('\n    ')));
			console.log(colors.green("Consider adding these the 'libs' field in the gulpfile\n"));
		}
	}

	var bundler = browserify({
			debug: config.DEV,
			cache: {},
			packageCache: {},
			fullPaths: true,
			paths : config.additionalRequirePaths
		})
		.require(entryPoint + '/' + name + '.jsx')
		.transform({global: true}, babelify)
		.external(config.libs);

	//As we're bundling collect the deps to make the architecture file and check
	// for node_moduels getting in the bundle.
	bundler.pipeline.get('deps')
		.on('data', function (data) {
			deps.push(data);
		})
		.on('end', function () {
			var warnings = [];
			deps = _.reduce(deps, function (r, d) {
				r[d.id] = _.keys(d.deps);

				//Collect all modules in the node_moduels to throw warnings, these should be in libs
				if(d.id.indexOf('node_modules') !== -1){
					warnings.push(d.id.substring(d.id.indexOf('node_modules') + 13));
				}
				return r;
			}, {});
			showWarnings(warnings);
			fs.writeFile(entryPoint + '/architecture.json', JSON.stringify(deps, null, '\t'));
		})

	return bundler;
}


var setupWatchify = function(entryPoint, config, bundler){
	var name = path.basename(entryPoint);

	bundler = watchify(bundler);
	bundler.on('update', function(){
		console.log("[--------] Starting '" + colors.cyan(name + " js") +"'...")
		console.time("[--------] Finished '" + colors.cyan(name + " js") +"' after");
		runBundle(entryPoint, config, bundler, function(){
			console.timeEnd("[--------] Finished '" + colors.cyan(name + " js") +"' after");
		});
	});

	return bundler;
};


var runBundle = function(entryPoint, config, bundler, callback){
	var name = path.basename(entryPoint);

	return bundler
		.bundle()
		.on('error', function(err){
			utils.handleError.call(this, config.DEV, err)
		})
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulpIf(!config.DEV, uglify()))
		.pipe(gulp.dest(config.buildPath + '/' + name))
		.on('finish', callback || function(){});
}


module.exports = function (config, shouldWatch, doneTask) {
	return async.map(config.entryPoints, function(entryPoint, doneMap){
		var bundler = createBundler(entryPoint, config);
		if(shouldWatch){
			bundler = setupWatchify(entryPoint, config, bundler);
		}
		runBundle(entryPoint, config, bundler, doneMap);
	}, doneTask);
}
