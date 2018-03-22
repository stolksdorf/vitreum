const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'litprog',
	test  : (filepath)=>['.lp'].includes(path.extname(filepath)),
	apply : async (filepath, contents, ctx)=>{

	}
}