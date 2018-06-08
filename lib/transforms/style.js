const path  = require('path');
const Less = require('../utils/less.js');
const utils = require('../utils.js');
const assetTransform = require('./assets.js');

const styleTransform = module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		const requires = utils.regex(/require\(['"`]([\s\S]*?)['"`]\)/g, contents);
		let dependants = [];
		if(requires.length){
			const paths = opts.shared.concat(path.dirname(filepath));
			await requires.reduce((flow, match)=>{
				let [matchString, reqPath] = match;
				const requirePath = require.resolve(reqPath, { paths });
				return flow.then(async ()=>{
					if(styleTransform.test(requirePath)){
						dependants.push(requirePath);
						contents = contents.replace(matchString, '');
						return flow;
					}else{
						return flow.then(async ()=>{
							const newPath = await assetTransform.apply(requirePath, null, {pathOnly:true, ...opts});
							contents = contents.replace(matchString, `url('${newPath}')`);
						});
					}
				});
			}, Promise.resolve());
		}
		(requires.length
			? Less.add(opts.entry.name, filepath, contents, dependants)
			: Less.import(opts.entry.name, filepath, dependants)
		);
		return dependants.map((dep)=>`require('${dep.replace(/\\/g,"\\\\")}');`).join('\n');
	}
};