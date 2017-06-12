const path = require('path');
const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

const isProd = process.env.NODE_ENV === 'production';

const runLibs = (libs=[], shared=[], filename='libs.js') => {
	const logEnd = log.time('libs');

	const browserify = require('browserify');
	const uglify = require('uglify-es');
	const fse = require('fs-extra');

	return new Promise((resolve, reject) => {
		const bundle = browserify({ paths: shared })
			.require(libs)
			.bundle((err, buf) => {
				if(err) return reject(err);
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
				fse.outputFile(path.resolve(`./build`, filename), code, (err)=>{
					if(err) return reject(err);
					logEnd();
					return resolve();
				});
			});
	});
};

module.exports = addPartial(runLibs);