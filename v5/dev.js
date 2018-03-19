
/*
	it's assumed that a build script has already been ran


*/

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


const buildPath ='./build';

const appPath = '../test/app.js';

const decache = (modPath)=>{
	delete require.cache[require.resolve(path.resolve(process.cwd(), modPath))];
};


const tempServer = ()=>{
	//get app deps
	// jet pack out if bundle.js in build folder
	//setup a chokidar watcher for all deps to decache on change

	//require in the server
};




const watchServer = (appPath, buildPath)=>{
	//TODO: Ppotentially use chokidar do auto-decache
	// server files as they update and don't run the server as a sub process


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
		//FIX: watching specific files doens't seem to work. Test this.
		nodemon({ script : appPath, watch  : deps })
			.on('restart', (files, temp)=>{
				console.log(temp);
				//TODO: Style this and make this way prettier,
				// message what changed
				// normalize the file paths
				if(files && files.length) console.log('Change detected', files.map((file)=>path.relative(process.cwd(), file)));
				console.log('restarting server');
			});
	})
};



module.exports = async (entryPoint, opts)=>{
	//TODO: do a check to make sure it's a single entry point


	//console.log(process.cwd());
	//console.log(utils.appRoot);
	//console.log(utils.requireResolve('./build/libs.js'));

	let ctx = {
		build : buildPath,
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	};


	//TODO: fix the pathing to be absolute
	if(!fse.pathExistsSync(`${buildPath}/${ctx.entry.name}`)){
		//throw 'This entrypoint has not been built, please run a build before you dev';
	}

	sourceMaps.install();


	const bundleEntryPointDev = async ()=>{

		//console.log('removing require cache', require.resolve(path.resolve(process.cwd(), `${buildPath}/${ctx.entry.name}/bundle.js`)));
		//decache(`${buildPath}/${ctx.entry.name}/bundle.js`);


		//console.log('DEV EXISTS', !!require.cache[require.resolve(path.resolve(process.cwd(), `${buildPath}/${ctx.entry.name}/bundle.js`))]);

		// const code = await bundle();
		// await fse.writeFile(`${buildPath}/${ctx.entry.name}/bundle.js`, code);



		return bundle()
			.then((code)=>fse.writeFile(`${buildPath}/${ctx.entry.name}/bundle.js`, code))
			.then(()=>{
				return new Promise((resolve, reject)=>{
					//Possibly bump this out to a util?
					less.render(ctx.less, {
						//TODO: Add in shared path
						//paths: _.concat(['./node_modules'], opts.shared),
						filename  : `${ctx.entry.name}.less`,
						compress  : false,
						sourceMap : {sourceMapFileInline: true}
					}, (err, res) => err ? reject(err) : resolve(res.css))
				})
				.then((renderedCSS)=>fse.writeFile(`${buildPath}/${ctx.entry.name}/bundle.css`, renderedCSS))

			})
			.then(()=>{

			})
			.catch((err)=>{
				//TODO: Style this to be better, logs.js:53
				console.log(err);
			})
	};

	const bundler = browserify({
			cache      : {}, packageCache: {},
			debug       : true,
			standalone : ctx.entry.name,
			//paths      : opts.shared
			plugin    : [watchify],
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>filepath.indexOf('node_modules') == -1,
		})
		.require(entryPoint)
		.transform((file)=>transform(ctx, file))
		.on('update', (files)=>{
			console.log('\n\n\n\n\n');
			console.log('Client Change detected', files.map((file)=>path.relative(process.cwd(), file)));
			console.log('rebundling', ctx.entry.name);
			bundleEntryPointDev();
		});

	const bundle = ()=>{
		return new Promise((resolve, reject)=>bundler.bundle((err, buf) => err ? reject(err) : resolve(buf.toString())));
	};

	await watchServer(appPath, buildPath);
	await livereload.createServer().watch(buildPath);
	await generator(ctx, {dev : true});
	await bundleEntryPointDev();
};