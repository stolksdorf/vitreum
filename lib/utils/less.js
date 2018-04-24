const Less = require('less');
const Storage = require('./storage.js');
const log = require('./log.js');

module.exports = {
	import : (filepath)=>Storage.less(filepath, `@import "${filepath}";`),
	add    : (filepath, code)=>Storage.less(filepath, code),
	flush  : ()=>Storage.less(false),
	render : async (lessOpts)=>{
		return new Promise((resolve, reject)=>{
			const lessCode = Object.values(Storage.less()).join('\n');
			Less.render(lessCode, lessOpts, (err, res) => err ? reject(err) : resolve(res.css));
		})
		.catch((err)=>{
			console.log('util/less.js');
			log.styleError(err);
			throw err;
		});
	}
}