const path = require('path');
const code = require('./code.js');

module.exports = {
	name  : 'text',
	test  : (filepath)=>['.md', '.txt', '.markdown'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		return code.apply(null, `module.exports = \`${contents.replace(/`/g, '\\`')}\`;`, opts);
	}
};