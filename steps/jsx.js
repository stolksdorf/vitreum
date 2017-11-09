const _ = require('lodash');
const path = require('path');

const log = require('../utils/log.js');
const isProd = process.env.NODE_ENV === 'production';

const makeBundler = function(name, entryPoint, opts={}){
	if(!_.isPlainObject(opts)) throw 'JSX step: opts must be an object';
	opts = _.defaults(opts, {
		filename   : 'bundle.js',
		libs       : [],
		shared     : [],
		transforms : [],
		global     : true
	});
	if(!_.isArray(opts.shared)) throw 'JSX step: opts.shared must be an array';
	if(!_.isArray(opts.libs)) throw 'JSX step: opts.libs must be an array';
	if(!_.isArray(opts.transforms)) throw 'JSX step: opts.transforms must be an array';

	log.setSilent(opts.silent);


	const browserify = require('browserify');
	const babelify   = require('babelify');
	const uglify     = require("uglify-es");
	const fse        = require('fs-extra');

	let jsxDeps = [];
	let warnings = [];

	let bundler = browserify({
			cache      : {}, packageCache: {},
			debug      : !isProd,
			standalone : name,
			paths      : opts.shared
		})
		.require(entryPoint)
		.transform('babelify', { global : opts.global })
		.external(opts.libs);

	_.each(opts.transforms, (plugin)=>bundler = bundler.transform(plugin));

	bundler.pipeline.get('deps')
		.on('data', (file) => {
			if(path.extname(file.id) == '.jsx'){
				jsxDeps.push(file.id);
			}
			if(file.id.indexOf('node_modules') !== -1){
				const moduleName = path.dirname(file.id.substring(file.id.indexOf('node_modules') + 13));
				warnings.push(moduleName);
			}
		});

	const run = ()=>{
		const logEnd = log.time(`jsx[${name}]`);
		return new Promise((resolve, reject) => {
			jsxDeps  = [];
			warnings = [];

			if(!isProd) require('source-map-support').install();

			bundler.bundle((err, buf) => {
				if(err) {
					log.jsxError(err);
					return reject(err);
				}
				log.libWarnings(warnings);

				let code = buf.toString();
				if(isProd){
					try{
						const minified = uglify.minify(buf.toString());
						if(minified.error) return reject(minified.error);
						code = minified.code;
					}catch(e){
						reject(e);
					}
				}

				fse.outputFile(path.resolve(`./build`, name, opts.filename), code, (err)=>{
					if(err) return reject(err);
					logEnd();
					return resolve(jsxDeps);
				});
			});
		});
	};

	return {
		run : run,
		rawBundler : bundler
	};
};

const runJSX = (name, entryPoint, opts)=>{
	return makeBundler(name, entryPoint, opts).run();
};

runJSX.makeBundler = makeBundler;

module.exports = runJSX;
