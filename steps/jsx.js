const _ = require('lodash');
const path = require('path');


const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

const isProd = process.env.NODE_ENV === 'production';

const makeBundler = function(name, entryPoint, libs=[], shared=[]){
	if(!_.isArray(shared)) shared = [shared];
	const fse = require('fs-extra');
	const browserify = require('browserify');
	const babelify = require('babelify');
	const uglify = require("uglify-es");

	let jsxDeps = [];
	let warnings = [];

	const bundler = browserify({
			cache: {}, packageCache: {},
			debug: !isProd,
			standalone : name,
			paths : shared
		})
		.require(entryPoint)
		.transform('babelify', {
			presets: ['latest', 'react'],
			global : true
		})
		.external(libs);

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
			jsxDeps = [];
			warnings = [];

			if(!isProd) require('source-map-support').install();

			bundler.bundle((err, buf) => {
				if(err) {
					log.jsxError(err);
					return reject(err.toString());
				}
				log.libWarnings(warnings);

				let code = buf.toString();
				if(isProd){
					try{
						code = uglify.minify(buf.toString(), {fromString: true}).code;
					}catch(e){
						reject(e);
					}
				}

				fse.outputFile(`build/${name}/bundle.js`, code, (err)=>{
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

const runJSX = (name, entryPoint, libs, shared)=>{
	return makeBundler(name, entryPoint, libs, shared).run();
};

runJSX.makeBundler = makeBundler;

module.exports = addPartial(runJSX);
