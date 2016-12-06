const _ = require('lodash');

//Change to just utils
//Add getRootDir(name)
//Add get deps

const storage = require('./utils/storage.js');
const log = require('./utils/timeLog.js');

const isProd = process.env.NODE_ENV === 'production';

const less = require('less');

const fs = require('fs');


/*
if(fs.existsSync(lessName)) {
	result.push('@import "' + lessName + '";')
}
*/


const getLessImports = (name) => {
	return _.reduce(_.keys(storage.get(name)), (r, jsxFile)=>{
		const lessPath = jsxFile.replace('.jsx', '.less');
		try{
			fs.accessSync(lessPath, fs.constants.R_OK);
			r.push(`@import "${lessPath}";`);
		}catch(e){}
		return r;
	},[]).join('\n');
};


const runStyle = (name, shared=[]) => {

	const logEnd = log(`${name}[less]`);




	return new Promise((resolve, reject) => {

		var file = getLessImports(name);

		less.render(file,
			{
				//auto add node_modules?
				paths: shared,  // Specify search paths for @import directives
				filename: `${name}.less`, // Specify a filename, for better error messages
				compress: isProd,

				sourceMap: {sourceMapFileInline: !isProd}
			},
			(err, res) => {


				if(err){
					console.log('err', err);
					return reject(err);
				}

			fs.writeFile(`build/${name}/bundle.css`, res.css, (err)=>{
				logEnd();
				return resolve();
			});
		})

	});
};

module.exports = runStyle;