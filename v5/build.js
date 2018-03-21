const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');
//const uglify     = require("uglify-es");
const less       = require('less');


const utils = require('./utils.js');

const generator = require('./generator.js');

const transform = require('./transforms');

const getOpts = require('./default.opts.js');

//const buildPath ='./build';




// const minify = (code)=>{
// 	const mini = uglify.minify(code);
// 	if(mini.error) throw mini.error;
// 	return mini.code;
// };

let Libs = {
	'react-dom' : '',
	'react'     : ''
};
//let Libs = ['react-dom', 'react'];
const bundleEntryPoint = async (entryPoint, opts)=>{
	let ctx = {
		//libs  : Libs,
		//TODO: might not need? because I'm passing down opts
		build : opts.paths.build,
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	};

	const bundler = browserify({
			standalone : ctx.entry.name,
			paths      : opts.shared,
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>{
				if(!filepath) throw 'can not find';
				if(filepath.indexOf('node_modules') == -1) return true;
				Libs[id] = filepath;
				return false;
			}
		})
		.require(entryPoint)
		.transform((file)=>transform(ctx, file), /*{global : true}*/);
		//.transform(uglifyify)

	//TODO: use utils.bundle
	// const bundle = ()=>{
	// 	return new Promise((resolve, reject)=>bundler.bundle((err, buf) => err ? reject(err) : resolve(buf.toString())));
	// };

	//TODO: use utils.lessRender
	const style = async ()=>{
		return new Promise((resolve, reject)=>{
			less.render(ctx.less, {
				//TODO: used for shared path
				//paths: ['./node_modules'].concat(opts.shared),
				paths: opts.shared,
				compress: true,
			}, (err, res) => err ? reject(err) : resolve(res.css));
		})
		.then((renderedCSS)=>fse.writeFile(`${opts.paths.build}/${ctx.entry.name}/${opts.paths.style}`, renderedCSS))
	};

	//TODO: Maybe make this be a promise.all?
	//TODO: make this into async await
	await fse.ensureDir(`${opts.paths.build}/${ctx.entry.name}`);
	await utils.bundle(bundler).then((code)=>fse.writeFile(`${opts.paths.build}/${ctx.entry.name}/${opts.paths.code}`, code));
	await style();
	await generator(ctx, opts);
};

const bundleLibs = async (opts)=>{
	//TODO: Should list out the libs you are building in logs
	console.log('Building Libs', Object.keys(Libs));

	return utils.bundle(browserify()
		.require(Object.keys(Libs))
		//.transform(uglifyify)
	).then((code)=>fse.writeFile(`${opts.paths.build}/${opts.paths.libs}`, code));

	// return new Promise((resolve, reject)=>{
	// 	browserify({ /*paths: opts.shared */ }).require(Object.keys(Libs))
	// 		.bundle((err, buf) => err ? reject(err) : resolve(buf.toString()))
	// })
	// //TODO: Minifiying is really slow, try doing it as a transform
	// //.then(minify)
	// .then((code)=>fse.writeFile(`${opts.paths.build}/libs.js`, code))
}

module.exports = async (entryPoints, opts)=>{
	opts = getOpts(opts, entryPoints);

	await fse.emptyDir(opts.paths.build);
	await Promise.all(opts.targets.map((ep)=>bundleEntryPoint(ep, opts)));
	await bundleLibs(opts);
};

