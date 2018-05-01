const path  = require('path');

const Less = require('../utils/less.js');
const utils = require('../utils.js');
const assetTransform = require('./assets.js');

const styleTransform = module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		let res = [];
		const requires = utils.regex(/require\(['"`]([\s\S]*?)['"`]\)/g, contents);

		//console.log('less', requires);

		//TODO: Try and run the less process immediately, have the less file store the store maps
		// Try and re-build them together

		if(requires.length){
			await requires.reduce((flow, match)=>{
				let [matchString, reqPath] = match;
				res.push(`require('${reqPath}');`);

				if(styleTransform.test(reqPath)){
					//remove the whole refernce from the file
					// return the require staement at the end
					//I think that's it? Only if the transform gets hit on it
					//
					contents = contents.replace(matchString, '');
					return flow;
				}else{
					return flow.then(async ()=>{
						const requirePath = path.resolve(opts.entry.dir, reqPath);
						const newPath = await assetTransform.apply(requirePath, false, {pathOnly:true, ...opts});
						contents = contents.replace(matchString, `url('${newPath}')`);
					});
				}
			}, Promise.resolve());
		}
		Less.add(opts.entry.name, filepath, contents)



		// if(requires.length || opts.raw){
		// 	Less.add(opts.entry.name, filepath, contents);
		// }else{
		// 	Less.import(opts.entry.name, filepath);
		// }
		return res.join('\n');
	}
};
