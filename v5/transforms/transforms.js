const path       = require('path');
const fse        = require('fs-extra');
const through    = require('through2');

/*
todo:
- update to through 2
- wrap into a function
- https://github.com/browserify/browserify-handbook#how-node_modules-works
- https://github.com/browserify/browserify-handbook#compiler-pipeline
*/


//TODO: bump all of these out into their own files
// https://github.com/stolksdorf/pico-transforms/blob/master/yamlify.js
const yaml = require('js-yaml');
var babel  = require('@babel/core');

const transforms = [
	//TODO: svg, md, json
	{
		name : 'libs',
		test  : (name, cxt)=>!!cxt.libs[name],
		apply : (name, contents)=>{},
	},
	//TODO: Apply bebl-core here, ensure it loads the config from package
	{
		name : 'js',
		test  : (name)=>['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(name)),
		apply : (name, contents)=>{
			return new Promise((resolve, reject)=>{
				babel.transform(contents, {
					// HACK: remove this when done testing
					// Potentially toggle this on context?
					// Add option to pass the entire bable config
					presets : ['@babel/preset-stage-3', '@babel/preset-react']
				}, (err, res)=>err ? reject(err) : resolve(res.code))
			});
		},
	},
	//TODO: Check to see if JSON just works out of the box
	// {
	// 	name : 'json',
	// 	test  : (name)=>['.json'].includes(path.extname(name)),
	// 	apply : (name, contents)=>`return ${contents}`,
	// },
	{
		name : 'yaml',
		test  : (name)=>['.yaml', '.yml'].includes(path.extname(name)),
		apply : (name, contents)=>`module.exports=${JSON.stringify(yaml.safeLoad(contents))}`,
	},
	{
		name : 'less',
		test  : (name)=>['.less', '.css'].includes(path.extname(name)),
		apply : (name, contents, cxt)=>{
			cxt.less = `@import "${name}";\n${cxt.less}`;
			return;
		},
	},
	{
		name : 'assets',
		test  : (name)=>true,
		apply : async (name, contents, cxt)=>{
			const assetPath = `/assets/${cxt.entry.name}/${path.relative(cxt.entry.dir, name)}`;
			await fse.ensureDir(path.dirname(`${cxt.build}${assetPath}`));
			await fse.copy(name, `${cxt.build}${assetPath}`);
			return `module.exports='${assetPath}';`
		}
	}
]



module.exports = (cxt, filename)=>{
	const transform = transforms.find((trans)=>trans.test(filename, cxt));

	if(!transform) return through();

	let contents = '';
	return through((chunk, enc, next)=>{ contents += chunk.toString(); next(); },
		async function (done) {
			console.log('  - parsing', path.basename(filename), contents.length);
			try{
				const res = await transform.apply(filename, contents, cxt);
				if(res) this.push(res);

			}catch(err){
				//TODO: Maybe throw here?
				console.log('Err', transform.name, err);
				this.emit('error', err);
			}
			done();
		}
	)
};