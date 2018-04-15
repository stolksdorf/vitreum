const path  = require('path');

const Less = require('../utils/less.js');
const utils = require('../utils.js');
const assetTransform = require('./asset.transform.js');

module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		const requires = utils.regex(/require\(['"`]([\s\S]*?)['"`]\)/g, contents);
		if(requires.length){
			await requires.reduce((flow, match)=>{
				const requirePath = path.resolve(opts.entry.dir, match[1]);
				return flow.then(async ()=>{
					const newPath = await assetTransform.apply(requirePath, false, {raw:true, ...opts});
					contents = contents.replace(match[0], `url('${newPath}')`);
				});
			}, Promise.resolve());
		}
		if(!filepath || requires.length){
			Less.add(contents);
		}else{
			Less.import(filepath);
		}
		return;
	}
};
