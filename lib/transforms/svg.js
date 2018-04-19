const path = require('path');
const fse  = require('fs-extra');

// https://github.com/stolksdorf/pico-transforms/blob/master/svgify.js

module.exports = {
	name : 'svg',
	test  : (filepath)=>['.svg'].includes(path.extname(filepath)),
	apply : async (filepath, contents, ctx)=>{

	}
}