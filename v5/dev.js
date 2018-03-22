const utils = require('./utils.js');
const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');
const watchify   = require('watchify');
const sourceMaps = require('source-map-support');
const less       = require('less');
const livereload = require('livereload');
const nodemon = require('nodemon');
const transform = require('./transforms');
const generator = require('./generator.js');
const getOpts   = require('./default.opts.js');


const startApp = async (opts)=>{
	return new Promise((resolve, reject)=>{
		let deps = [];
		const app = browserify({ require : opts.app, bundleExternal : false,
			postFilter : (id, filepath)=>{
				//TODO: use minimatch to do better matching
				if(id.indexOf(opts.paths.build) !== -1) return false;
				deps.push(filepath);
				return true;
			}
		})
		app.bundle((err)=>{
			if(err) return reject(err);
			console.log('deps', deps);

			resolve();

			//FIXME: watching specific files doens't seem to work. Test this.
			nodemon({ script : opts.app, watch  : deps, delay : 2 })
				.on('restart', (files)=>{
					//TODO: Style this and make this way prettier,
					// message what changed
					// normalize the file paths
					if(files && files.length) console.log('Change detected', files.map((file)=>path.relative(process.cwd(), file)));
					console.log('restarting server');
				});
		});
	});
};

const devEntryPoint = async (entryPoint, opts)=>{
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

	if(!fse.pathExistsSync(`${opts.paths.build}/${ctx.entry.name}`)){
		//throw 'This entrypoint has not been built, please run a build before you dev';
	}

	const bundler = browserify({
			cache      : {}, packageCache: {},
			debug       : true,
			standalone : ctx.entry.name,
			paths      : opts.shared,
			plugin    : [watchify],
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>filepath.indexOf('node_modules') == -1,
		})
		.require(entryPoint)
		.transform((file)=>transform(ctx, file))
		.on('update', (files)=>{
			console.log('\n\n');
			console.log('Client Change detected', files.map((file)=>path.relative(process.cwd(), file)));
			console.log('rebundling', ctx.entry.name);
			gogogo();
		});

	const gogogo = async ()=>{
		await utils.bundle(bundler).then((code)=>fse.writeFile(paths.code, code));
		await utils.lessRender(ctx.less, {
				paths     : opts.shared,
				compress  : false,
				sourceMap : {sourceMapFileInline: true}
			}).then((css)=>fse.writeFile(paths.style, css))
	};

	await generator(ctx, Object.assign(opts, {dev : true}));
	await gogogo();
};

module.exports = async (entryPoints, opts)=>{
	opts = getOpts(opts, entryPoints);

	sourceMaps.install();

	await Promise.all(opts.targets.map((ep)=>devEntryPoint(ep, opts)));
	await startApp(opts);
	await livereload.createServer().watch(opts.paths.build);
};
