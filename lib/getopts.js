const utils = require('./utils.js');
const path = require('path');
const fs   = require('fs');

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
	shared   : ['./client'],
	targets  : [],
	app      : pckg.main,
	dev      : false,
	embed    : false,
	static   : false,
	template : false,
	babel    : undefined,
	paths  : {
		build  : './build',
		code   : 'bundle.js',
		style  : 'bundle.css',
		render : 'render.js',
		static : 'static.html',
		libs   : 'libs.js'
	}
}

const validate = (opts)=>{
	if(!opts.targets || !opts.targets.length) throw 'No build targets specified';
	if(!opts.app) throw `A app entry point has not been specified. Set 'main' in your package.json`;
	return opts;
}

module.exports = (opts, targets = [])=>{
	opts = Object.assign({}, defaultOpts, packageOpts, opts);
	opts.paths = Object.assign({}, defaultOpts.paths, packageOpts.paths, opts.paths);

	opts.targets = targets.concat(opts.targets);
	if(typeof opts.targets == 'string') opts.targets = [opts.targets];
	opts.targets = opts.targets.map((target)=>path.resolve(process.cwd(), target));

	if(typeof opts.template == 'string') opts.template = utils.require(opts.template);
	if(!opts.template) opts.template = require('./templates/html.js');

	opts.app = path.resolve(process.cwd(), opts.app);
	return validate(opts);
}