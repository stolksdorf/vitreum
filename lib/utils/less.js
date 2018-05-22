const path = require('path');
const LessLib = require('less');
const log  = require('./log.js');

const rel = (filepath)=>path.relative(process.cwd(), filepath);

let Storage = {};

const clearLessCache = ()=>{
	const fileManagers = LessLib.environment && LessLib.environment.fileManagers || [];
	fileManagers.forEach((fileManager)=>{
		if(fileManager.contents) fileManager.contents = {};
	});
};
const getStorage = (entrypoint)=>{
	if(Storage[entrypoint]) return Storage[entrypoint];
	Storage[entrypoint] = {
		deps : {},
		code : {},
		order : []
	};
	return Storage[entrypoint];
};
const getCode = (entrypoint)=>{
	const store = getStorage(entrypoint);
	let haveCompiled = new Set();
	let resultCode = '';
	const runDep = (filepath)=>{
		if(haveCompiled.has(filepath)) return;
		store.deps[filepath].map(runDep);
		resultCode = `${resultCode}\n${store.code[filepath]}`;
		haveCompiled.add(filepath);
	};
	store.order.map(runDep);
	return resultCode;
};

const Less = {
	flush  : (entrypoint)=>Storage[entrypoint]={},
	import : (entrypoint, filepath, deps=[])=>{
		Less.add(entrypoint, filepath, `@import "${filepath}";`, deps);
	},
	add    : (entrypoint, filepath, code, deps=[])=>{
		const store = getStorage(entrypoint);
		if(!store.deps[filepath]) store.order.push(filepath);
		store.code[filepath] = `/** ${rel(filepath)} **/\n${code}\n`;
		store.deps[filepath] = deps;
	},
	compile : async (opts)=>{
		clearLessCache();
		return LessLib.render(getCode(opts.entry.name), {
				paths     : opts.shared,
				compress  : !opts.dev,
				sourceMap : (opts.dev ? {sourceMapFileInline: true, outputSourceFiles: true} : false)
			})
			.then((res)=>res.css)
			.catch((err)=>{
				log.styleError(err);
				throw err;
			});
	},
};
module.exports = Less;