const path  = require('path');
const yaml  = require('js-yaml');

const assetTransform = require('./asset.transform.js');

module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : (filepath, contents, opts)=>{
		// find requires and replace them url after moving the files
		// potentially swap the order of the style files
		// require\('([\s\S]*?)'\)

		//TODO: figure out how to do the asset transform while maintaining the sourcemaps
		//

		opts.less = `@import "${filepath}";\n${opts.less}`;
		return;
	}
};
