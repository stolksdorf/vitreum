const path  = require('path');
const babel = require('@babel/core');

module.exports = {
	name : 'js',
	test  : (filepath)=>['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(filepath)),
	apply : (filepath, contents, ctx)=>{
		return new Promise((resolve, reject)=>{
			babel.transform(contents, {
				// HACK: remove this when done testing
				// Potentially toggle this on context?
				// Add option to pass the entire bable config
				presets : ['@babel/preset-stage-3', '@babel/preset-react']
			}, (err, res)=>err ? reject(err) : resolve(res.code))
		});
	}
};