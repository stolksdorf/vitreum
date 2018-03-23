const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'litprog',
	//TODO: .lp.md won't work
	test  : (filepath)=>['.lp', '.lp.md'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{

	}
}