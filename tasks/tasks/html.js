var utils = require('../utils');
var gulp = require('gulp');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var path = require('path');
//var React = require('react');
//var ReactDOMServer = require('react-dom/server');

var templateRenderer;

module.exports = function (config, callback) {
	//var Handlebars = require('handlebars');
	var doT = require('dot');

	doT.templateSettings.strip = false;
	doT.templateSettings.varname= 'vitreum';

	var rename = require('gulp-rename');

	if(!templateRenderer){
		templateRenderer = doT.template(fs.readFileSync(config.pageTemplate, 'utf8'));
	}

	async.map(config.entryPoints, function (entryPoint, cb) {
		var fullPath = path.resolve(entryPoint);
		var entryPointName = path.basename(entryPoint);

/*
		var cdnTags = _.reduce(config.cdn, function (r, cdnVals) {
			return r + cdnVals[1] + '\n';
		}, '')
*/

		var entryPointPath = path.join(fullPath, entryPointName + '.jsx');
		//fix for Windows-style seperators
		entryPointPath = entryPointPath.split('\\').join('\\\\');

		var file = templateRenderer({
			//vitreum: {
				component: '{{=render.component}}',
				//cdn: cdnTags,
				css: '<link rel="stylesheet" type="text/css" href="/' + entryPointName + '/bundle.css" />',
				inProduction: !config.DEV,
				inDev: config.DEV,
				libs: '<script src="/libs.js"></script>',
				config: '{{=render.config}}',
				headtags: '{{=render.headtags}}',
				js: '<script src="/' + entryPointName + '/bundle.js"></script>',
				reactRender: '<script>require("react-dom").render(require("react").createElement(require("' + entryPointPath + '"), {{=render.initial_props}}), document.getElementById("reactContainer"));</script>'
			//}
		});

		/*
		if(config.projectType === 'STATIC'){
			require('babel-core/register')({ ignore: false });
			fileName = 'index.html';
			var Page = require(path.resolve(path.join(entryPoint, name + '.jsx')));
			file = Handlebars.compile(file)({
				config : "",
				component: ReactDOMServer.renderToString(React.createElement(Page)),
				initial_props: JSON.stringify({})
			});
		}
		*/

		utils.streamify(file)
			.pipe(rename('bundle.dot'))
			.pipe(gulp.dest(config.buildPath + '/' + entryPointName))
			.on('end', cb);
	}, callback)
};
