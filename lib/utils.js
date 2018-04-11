const path = require('path');
const log = require('./utils/log.js');

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




	isLib : (modPath, opts)=>{
		//TODO: add flag to exclude some paths from this check.
		// Also exclude already bundles/built files

		return modPath.indexOf('node_modules') == -1
	}
};

module.exports = utils;