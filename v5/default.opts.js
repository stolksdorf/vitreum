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

//console.log('packageOpts', packageOpts);

//???
const applyToOpts = (obj)=>{
	Object.keys(opts).map((key)=>{
		if(typeof obj[key] !== 'undefined') opts[key] = obj[key];
	});
};

const defaultOpts = {
	shared : ['./client'],
	app    : pckg.main,
	dev    : false,
	embed  : false,
	static : false,
	template : false,
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
	if(!opts.app) throw 'A app entry point has not been specified';
}

module.exports = (opts, targets)=>{
	//TODO: might need a smarter assign
	opts = Object.assign({}, defaultOpts, packageOpts, opts);
	opts.paths = Object.assign({}, defaultOpts.paths, packageOpts.paths, opts.paths);

	console.log(opts);


	opts.targets = targets || opts.targets;
	if(typeof opts.targets == 'string') opts.targets = [opts.targets];
	opts.targets = opts.targets.map((target)=>path.resolve(process.cwd(), target));

	//opts.shared = opts.shared.map((target)=>path.resolve(process.cwd(), target));


	if(typeof opts.template == 'string') opts.template = utils.require(opts.template);
	if(!opts.template) opts.template = require('./default.template.js');

	console.log('OPTS', opts);

	validate(opts);

	return opts;
}