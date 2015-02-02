var path = require('path');
var fs = require('fs');
var React = require('react');
var Handlebars = require('handlebars');

var cachedPageTemplate = {};

module.exports = function (opts, callback) {
	callback = callback || function () {};
	var pageComponent = '';
	if(opts.prerenderWith) {
		var Page = require(path.resolve(opts.prerenderWith))
		pageComponent = React.renderComponentToString(Page(opts.initialProps));

		//Remove require reference in dev to continously pull the newest code
		if(process.env.NODE_ENV == 'development') delete require.cache[require.resolve(path.resolve(opts.prerenderWith))];
	}

	var config = '';
	if(opts.config){
		config = '<script>clientConfig = ' + JSON.stringify(opts.config) + '</script>'
	}

	var buildTemplate = function(compiledPageTemplate){
		callback(null, compiledPageTemplate({
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
			cachedPageTemplate[opts.page] = Handlebars.compile(pageTemplate);
			buildTemplate(cachedPageTemplate[opts.page])
		});
	}

}
