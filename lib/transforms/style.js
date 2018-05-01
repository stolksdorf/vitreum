const path  = require('path');
const Less = require('../utils/less.js');
const utils = require('../utils.js');
const assetTransform = require('./assets.js');

const styleTransform = module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		const requires = utils.regex(/require\(['"`]([\s\S]*?)['"`]\)[;]?/g, contents);
		let dependants = [];
		if(requires.length){
			await requires.reduce((flow, match)=>{
				let [matchString, reqPath] = match;
				dependants.push(`require('${reqPath}');`);
				if(styleTransform.test(reqPath)){
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
		(requires.length
			? Less.add(opts.entry.name, filepath, contents)
			: Less.import(opts.entry.name, filepath)
		);
		return dependants.join('\n');
	}
};
