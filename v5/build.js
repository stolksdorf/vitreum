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
const bundleEntryPoint = async (entryPoint, opts)=>{
	//IDEA: fold the per- entrypoint ctx into the opts, and pass those around
		//Replace the opts paths with the utils paths
	let ctx = {
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	};
	const paths = utils.paths(opts.paths, ctx.entry.name);
	const bundler = browserify({
			standalone    : ctx.entry.name,
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
		.transform((file)=>transform(ctx, file))
		.transform('uglifyify');

	await fse.ensureDir(`${opts.paths.build}/${ctx.entry.name}`);
	await utils.bundle(bundler).then((code)=>fse.writeFile(paths.code, code));
	await utils.lessRender(ctx.less, {paths: opts.shared,compress: true}).then((css)=>fse.writeFile(paths.style, css))
	await generator(ctx, opts);
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