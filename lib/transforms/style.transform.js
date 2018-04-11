const path  = require('path');
const yaml  = require('js-yaml');

const Less = require('../utils/less.js');

const assetTransform = require('./asset.transform.js');

//TODO: Make a less util that allows you to add LESS code to a cache and flush and save
//FIXME: rmeove the need for opts mutation
module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : (filepath, contents, opts)=>{
		// find requires and replace them url after moving the files
		// potentially swap the order of the style files
		// require\('([\s\S]*?)'\)

		//If detect any requires, run asset tranform with opts. chop off the module.exports= and wrap result in url()

		//TODO: figure out how to do the asset transform while maintaining the sourcemaps
		//

		//FIXME: Check to see if there's a filepath first before doing this
		//const less = require('./less.util.js')
		//less.add(`@import "${filepath}";\n${opts.less}`);

		if(!filepath){
			Less.add(contents);
		}else{
			Less.import(filepath);
		}
		return;
	}
};
