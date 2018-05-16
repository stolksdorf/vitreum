const path  = require('path');

module.exports = {
	name : 'json',
	test  : (filepath)=>['.json'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		return `module.exports=${contents}`;
	}
};