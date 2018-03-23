const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'markdown',
	test  : (filepath)=>['.md'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{

	}
}