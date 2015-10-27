var path = require('path');
var fs = require('fs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
//var Handlebars = require('handlebars');



var HeadTags = require('../headtags');
var _ = require('lodash');
var gulp = require('gulp');



var doT = require('dot');
doT.templateSettings.strip = false;
doT.templateSettings.varname= 'render';



var cachedPageTemplate = {};


module.exports = function (opts, callback) {
	require('babel-core/register')({ ignore: false });

	callback = callback || function () {};
	var pageComponent = '';
	if(opts.prerenderWith) {
		var Page = require(path.resolve(opts.prerenderWith));
		pageComponent = ReactDOMServer.renderToString(React.createElement(Page, opts.initialProps));
	}

	var config = '';
	if(opts.config){
		config = '<script>config = ' + JSON.stringify(opts.config) + '</script>'
	}

	var buildTemplate = function(compiledPageTemplate){
		callback(null, compiledPageTemplate({
			headtags : HeadTags.convertToString(),
			config : config,
			component: pageComponent,
			initial_props: JSON.stringify(opts.initialProps || {})
		}));
	}

	if(cachedPageTemplate[opts.page]){
		buildTemplate(cachedPageTemplate[opts.page]);
	}else{
		fs.readFile(opts.page, 'utf8', function (err, pageTemplate) {
			if(err) return callback(err);
			cachedPageTemplate[opts.page] = doT.template(pageTemplate);
			buildTemplate(cachedPageTemplate[opts.page])
		});
	}

}
