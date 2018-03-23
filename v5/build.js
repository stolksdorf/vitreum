const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');

const utils     = require('./utils.js');
const generator = require('./generator.js');
const transform = require('./transforms');
const getOpts   = require('./default.opts.js');

let Libs = {
	'react-dom' : '',
	'react'     : ''
};
const bundleEntryPoint = async (entryPoint, Opts)=>{
	let opts = Object.assign({
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	}, Opts);

	const bundler = browserify({
			standalone    : opts.entry.name,
			paths         : opts.shared,
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>{
				if(!filepath) throw `can not find: ${id}`; //TODO: remove
				if(filepath.indexOf('node_modules') == -1) return true;
				Libs[id] = filepath;
				return false;
			}
		})
		.require(entryPoint)
		.transform((file)=>transform(file, opts))
		.transform('uglifyify');

	const paths = utils.paths(opts.paths, opts.entry.name);
	await fse.ensureDir(`${opts.paths.build}/${opts.entry.name}`);
	await utils.bundle(bundler).then((code)=>fse.writeFile(paths.code, code));
	await utils.lessRender(opts.less, {paths:opts.shared, compress:true}).then((css)=>fse.writeFile(paths.style, css))
	await generator(opts);
};

const bundleLibs = async (opts)=>{
	console.log('Building Libs', Object.keys(Libs));
	return utils.bundle(browserify()
		.require(Object.keys(Libs))
		//.transform('uglifyify', {global : true})
	).then((code)=>fse.writeFile(`${opts.paths.build}/${opts.paths.libs}`, code));
};

module.exports = async (entryPoints, opts)=>{
	opts = getOpts(opts, entryPoints);
	await fse.emptyDir(opts.paths.build);
	await Promise.all(opts.targets.map((ep)=>bundleEntryPoint(ep, opts)));
	await bundleLibs(opts);
};