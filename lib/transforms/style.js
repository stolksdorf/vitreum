const path  = require('path');

const Less = require('../utils/less.js');
const utils = require('../utils.js');
const assetsTransform = require('./assets.js');

module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		const requires = utils.regex(/require\(['"`]([\s\S]*?)['"`]\)/g, contents);
		if(requires.length){
			await requires.reduce((flow, match)=>{
				const requirePath = path.resolve(opts.entry.dir, match[1]);
				//TODO: Match against assets and less transforms
				return flow.then(async ()=>{
					const newPath = await assetTransform.apply(requirePath, false, {raw:true, ...opts});
					contents = contents.replace(match[0], `url('${newPath}')`);
				});
			}, Promise.resolve());
		}
		if(requires.length || opts.raw){
			Less.add(opts.entry.name, filepath, contents);
		}else{
			Less.import(opts.entry.name, filepath);
		}
		return;
	}
};
