const path = require('path');
const log = require('./utils/log.js');
const match = require('minimatch');

const utils = {
	//appRoot : path.dirname(require.main.filename),
	appRoot : process.cwd(),
	require : (modPath)=>require(utils.resolve(modPath)),
	resolve : (modPath)=>require.resolve(path.resolve(utils.appRoot, modPath)),
	decache : (modPath)=>delete require.cache[utils.resolve(modPath)],

	paths : (paths, entryName)=>{
		return {
			entry  : `${paths.build}/${entryName}`, //Maybe remove
			code   : `${paths.build}/${entryName}/${paths.code}`,
			style  : `${paths.build}/${entryName}/${paths.style}`,
			render : `${paths.build}/${entryName}/${paths.render}`,
			static : `${paths.build}/${entryName}/${paths.static}`,
			libs   : `${paths.build}/${paths.libs}`
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

	shouldBundle : (modPath, opts)=>{
		const isLib = match(modPath, '**/node_modules/**');
		const bundle = opts.bundle.some((bundlePath)=>match(modPath, bundlePath))
		return !isLib || bundle;
	}
};

module.exports = utils;