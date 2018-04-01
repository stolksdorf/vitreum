const path = require('path');
const marked = require('marked');
const code = require('./code.transform.js');

module.exports = {
	name  : 'markdown',
	test  : (filepath)=>['.md'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{

		return code.apply(null, `const React = require('react');
module.exports = (props)=>{
	return <div {...props}>${marked(contents)}</div>;
};`, opts);
	}
};