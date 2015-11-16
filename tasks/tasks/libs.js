var utils = require('../utils');
var gulp = require('gulp');
var _ = require('lodash');
var fs = require('fs');

module.exports = function (config) {
	var browserify = require('browserify');
	var uglify = require('gulp-uglify');
	var source = require('vinyl-source-stream');
	var buffer = require('vinyl-buffer');
	var insert = require('gulp-insert');

	var clientLibs = _.reduce(config.clientLibs, function(r, clientLibPath){
		r += '\n;\n' + fs.readFileSync(clientLibPath, 'utf8');
		return r;
	}, '');

	return browserify({ paths: config.additionalRequirePaths })
		.require(config.libs)
		.bundle()
		.on('error', function(err){
			utils.handleError.call(this, config.DEV, err)
		})
		.pipe(source('libs.js'))
		.pipe(buffer())
		.pipe(insert.append(clientLibs))
		.pipe(uglify())
		.pipe(gulp.dest(config.buildPath));
};
