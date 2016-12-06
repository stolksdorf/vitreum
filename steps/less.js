const _ = require('lodash');
const less = require('less');
const fs = require('fs');

//Change to just utils
//Add getRootDir(name)
//Add get deps

const storage = require('./utils/storage.js');
const log = require('./utils/timeLog.js');
const addPartial = require('./utils/addPartial.js');

const isProd = process.env.NODE_ENV === 'production';



/*
if(fs.existsSync(lessName)) {
	result.push('@import "' + lessName + '";')
}
*/


const getLessImports = (deps) => {
	return _.reduce(deps, (r, jsxFile)=>{
		const lessPath = jsxFile.replace('.jsx', '.less');
		try{
			fs.accessSync(lessPath, fs.constants.R_OK);
			r.push(`@import "${lessPath}";`);
		}catch(e){}
		return r;
	},[]).join('\n');
};


const runStyle = (name, shared, deps) => {
	const logEnd = log(`${name}[less]`);

	return new Promise((resolve, reject) => {
		//const deps = storage.deps(name);
		if(!shared && !deps) deps = shared;
		if(!deps) return reject(`Dependacies for '${name}' not set. Try running the js build first.`);

		less.render(getLessImports(deps),
			{
				//TODO: auto add node_modules?
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

module.exports = addPartial(runStyle);