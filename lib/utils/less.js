const Less = require('less');
const Storage = require('./storage.js');
const log = require('./log.js');

let LessStorage = {};

const Less = {
	import : (entrypoint, filepath)=>Less.add(entrypoint, filepath, `@import "${filepath}";`),
	add    : (entrypoint, filepath, code)=>{
		LessStorage[entrypoint] = LessStorage[entrypoint] || {};
		LessStorage[entrypoint][filepath] = code;
	},
	flush  : (entrypoint)=>LessStorage[entrypoint]={},
	render : async (entrypoint, lessOpts)=>{
		return new Promise((resolve, reject)=>{
			const lessCode = Object.values(LessStorage[entrypoint]).join('\n');
			Less.render(lessCode, lessOpts, (err, res) => err ? reject(err) : resolve(res.css));
		})
		.catch((err)=>{
			console.log('util/less.js');
			log.styleError(err);
			throw err;
		});
	}
};

module.exports = Less;