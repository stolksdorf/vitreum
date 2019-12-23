const utils = require('./utils.js');
const path  = require('path');
const fs    = require('fs');

const getPckg = (currPath = path.resolve(''))=>{
	const pckg = path.join(currPath, 'package.json');
	if(fs.existsSync(pckg)) return utils.require(pckg);
	const info = path.parse(currPath);
	if(info.root == info.dir) return {};
	return getPckg(info.dir);
};
const pckg = getPckg();
const packageOpts = pckg.vitreum || {};

const defaultOpts = {
	prod     : undefined,
	shared   : ['./client'],
	targets  : [],
	app      : pckg.main || undefined,
	dev      : false,
	embed    : false,
	static   : false,
	template : false,
	rootPath : '',
	transformLibs : false,
	babel    : pckg.babel,
	bundle   : [],
	packagesToTransform : [],
	paths  : {
		build  : './build',
		code   : 'bundle.js',
		style  : 'bundle.css',
		render : 'render.js',
		//static : 'static.html',
		static : 'index.html',
		libs   : 'libs.js'
	}
}

const validate = (opts)=>{
	if(!opts.targets || !opts.targets.length) throw 'No build targets specified';
	//if(!opts.app) throw `A app entry point has not been specified. Set 'main' in your package.json`;
	if(!process.env.NODE_ENV) throw `NODE_ENV environment variable not set. If this is your development machine, we suggest setting it to 'local'`;

	if(opts.packagesToTransform.length){
		opts.bundle = opts.bundle.concat(opts.packagesToTransform
			.map((packageName)=>`**/node_modules/${packageName}/**`));
	}
	return opts;
}

module.exports = (opts, targets)=>{
	opts = Object.assign({}, defaultOpts, packageOpts, opts);
	opts.paths = Object.assign({}, defaultOpts.paths, packageOpts.paths, opts.paths);
	opts.targets = targets || opts.targets || packageOpts.targets || defaultOpts.targets;
	opts.prod = (typeof opts.prod == 'undefined'
		? (process.env.NODE_ENV || '').toLowerCase() == 'production'
		: opts.prod
	)

	if(typeof opts.targets == 'string') opts.targets = [opts.targets];
	opts.targets = opts.targets.map((target)=>path.resolve(process.cwd(), target));

	if(typeof opts.template == 'string') opts.template = utils.require(opts.template);
	if(!opts.template) opts.template = require('./templates/html.js');

	if(opts.app) opts.app = path.resolve(process.cwd(), opts.app);
	return validate(opts);
}