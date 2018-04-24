const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');
const watchify   = require('watchify');
const sourceMaps = require('source-map-support');
const livereload = require('livereload');

const utils          = require('./lib/utils.js');
const transform      = require('./lib/transforms');
const renderer       = require('./lib/renderer.js');
const getDefaultOpts = require('./lib/default.opts.js');
const log            = require('./lib/utils/log.js');
const Less           = require('./lib/utils/less.js');

const startApp = async (opts)=>{
	const nodemon    = require('nodemon');
	return new Promise((resolve, reject)=>{
		let deps = [];
		browserify({ require : opts.app, bundleExternal : false,
			postFilter : (id, filepath)=>{
				//TODO: use minimatch to do better matching
				if(id.indexOf(opts.paths.build) !== -1) return false;
				deps.push(filepath);
				return true;
			}
		}).bundle((err)=>err?reject(err):resolve(deps));
	})
	.then((appDeps)=>{
		nodemon({ script:opts.app, watch:appDeps, delay:2 })
			.on('restart', (files)=>{
				log.restartServer(opts.app, files);
			});
	})
};

const devEntryPoint = async (entryPoint, Opts)=>{
	let opts = Object.assign({
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	}, Opts);

	if(!fse.pathExistsSync(path.resolve(process.cwd(), opts.paths.build, opts.entry.name))){
		throw log.notBuilt(opts.entry);
	}

	const bundler = browserify({
			cache         : {},
			packageCache  : {},
			debug         : true,
			standalone    : opts.entry.name,
			paths         : opts.shared,
			plugin        : [watchify],
			ignoreMissing : true,
			//FIXME: This filter breaks when no filepath
			postFilter    : (id, filepath, pkg)=>filepath.indexOf('node_modules') == -1,
		})
		.require(entryPoint)
		.transform((file)=>transform(file, opts))
		.on('update', (files)=>{
			log.rebundle(opts.entry, files);
			bundle();
		});

	let lastBundle;
	const bundle = async ()=>{
		await utils.bundle(bundler).then((code)=>{
			if(lastBundle != code) fse.writeFileSync(paths.code, code)
			lastBundle = code;
		});
		await Less.render({
			paths     : opts.shared,
			compress  : false,
			sourceMap : {sourceMapFileInline: true}
		}).then((css)=>fse.writeFile(paths.style, css));
	};

	const paths = utils.paths(opts.paths, opts.entry.name);
	await renderer(Object.assign(opts, {dev : true}));
	await bundle();
};

module.exports = async (entryPoints, opts)=>{
	opts = getDefaultOpts(opts, entryPoints);
	log.beginDev(opts);
	sourceMaps.install();
	await opts.targets.reduce((flow, ep)=>flow.then(()=>devEntryPoint(ep, opts)), Promise.resolve());
	await startApp(opts);
	await livereload.createServer().watch(opts.paths.build);
};
