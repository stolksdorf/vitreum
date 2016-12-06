const log = require('./utils/timeLog.js');
const addPartial = require('./utils/addPartial.js');

const fs = require('fs');
const browserify = require('browserify');
const uglify = require("uglify-js");

const isProd = process.env.NODE_ENV === 'production';


const runLibs = (libs=[], addPaths=[]) => {
	const logEnd = log('libs');
	return new Promise((resolve, reject) => {
		const bundle = browserify({ paths: addPaths })
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
			})
	});
};

module.exports = addPartial(runLibs);