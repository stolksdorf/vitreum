const path  = require('path');
const yaml = require('js-yaml');

module.exports = {
	name : 'yaml',
	test  : (filepath)=>['.yaml', '.yml'].includes(path.extname(filepath)),
	apply : (filepath, contents, opts)=>`module.exports=${JSON.stringify(yaml.safeLoad(contents))}`
};
