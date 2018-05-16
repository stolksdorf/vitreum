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
	compile : async (opts)=>{
		return new Promise((resolve, reject)=>{
			if(!Storage[opts.entry.name]) return resolve('');
			const lessCode = Object.values(Storage[opts.entry.name]).join('\n');
			LessLib.render(lessCode, {
				paths     : opts.shared,
				compress  : !opts.dev,
				sourceMap : (opts.dev ? {sourceMapFileInline: true, outputSourceFiles: true} : false)
			}, (err, res) =>err ? reject(err) : resolve(res.css));
		})
		.catch((err)=>{
			log.styleError(err);
			throw err;
		});
	},
};
module.exports = Less;