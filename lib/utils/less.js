const LessLib = require('less');
const log  = require('./log.js');
let Storage = {};

const Less = {
	import : (entrypoint, filepath)=>Less.add(entrypoint, filepath, `@import "${filepath}";`),
	add    : (entrypoint, filepath, code)=>{
		Storage[entrypoint] = Storage[entrypoint] || {};
		Storage[entrypoint][filepath] = code;
	},
	process : async (entrypoint, filepath, contents, opts)=>{
		return new Promise((resolve, reject)=>{

			LessLib.render(lessCode, lessOpts, (err, res) => err ? reject(err) : resolve(res.css));
		})
		.catch((err)=>{
			//TODO: Remove plz
			console.log('util/less.js');
			log.styleError(err);
			throw err;
		});
	},
	compile : (entrypoint, filepath)=>{

	},
	flush  : (entrypoint)=>Storage[entrypoint]={},
	render : async (entrypoint, lessOpts)=>{
		return new Promise((resolve, reject)=>{
			const lessCode = Object.values(Storage[entrypoint]).join('\n');
			LessLib.render(lessCode, lessOpts, (err, res) => err ? reject(err) : resolve(res.css));
		})
		.catch((err)=>{
			//TODO: Remove plz
			console.log('util/less.js');
			log.styleError(err);
			throw err;
		});
	}
};
module.exports = Less;