const path       = require('path');
const through    = require('through2');

const Transforms = [
	require('./json.js'),
	require('./litprog.js'),
	require('./yaml.js'),
	require('./svg.js'),
	require('./text.js'),
	require('./code.js'),
	require('./style.js'),
	require('./assets.js'),
];

module.exports = (filename, opts, transforms=Transforms)=>{
	const transform = transforms.find((trans)=>trans.test(filename, opts));
	if(!transform) return through();
	let contents = '';
	return through((chunk, enc, next)=>{ contents += chunk.toString(); next(); },
		async function (done) {
			//console.log('parsing', filename);
			try{
				const res = await transform.apply(filename, contents, opts);
				if(res) this.push(res);
			}catch(err){
				//console.log('TRANSFORM ERR', err);
				this.emit('error', err);
			}
			done();
		}
	)
};