const babelify = async (code)=>(await require('@babel/core').transformAsync(code,{
	presets : ['@babel/preset-react']
})).code;

module.exports = {
	'.json' : (code, filename)=>`module.exports=${code};`,
	'.js' : (code, filename)=>babelify(code),
	'.jsx' : (code, filename)=>babelify(code),
	'*' : (code, filename)=>`module.exports=\`${code}\`;`
};
