var utils = require('../utils');
var gulp = require('gulp');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var path = require('path');

var templateRenderer;

module.exports = function (config, callback) {
	var rename = require('gulp-rename');
	var doT = require('dot');
	doT.templateSettings.strip = false;
	doT.templateSettings.varname= 'vitreum';

	if(!templateRenderer){
		templateRenderer = doT.template(fs.readFileSync(config.pageTemplate, 'utf8'));
	}

	async.map(config.entryPoints, function (entryPoint, cb) {
		var fullPath = path.resolve(entryPoint);
		var entryPointName = path.basename(entryPoint);

		var entryPointPath = path.join(fullPath, entryPointName + '.jsx');
		//fix for Windows-style seperators
		entryPointPath = entryPointPath.split('\\').join('\\\\');

		var file = templateRenderer({
			component: '{{=render.component}}',
			css: '<link rel="stylesheet" type="text/css" href="/' + entryPointName + '/bundle.css" />',
			inProduction: !config.DEV,
			inDev: config.DEV,
			libs: '<script src="/libs.js"></script>',
			globals: '{{=render.globals}}',
			headtags: '{{=render.headtags}}',
			js: '<script src="/' + entryPointName + '/bundle.js"></script>',
			reactRender: '<script>require("react-dom").render(require("react").createElement(require("' + entryPointPath + '"), {{=render.initial_props}}), document.getElementById("reactContainer"));</script>'
		});

		utils.streamify(file)
			.pipe(rename('bundle.dot'))
			.pipe(gulp.dest(config.buildPath + '/' + entryPointName))
			.on('end', cb);
	}, callback)
};
