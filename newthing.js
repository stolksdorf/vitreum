const browserify = require('browserify');

const testpath = './test/client/main/main.jsx'

let bundler = browserify({
		cache      : {}, packageCache: {},
		debug      : !isProd,
		standalone : name,
		paths      : opts.shared
	})
	.require(entryPoint)