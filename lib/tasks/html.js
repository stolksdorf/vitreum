var utils = require('../utils');
var gulp = require('gulp');
var _ = require('underscore');
var fs = require('fs');
var async = require('async');
var path = require('path');
var React = require('react');

require('node-jsx').install({extension : '.jsx'});

var template;
module.exports = function (config, callback) {
	var Handlebars = require('handlebars');
	var rename = require('gulp-rename');

	if(!template){
		template = Handlebars.compile(fs.readFileSync(config.pageTemplate, 'utf8'));
	}

	async.map(config.entryPoints, function (entryPoint, cb) {
		var name = path.basename(entryPoint);
		var cdnTags = _.reduce(config.cdn, function (r, cdnVals) {
			return r + cdnVals[1] + '\n';
		}, '')
		var cssTag = '<link rel="stylesheet" type="text/css" href="/' + name + '/bundle.css" />';

		var fileName= 'bundle.hbs'
		var file = template({
			vitreum: {
				component: '{{{component}}}',
				cdn: cdnTags,
				css: cssTag,
				libs: '<script src="/libs.js"></script>',
				config: '{{{config}}}',
				js: '<script src="/' + name + '/bundle.js"></script>',
				reactRender: '<script>React.render(React.createElement(require("' + entryPoint + '/' + name + '.jsx"), {{{initial_props}}}), document.body);</script>'
			}
		});

		if(config.projectType === 'STATIC'){
			fileName = 'index.html';
			var Page = require(path.resolve(entryPoint + '/' + name + '.jsx'));
			file = Handlebars.compile(file)({
				config : "",
				component: React.renderToString(React.createElement(Page)),
				initial_props: JSON.stringify({})
			});
		}

		utils.streamify(file)
			.pipe(rename(fileName))
			.pipe(gulp.dest(config.buildPath + '/' + name))
			.on('end', cb);
	}, callback)
};
