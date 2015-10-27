var utils = require('../utils');
var gulp = require('gulp');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var path = require('path');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var templateRenderer;

module.exports = function (config, callback) {
	var Handlebars = require('handlebars');
	var doT = require('dot');

	doT.templateSettings.strip = false;
	doT.templateSettings.varname= 'vitreum';
	//doT.templateSettings.append= false;

	var rename = require('gulp-rename');

	if(!templateRenderer){
		templateRenderer = doT.template(fs.readFileSync(config.pageTemplate, 'utf8'));
	}

	async.map(config.entryPoints, function (entryPoint, cb) {
		var fullPath = path.resolve(entryPoint);
		var name = path.basename(entryPoint);
		var cdnTags = _.reduce(config.cdn, function (r, cdnVals) {
			return r + cdnVals[1] + '\n';
		}, '')
		var cssTag = '<link rel="stylesheet" type="text/css" href="/' + name + '/bundle.css" />';


		var entryPointPath = path.join(fullPath, name + '.jsx');
		//fix for Windows-style seperators
		entryPointPath = entryPointPath.split('\\').join('\\\\');

		var fileName= 'bundle.hbs'
		var file = templateRenderer({
			//vitreum: {
				component: '{{{component}}}',
				cdn: cdnTags,
				css: cssTag,
				inProduction: true, //process.env.NODE_ENV == 'production',
				libs: '<script src="/libs.js"></script>',
				config: '{{{config}}}',
				headtags: '{{{headtags}}}',
				js: '<script src="/' + name + '/bundle.js"></script>',
				reactRender: '<script>require("react-dom").render(require("react").createElement(require("' + entryPointPath + '"), {{{initial_props}}}), document.getElementById("reactContainer"));</script>'
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
			.pipe(rename(fileName))
			.pipe(gulp.dest(config.buildPath + '/' + name))
			.on('end', cb);
	}, callback)
};
