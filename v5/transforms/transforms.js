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


const yaml = require('js-yaml');


const transforms = [
	{
		name : 'Libs',
		test  : (name, cxt)=>!!cxt.libs[name],
		apply : (name, contents)=>{},
	},
	{
		name : 'YAML',
		test  : (name)=>['.yaml', '.yml'].includes(path.extname(name)),
		apply : (name, contents)=>`return ${JSON.stringify(yaml.safeLoad(contents))}`,
	},
	{
		name : 'Less',
		test  : (name)=>['.less', '.css'].includes(path.extname(name)),
		apply : (name, contents, cxt)=>{
			cxt.less = `@import "${name}";\n${cxt.less}`;
			return;
		},
	},
	{
		name : 'Assets',
		test  : (name)=>path.extname(name) == '.txt',
		apply : async (name, contents, cxt)=>{
			const assetPath = `/assets/${cxt.entry.name}/${path.relative(cxt.entry.dir, name)}`;
			await fse.ensureDir(path.dirname(`${cxt.build}${assetPath}`));
			await fse.copy(name, `${cxt.build}${assetPath}`);
			return `return '${assetPath}';`
		}
	}
]


module.exports = (cxt, filename)=>{
	console.log('___________________');
	console.log('handling', filename);

	const transform = transforms.find((trans)=>trans.test(filename, cxt));

	if(!transform){
		//console.log('No transofrm that matches', filename);
		return through();
	}

	let contents = '';
	return through((chunk, enc, next)=>{ contents += chunk.toString(); next(); },
		async function (done) {
			//console.log('Parsing', filename);
			try{
				const res = await transform.apply(filename, contents, cxt);
				if(res) this.push(res);

			}catch(err){
				//TODO: Maybe throw here?
				console.log('Err', transform.name, err);
				this.emit('error', err);
				return;
			}
			done();
		}
	)
};