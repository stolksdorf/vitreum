const fs = require('fs');

const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

const isProd = process.env.NODE_ENV === 'production';

const runLibs = (libs=[], shared=[]) => {
	const logEnd = log.time('libs');

	const browserify = require('browserify');
	const uglify = require("uglify-js");

	return new Promise((resolve, reject) => {
		const bundle = browserify({ paths: shared })
			.require(libs)
			.bundle((err, buf) => {
				if(err) return reject(err);
				let code = buf.toString();
				if(isProd){
					code = uglify.minify(buf.toString(), {fromString: true}).code;
				}
				fs.writeFile(`build/libs.js`, code, (err)=>{
					if(err) return reject(err);
					logEnd();
					return resolve();
				});
			});
	});
};

module.exports = addPartial(runLibs);