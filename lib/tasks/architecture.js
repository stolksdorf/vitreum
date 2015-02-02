var fs = require('fs');
var async = require('async');
var path = require('path');
var _ = require('underscore');
var utils = require('../utils');

module.exports = function (config, callback) {
	var browserify = require('browserify');
	var reactify = require('reactify');

	async.map(config.entryPoints, function (entryPoint, cb) {
		var deps = [];
		var name = path.basename(entryPoint);
		var externals = _.flatten([_.keys(config.cdn), config.libs]);

		var bundler = browserify({
			entries : [entryPoint + '/' + name + '.jsx'],
			noParse: externals,
		});
		_.each(externals, function(lib){
			bundler.ignore(lib)
		});
		bundler.transform({global: true}, reactify)

		bundler.pipeline.get('deps')
			.on('data', function (data) {
				deps.push(data);
			})
			.on('end', function () {
				deps = _.reduce(deps, function (r, d) {
					r[d.id] = _.keys(d.deps)
					return r;
				}, {});
				fs.writeFile(entryPoint + '/architecture.json', JSON.stringify(deps, null, '\t'), cb);
			})
		return bundler.bundle().on('error', function(err){
					utils.handleError.call(this, config.DEV, err)
				})
	}, callback);
};