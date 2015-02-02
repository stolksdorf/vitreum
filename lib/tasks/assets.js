var _ = require('underscore');
var utils = require('../utils');
var gulp = require('gulp');
var async = require('async');
var path = require('path');

module.exports = function(config, callback){
	async.map(_.union(config.entryPoints, config.projectModules), function(p, cb){
		return gulp.src(utils.makeBlob([p + '/**/'], config.assetExts), { base: path.resolve(p, '../') })
			.pipe(gulp.dest(config.buildPath + 'assets/'))
			.on('end', cb);
	}, callback);
}