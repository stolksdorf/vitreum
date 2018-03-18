
/*
	it's assumed that a build script has already been ran


*/
const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');

const watchify   = require('watchify');
const sourceMaps = require('source-map-support');
const less       = require('less');

const livereload = require('livereload');

const nodemon = require('nodemon');
const transform = require('./transforms/transforms.js');



const buildPath ='./build';

const appPath = '../test/app.js'


const watchServer = (appPath, buildPath)=>{
	let deps = [];
	const app = browserify({ require : appPath, bundleExternal : false,
		//Ignore all built files from server watching
		postFilter : (id, filepath)=>{
			//TODO: use path to do better checking
			if(id.indexOf(buildPath) !== -1) return false;
			deps.push(filepath);
			return true;
		}
	})
	app.bundle((err)=>{
		if(err) throw err;

		console.log('deps', deps);
		nodemon({ script : appPath, watch  : deps })
			.on('restart', (files)=>{
				//TODO: Style this and make this way prettier,
				// message what changed
				// normalize the file paths
				console.log('Change detected', files.map((file)=>path.relative(process.cwd(), file)));
				console.log('restarting server');
			});
	})
};



module.exports = (entryPoint, opts)=>{
	//TODO: do a check to make sure it's a single entry point


	let cxt = {
		build : buildPath,
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	};


	//TODO: fix the pathing to be absolute
	if(!fse.pathExistsSync(`${buildPath}/${cxt.entry.name}`)){
		//throw 'This entrypoint has not been built, please run a build before you dev';
	}

	sourceMaps.install();


	const bundleEntryPointDev = ()=>{
		delete require.cache[`${buildPath}/${cxt.entry.name}/bundle.js`];


		return bundle()
		.then((code)=>fse.writeFile(`${buildPath}/${cxt.entry.name}/bundle.js`, code))
		.then(()=>{
			return new Promise((resolve, reject)=>{
				//Possibly bump this out to a util?
				less.render(cxt.less, {
					//TODO: Add in shared path
					//paths: _.concat(['./node_modules'], opts.shared),
					filename  : `${cxt.entry.name}.less`,
					compress  : false,
					sourceMap : {sourceMapFileInline: true}
				}, (err, res) => err ? reject(err) : resolve(res.css))
			})
			.then((renderedCSS)=>fse.writeFile(`${buildPath}/${cxt.entry.name}/bundle.css`, renderedCSS))

		})
	};

	const bundler = browserify({
			cache      : {}, packageCache: {},
			debug       : true,
			standalone : cxt.entry.name,
			//paths      : opts.shared
			plugin    : [watchify],
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>filepath.indexOf('node_modules') == -1,
		})
		.require(entryPoint)
		.transform((file)=>transform(cxt, file))
		.on('update', (files)=>{
			console.log('Change detected', files.map((file)=>path.relative(process.cwd(), file)));
			console.log('rebundling', ctx.entry.name);
			bundleEntryPointDev();
		});

	const bundle = ()=>{
		return new Promise((resolve, reject)=>{
			bundler.bundle((err, buf) => err ? reject(err) : resolve(buf.toString()))
		})
	};

	watchServer(appPath, buildPath);
	livereload.createServer().watch(buildPath);
	return bundleEntryPointDev();
};