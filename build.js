const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');

const utils     = require('./lib/utils.js');
const renderer = require('./lib/renderer.js');
const transform = require('./lib/transforms');
const getDefaultOpts   = require('./lib/default.opts.js');
const log      = require('./lib/utils/log.js');
const Less = require('./lib/utils/less.js');

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
	const endLog = log.buildEntryPoint(opts.entry);

	const paths = utils.paths(opts.paths, opts.entry.name);
	const bundler = browserify({
			standalone    : opts.entry.name,
			paths         : opts.shared,
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>{
				if(!filepath) throw `Error: Can not find: ${id}`; //TODO: remove
				if(filepath.indexOf('node_modules') == -1) return true;
				Libs[id] = filepath;
				return false;
			}
		})
		.require(entryPoint)
		.transform((file)=>transform(file, opts))
		.transform('uglifyify');

	await fse.ensureDir(`${opts.paths.build}/${opts.entry.name}`);
	await utils.bundle(bundler).then((code)=>fse.writeFile(paths.code, code));
	await Less.render(opts.entry.name, {paths:opts.shared, compress:true}).then((css)=>fse.writeFile(paths.style, css));
	await renderer(opts);

	endLog();
};

const bundleLibs = async (opts)=>{
	const logEnd = log.libs(Libs);
	return utils.bundle(browserify()
		.require(Object.keys(Libs))
		//.transform('uglifyify', {global : true})
	)
	.then((code)=>fse.writeFile(`${opts.paths.build}/${opts.paths.libs}`, code))
	.then(logEnd);
};

module.exports = async (entryPoints, opts)=>{
	opts = getDefaultOpts(opts, entryPoints);
	log.beginBuild(opts);

	await fse.emptyDir(opts.paths.build);
	await opts.targets.reduce((flow, ep)=>flow.then(()=>bundleEntryPoint(ep, opts)), Promise.resolve());
	await bundleLibs(opts);
};