const path  = require('path');
const yaml = require('js-yaml');
const utils = require('../utils.js');

const assetTransform = require('./assets.js');


const processRequires = async (filepath, contents, opts, func)=>{
	const requires = utils.regex(/require\(['"`]([\s\S]*?)['"`]\)/g, contents);
	if(requires.length){
		const paths = opts.shared.concat(path.dirname(filepath));
		return await requires.reduce((flow, match)=>{
			let [matchString, reqPath] = match;
			const requirePath = require.resolve(reqPath, { paths });
			return flow.then(async (content)=>{
				const replace = await func(requirePath);
				return content.replace(matchString, replace);
			})
		}, Promise.resolve(contents));
	}
	return contents;
};

module.exports = {
	name : 'yaml',
	test  : (filepath)=>['.yaml', '.yml'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{

		contents = await processRequires(filepath, contents, opts, async (requirePath)=>{
			if(assetTransform.test(requirePath)){
				return await assetTransform.apply(requirePath, null, {pathOnly:true, ...opts});
			}
			return requirePath;
		});

		return `module.exports=${JSON.stringify(yaml.safeLoad(contents))}`
	}
};