var _ = require('underscore');
var utils = require('../utils');
var jsTask = require('./js');
var watch = require('gulp-watch');

module.exports = function (gulp, config, callback) {
	var pm = _.map(_.union(config.projectModules, config.entryPoints), function (p) {
		return p + '/**/'
	});

	//Watch Less
	gulp.watch(utils.makeBlob(pm, config.styleExts), ['less']);


	//Watch Assets
	watch(utils.makeBlob(pm,config.assetExts), function(){
		gulp.start('assets');
	});

	//Watch JS
	jsTask(config, true, callback);
};