const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');

const utils     = require('./lib/utils.js');
const renderer  = require('./lib/renderer.js');
const transform = require('./lib/transforms');
const getOpts   = require('./lib/getopts.js');
const log       = require('./lib/utils/log.js');
const Less      = require('./lib/utils/less.js');


let Libs = {
	'react-dom' : '',
	'react'     : ''
};
const bundleEntryPoint = async (entryPoint, Opts)=>{
	let opts = Object.assign({
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	}, Opts);
	const endLog = log.buildEntryPoint(opts.entry, opts.prod);


	const paths = utils.paths(opts.paths, opts.entry.name);
	const bundler = browserify({
			standalone    : opts.entry.name,
			paths         : opts.shared,
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>{
				if(utils.shouldBundle(filepath, id, opts)) return true;
				Libs[id] = filepath;
				return false;
			}
		})
		.require(entryPoint)
		.transform((file)=>transform(file, opts), {global: true});

	if(opts.prod) bundler.transform('uglifyify', {global : true});

	await fse.ensureDir(paths.entry);
	await utils.bundle(bundler)
		.then((code)=>fse.writeFile(paths.code, code))
		.catch((err)=>{
			console.log('BUNDLE ERR', err);
		})
	await Less.compile(opts).then((css)=>fse.writeFile(paths.style, css));
	await renderer(opts);

	if(opts.static){
		console.log('should run static222');
		console.log(paths);
		const temp = utils.require(paths.render)
		console.log(temp);

		await fse.writeFile(paths.static, utils.require(paths.render)())
			.then(()=>{
				console.log(`Built the static file`);
			})
	}



	endLog();
};

//TODO: add a relative file weight for each lib
const bundleLibs = async (opts)=>{
	const logEnd = log.libs(Libs, opts.prod);
	const libBundler = browserify().require(Object.keys(Libs));
	const paths = utils.paths(opts.paths);
	if(opts.prod){
		libBundler.transform('uglifyify', {global : true});
	}
	return utils.bundle(libBundler)
		.then((code)=>fse.writeFile(paths.libs, code))
		.then(logEnd);
};

module.exports = async (entryPoints, opts)=>{
	opts = getOpts(opts, entryPoints);
	log.beginBuild(opts);

	//const paths = utils.paths(opts.paths, opts.entry.name);

	await fse.emptyDir(opts.paths.build);
	await opts.targets.reduce((flow, ep)=>flow.then(()=>bundleEntryPoint(ep, opts)), Promise.resolve());
	await bundleLibs(opts);

};