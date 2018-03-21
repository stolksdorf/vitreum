const path = require('path');

const utils = {
	//appRoot : path.dirname(require.main.filename),
	appRoot        : process.cwd(),
	require        : (modPath)=>require(utils.requireResolve(modPath)),
	requireResolve : (modPath)=>require.resolve(path.resolve(utils.appRoot, modPath)),
	decache        : (modPath)=>delete require.cache[utils.requireResolve(modPath)],

	bundle : async (bundler)=>{
		return new Promise((resolve, reject)=>bundler.bundle((err, buf) => err ? reject(err) : resolve(buf.toString())));
	},
	lessRender : async (less, opts)=>{
		return new Promise((resolve, reject)=>{
			require('less').render(less, opts, (err, res) => err ? reject(err) : resolve(res.css));
		});
	},
	paths : (entryName, paths)=>{
		return {
			code   : `${paths.build}/${entryName}/${paths.code}`,
			style  : `${paths.build}/${entryName}/${paths.style}`,
			render : `${paths.build}/${entryName}/${paths.render}`,
			static : `${paths.build}/${entryName}/${paths.static}`,
			libs   : `${paths.build}/${paths.libs}`'
		}
	}
};

module.exports = utils;