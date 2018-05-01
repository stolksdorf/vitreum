const path = require('path');
const LessLib = require('less');
const log  = require('./log.js');

const rel = (filepath)=>path.relative(process.cwd(), filepath);

let Storage = {};

const Less = {
	flush  : (entrypoint)=>Storage[entrypoint]={},
	import : (entrypoint, filepath)=>{
		Storage[entrypoint] = Storage[entrypoint] || {};
		Storage[entrypoint][filepath] = `@import "${filepath}";`;
	},
	add    : (entrypoint, filepath, code)=>{
		Storage[entrypoint] = Storage[entrypoint] || {};
		Storage[entrypoint][filepath] = `/** ${rel(filepath)} **/\n${code}\n`;
	},
	// process : async (entrypoint, filepath, contents, opts)=>{
	// 	return new Promise((resolve, reject)=>{
	// 		LessLib.render(contents, {
	// 			paths     : opts.shared,
	// 			compress  : opts.dev,
	// 			sourceMap : opts.dev ? {} : false
	// 		},(err, res) => err ? reject(err) : resolve(res));
	// 	})
	// 	.then((output)=>{
	// 		Storage[entrypoint] = Storage[entrypoint] || {};
	// 		Storage[entrypoint][filepath] = output;
	// 	})
	// 	.catch((err)=>{
	// 		//TODO: Remove plz
	// 		console.log('util/less.js');
	// 		log.styleError(err);
	// 		throw err;
	// 	});
	// },
	compile : async (opts)=>{
		return new Promise((resolve, reject)=>{
			const lessCode = Object.values(Storage[opts.entry.name]).join('\n');
			LessLib.render(lessCode, {
				paths     : opts.shared,
				compress  : !opts.dev,
				sourceMap : (opts.dev ? {sourceMapFileInline: true, outputSourceFiles: true} : false)
			}, (err, res) =>err ? reject(err) : resolve(res.css));
		})
		.catch((err)=>{
			//TODO: Remove plz
			console.log('util/less.js');
			log.styleError(err);
			throw err;
		});
	},
	// render : async (entrypoint, lessOpts)=>{
	// 	return new Promise((resolve, reject)=>{
	// 		const lessCode = Object.values(Storage[entrypoint]).join('\n');
	// 		LessLib.render(lessCode, lessOpts, (err, res) =>err ? reject(err) : resolve(res.css));
	// 		// LessLib.render(lessCode, lessOpts, (err, res) => {
	// 		// 	if(err) return reject(err);
	// 		// 	return resolve(res.css)
	// 		// });
	// 	})
	// 	.catch((err)=>{
	// 		//TODO: Remove plz
	// 		console.log('util/less.js');
	// 		log.styleError(err);
	// 		throw err;
	// 	});
	// }
};
module.exports = Less;