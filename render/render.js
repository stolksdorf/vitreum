var path = require('path');
var fs = require('fs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var HeadTags = require('../headtags');
var _ = require('lodash');
var doT = require('dot');
doT.templateSettings.strip = false;
doT.templateSettings.varname= 'render';


//Clears the server's requrie cache for client-side files to be browserified
//Used only during continous builds on DEV
var clearCache = function(opts){
	//Iterates through a file cache in require and uncaches it and all it's deps
	var requireUncache = function(filePath){
		var rc = require.cache[filePath];
		if(rc){
			if(rc.parent.id) requireUncache(rc.parent.id);
			delete require.cache[filePath];
		}
	}

	//Load the project's architecture file to determine what to uncache
	var architecturePath = path.join(path.dirname(opts.prerenderWith), 'architecture.json');
	if(fs.existsSync(architecturePath)){
		var architecture = JSON.parse(fs.readFileSync(architecturePath, 'utf8'));
		_.each(architecture, function(val, filePath){
			requireUncache(filePath);
		});
	}
}


var cachedPageTemplate = {};
var getTemplate = function(opts){
	if(!cachedPageTemplate[opts.page]){
		cachedPageTemplate[opts.page] = doT.template(fs.readFileSync(opts.page, 'utf8'));
	}
	return cachedPageTemplate[opts.page];
}


module.exports = function (opts, callback) {
	require('babel-core/register')({ ignore: false });
	callback = callback || function () {};

	var pageComponent = '';
	if(opts.prerenderWith) {
		if(opts.clearRequireCache) clearCache(opts)
		var Page = require(path.resolve(opts.prerenderWith));
		pageComponent = ReactDOMServer.renderToString(React.createElement(Page, opts.initialProps));
	}

	var globals = '';
	if(opts.globals){
		globals = '<script>' +
			_.map(opts.globals, function(vals, varName){
				return varName + ' = ' + JSON.stringify(vals);
			}).join('\n')
		+ '</script>';
	}

	callback(null, getTemplate(opts)({
		headtags      : HeadTags.convertToString(),
		globals       : globals ,
		component     : pageComponent,
		initial_props : JSON.stringify(opts.initialProps || {})
	}));
}
