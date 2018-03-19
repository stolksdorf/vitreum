const path = require('path');
const fse  = require('fs-extra');

// https://github.com/stolksdorf/pico-transforms/blob/master/svgify.js

module.exports = {
	name : 'markdown',
	test  : (filepath)=>['.md'].includes(path.extname(filepath)),
	apply : async (filepath, contents, ctx)=>{

	}
}