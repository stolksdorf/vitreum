const path = require('path');
const marked = require('marked');
const code = require('./code.js');

//TODO: Possibly just make this raw text
//TODO: Rename transform to text transform


module.exports = {
	name  : 'markdown',
	test  : (filepath)=>['.md'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		const res = marked(contents).replace(/`/g, '\\`');
		return code.apply(null, `const React = require('react');
module.exports = (props)=>{
	return <div {...props} dangerouslySetInnerHTML={{__html:\`${res}\`}} />;
};`, opts);
	}
};