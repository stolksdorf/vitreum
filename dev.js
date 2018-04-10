const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');
const watchify   = require('watchify');
const sourceMaps = require('source-map-support');
const livereload = require('livereload');
const nodemon    = require('nodemon');

const utils     = require('./utils.js');
const transform = require('./transforms');
const generator = require('./generator.js');
const getOpts   = require('./default.opts.js');

const startApp = async (opts)=>{
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
				//TODO: Style this and make this way prettier,
				// message what changed
				// normalize the file paths
				if(files && files.length) console.log('Change detected', files.map((file)=>path.relative(process.cwd(), file)));
				console.log('restarting server');
			});
	})
};

const devEntryPoint = async (entryPoint, Opts)=>{
	let opts = Object.assign({
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	}, Opts);

	if(!fse.pathExistsSync(`${opts.paths.build}/${opts.entry.name}`)){
		//throw 'This entrypoint has not been built, please run a build before you dev';
	}

	const bundler = browserify({
			cache      : {}, packageCache: {},
			debug       : true,
			standalone : opts.entry.name,
			paths      : opts.shared,
			plugin    : [watchify],
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>filepath.indexOf('node_modules') == -1,
		})
		.require(entryPoint)
		.transform((file)=>transform(file, opts))
		.on('update', (files)=>{
			console.log('\n\n');
			console.log('Client Change detected', files.map((file)=>path.relative(process.cwd(), file)));
			console.log('rebundling', opts.entry.name);
			bundle();
		});

	const bundle = async ()=>{
		await utils.bundle(bundler).then((code)=>fse.writeFile(paths.code, code));
		await utils.lessRender(opts.less, {
				paths     : opts.shared,
				compress  : false,
				sourceMap : {sourceMapFileInline: true}
			}).then((css)=>fse.writeFile(paths.style, css))
	};

	const paths = utils.paths(opts.paths, opts.entry.name);
	await generator(Object.assign(opts, {dev : true}));
	await bundle();
};

module.exports = async (entryPoints, opts)=>{
	opts = getOpts(opts, entryPoints);
	sourceMaps.install();
	await Promise.all(opts.targets.map((ep)=>devEntryPoint(ep, opts)));
	await startApp(opts);
	await livereload.createServer().watch(opts.paths.build);
};
