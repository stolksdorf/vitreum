var fs = require('fs');
var async = require('async');
var path = require('path');
var _ = require('underscore');
var gulpIf = require('gulp-if');
var utils = require('../utils');
var gulp = require('gulp');


var importMap = {};
var getLessImports = function (entryPoint) {
	//Caches the import Map
	if(importMap[entryPoint]) return importMap[entryPoint];

	var arch = JSON.parse(fs.readFileSync(entryPoint + '/architecture.json', 'utf8'))
	var imports = _.reduce(arch, function (result, deps, id) {
		var modulePath = id;
		if(path.extname(modulePath) == '.jsx') {
			var lessName = modulePath.replace('.jsx', '.less');
			if(fs.existsSync(lessName)) {
				result.push('@import "' + lessName + '";')
			}
		}
		return result;
	}, []).join('\n');

	importMap[entryPoint] = imports;
	return imports;
};

module.exports = function (config, callback) {

	var rename = require('gulp-rename');
	var less = require('gulp-less');
	var lesssourcemaps = require('gulp-sourcemaps');

	async.map(config.entryPoints, function(entryPoint, cb){
		var name = path.basename(entryPoint);

		utils.streamify(getLessImports(entryPoint))
			.pipe(gulpIf(config.DEV, lesssourcemaps.init()))
			.pipe(less({
					paths: ['./node_modules'],
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
