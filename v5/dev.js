
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


let lr_server;


const mdeps = require('module-deps')({
	filter : (id)=>{
		console.log(id, id.indexOf('/build/'));
		return id.indexOf('/build/') == -1;
	},
	postFilter : (id, file, pkg)=>{

	}
});



const buildPath ='./build';

const appPath = '../test/app.js'

const getDeps = ()=>{

}


const runServerByDeps = (appPath)=>{
	let deps = [];

	//Looks like thi is breaking when you try and require a already bundled resource

	const app = browserify({
		require : appPath,
		bundleExternal : false,
		filter : (id)=>id.indexOf(buildPath) == -1,
		postFilter : (id, file, pkg)=>{
			console.log(id, file, pkg);
			return true
		}
	})
	app.pipeline.get('deps').on('data', (file) => deps.push(file.file || file.id));
	app.bundle((err)=>{
		if(err) throw err;

		console.log(deps);
		nodemon({ script : appPath, watch  : deps, delay : 2 })
			.on('restart', (files)=>{
				//TODO: Style this and make this way prettier,
				// message what changed
				// normalize the file paths
				console.log('Change detected', files.map((file)=>path.resolve(process.cwd(), file)))
			});
	})
};


// const runServerByIgnore = (entryDir)=>{
// 	nodemon({
// 		script : appPath,
// 		ignore : ['./build', entryDir]
// 	})
// 	.on('restart', (files)=>console.log('Server restart'));
// }


module.exports = (entryPoint, opts)=>{
	//TODO: do a check to make sure it's a single entry point

	//create bundler

	let cxt = {
		libs  : {},
		build : buildPath,
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	};

	//Check to make sure the target directory exists

	if(!fse.pathExistsSync(`${buildPath}/${cxt.entry.name}`)){
		//throw 'This entrypoint has not been built, please run a build before you dev';
	}

	sourceMaps.install();


	const bundle = ()=>{
		//TODO: de cache /build/[entry]/bundle.js here
		delete require.cache[`${buildPath}/${cxt.entry.name}/bundle.js`];

		return new Promise((resolve, reject)=>{
			bundler.bundle((err, buf) => err ? reject(err) : resolve(buf.toString()))
		})
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
				}, (err, res) => {
					// err ? reject(err) : resolve(res.css)
					if(err) reject(err);
					resolve(res.css);
				});
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
			//ignoreMissing : true
		})
		.require(entryPoint)
		.transform((file)=>transform(cxt, file), {global : true})
		.on('file', (filepath, libName) => {
			if(filepath.indexOf('node_modules') === -1) return;
			cxt.libs[filepath] = libName;
			bundler._external.push(libName);
		})
		.on('update', bundle);

	runServerByDeps(appPath);


	// mdeps.write(appPath)
	// mdeps.end();



	//livereload.createServer().watch(buildPath);


	//return bundle()
	return Promise.resolve();
};