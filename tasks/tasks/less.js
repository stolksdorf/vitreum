var fs = require('fs');
var async = require('async');
var path = require('path');
var _ = require('lodash');
var gulpIf = require('gulp-if');
var utils = require('../utils');
var gulp = require('gulp');

var importMapCache = {};
var getStyleImportString = function (entryPoint) {
	if(importMapCache[entryPoint]) return importMapCache[entryPoint];

	var architectureFile = JSON.parse(fs.readFileSync(entryPoint + '/architecture.json', 'utf8'));

	//Creates a less-style string which contians all the implicit component imports we need to make
	var imports = _.reduce(architectureFile, function (result, deps, id) {
		var modulePath = id;

		//If there exists a .jsx file and a less file of the same name in the same folder, import it
		if(path.extname(modulePath) == '.jsx') {
			var lessName = modulePath.replace('.jsx', '.less');
			if(fs.existsSync(lessName)) {
				result.push('@import "' + lessName + '";')
			}
		}
		return result;
	}, []).reverse().join('\n');

	//Cache the result for future use
	importMapCache[entryPoint] = imports;
	return imports;
};

module.exports = function (config, callback) {
	var rename = require('gulp-rename');
	var less = require('gulp-less');
	var lesssourcemaps = require('gulp-sourcemaps');

	async.map(config.entryPoints, function(entryPoint, cb){
		var name = path.basename(entryPoint);

		//Make the import string into a stream and process it
		utils.streamify(getStyleImportString(entryPoint))
			.pipe(gulpIf(config.DEV, lesssourcemaps.init()))
			.pipe(less({
					paths: ['./shared'],
					compress: !config.DEV,
				})
				.on('error', function(err){
					utils.handleError.call(this, config.DEV, err)
				})
			)
			.pipe(gulpIf(config.DEV, lesssourcemaps.write()))
			.pipe(rename('bundle.css'))
			.pipe(gulp.dest(config.buildPath + '/' + name))
			.on('finish', cb)
	}, callback);
}
