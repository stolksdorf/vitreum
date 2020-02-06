const path = require('path');
const log = require('./utils/log.js');
const match = require('minimatch');

const utils = {
	//appRoot : path.dirname(require.main.filename),
	appRoot : process.cwd(),
	require : (modPath)=>require(utils.resolve(modPath)),
	resolve : (modPath)=>require.resolve(path.resolve(utils.appRoot, modPath)),
	decache : (modPath)=>delete require.cache[utils.resolve(modPath)],

	paths : (paths, entryName='')=>{
		// return {
		// 	entry  : `${paths.build}/${entryName}`, //Maybe remove
		// 	code   : `${paths.build}/${entryName}/${paths.code}`,
		// 	style  : `${paths.build}/${entryName}/${paths.style}`,
		// 	render : `${paths.build}/${entryName}/${paths.render}`,
		// 	static : `${paths.build}/${entryName}/${paths.static}`,
		// 	libs   : `${paths.build}/${paths.libs}`
		// }

		return {
			entry  : path.join(paths.build, entryName),
			code   : path.join(paths.build, entryName, paths.code),
			style  : path.join(paths.build, entryName, paths.style),
			render : path.join(paths.build, entryName, paths.render),
			static : path.join(paths.build, entryName, paths.static),
			libs   : path.join(paths.build, paths.libs)
		}
	},


	bundle : async (bundler)=>{
		return new Promise((resolve, reject)=>bundler.bundle((err, buf) => err ? reject(err) : resolve(buf.toString())))
			.catch((err)=>{
				log.bundleError(err);
				throw err;
			})
	},
	regex : (pattern, source)=>{
		let result = [], match;
		do{
			match = pattern.exec(source);
			if(!match) continue;
			result.push(match);
		}while(match);
		return result;
	},

	shouldBundle : (filepath, modName, opts)=>{
		if(!filepath) {
			log.requireError(modName);
			return false;
		}
		const isLib = match(filepath, '**/node_modules/**');
		const bundle = opts.bundle.some((bundlePath)=>match(filepath, bundlePath))
		return !isLib || bundle;
	},
	getCaller : (offset=0)=>{
		const cache = Error.prepareStackTrace;
		Error.prepareStackTrace = (_, stack)=>stack;
		const target = (new Error()).stack[2+offset];
		Error.prepareStackTrace = cache;
		return {
			name : target.getFunctionName(),
			file : target.getFileName(),
			line : target.getLineNumber(),
			col  : target.getColumnNumber(),
		};
	}
};

module.exports = utils;