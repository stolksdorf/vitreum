const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

const isProd = process.env.NODE_ENV === 'production';


const getLessImports = (deps) => {
	return _.reduce(deps, (r, depFilename)=>{
		if(path.extname(depFilename) !== '.jsx') return r;
		const lessPath = depFilename.replace('.jsx', '.less');
		try{
			fs.accessSync(lessPath, fs.constants.R_OK);
			r.unshift(`@import "${lessPath}";`);
		}catch(e){}
		return r;
	},[]).join('\n');
};


const runStyle = (name, shared, deps) => {
	const logEnd = log.time(`less[${name}]`);

	const less = require('less');

	return new Promise((resolve, reject) => {
		if(!shared && !deps) deps = shared;
		if(!deps) return reject(log.noDeps(name));

		less.render(getLessImports(deps), {
				paths: _.concat(['./node_modules'], shared),
				filename: `${name}.less`,
				compress: isProd,
				sourceMap: {sourceMapFileInline: !isProd}
			},
			(err, res) => {
				if(err){
					log.lessError(err);
					return reject(err);
				}
				fs.writeFile(`build/${name}/bundle.css`, res.css, (err)=>{
					if(err) return reject(err);
					logEnd();
					return resolve();
				});
			});
	});
};

module.exports = addPartial(runStyle);