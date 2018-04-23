const Less = require('less');
const Storage = require('./storage.js');
const log = require('./log.js');

module.exports = {
	import : (filepath)=>Storage.less(`@import "${filepath}";`),
	add    : (code)=>Storage.less(code),
	render : async (lessOpts)=>{
		return new Promise((resolve, reject)=>{
			const lessCode = Storage.less().join('\n');
			Storage.less(false);
			Less.render(lessCode, lessOpts, (err, res) => err ? reject(err) : resolve(res.css));
		})
		.catch((err)=>{
			console.log('util/less.js');
			log.styleError(err);
			throw err;
		});
	}
}