const path  = require('path');
const yaml  = require('js-yaml');

const assetTransform = require('./asset.transform.js');

module.exports = {
	name : 'style',
	test  : (filepath)=>['.less', '.css'].includes(path.extname(filepath)),
	apply : (filepath, contents, ctx)=>{
		// find requires and replace them url after moving the files
		// potentially swap the order of the style files
		ctx.less = `@import "${filepath}";\n${ctx.less}`;
		return;
	}
};
