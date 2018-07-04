const path  = require('path');
const babel = require('@babel/core');

module.exports = {
	name : 'code',
	test  : (filepath)=>['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(filepath)),
	apply : async (filepath, contents, opts)=>{
		return new Promise((resolve, reject)=>{
			babel.transform(contents, opts.babel, (err, res)=>err ? reject(err) : resolve(res.code))
		});
	}
};