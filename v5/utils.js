const path = require('path');

const utils = {
	appRoot : path.dirname(require.main.filename),
	require(modPath){
		return require(utils.requireResolve(modPath))
	},
	requireResolve(modPath){
		return require.resolve(path.resolve(utils.appRoot, modPath))
	},
	decache(modPath){
		delete require.cache[utils.requireResolve(modPath)]
	}
};

module.exports = utils;