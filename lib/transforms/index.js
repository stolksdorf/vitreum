const path       = require('path');
const through    = require('through2');

const transforms = [
	require('./litprog.transform.js'),
	require('./yaml.transform.js'),
	require('./svg.transform.js'),
	require('./markdown.transform.js'),
	require('./code.transform.js'),
	require('./style.transform.js'),
	require('./asset.transform.js'),
];

//Make this return an array with a built in functipon to run it.

module.exports = (filename, opts)=>{
	const transform = transforms.find((trans)=>trans.test(filename, opts));
	if(!transform) return through();
	let contents = '';
	return through((chunk, enc, next)=>{ contents += chunk.toString(); next(); },
		async function (done) {
			//console.log('  - parsing', path.basename(filename), contents.length);
			//console.log('  - parsing', filename, contents.length);
			try{
				const res = await transform.apply(filename, contents, opts);
				if(res) this.push(res);
			}catch(err){
				this.emit('error', err);
			}
			done();
		}
	)
};