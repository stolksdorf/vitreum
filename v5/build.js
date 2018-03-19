const browserify = require('browserify');
const fse        = require('fs-extra');
const path       = require('path');
const uglify     = require("uglify-es");
const less       = require('less');


const generator = require('./generator.js');

const transform = require('./transforms');

const buildPath ='./build';




const minify = (code)=>{
	const mini = uglify.minify(code);
	if(mini.error) throw mini.error;
	return mini.code;
};

let Libs = {
	'react-dom' : '',
	'react'     : ''
};
//let Libs = ['react-dom', 'react'];
const bundleEntryPoint = (entryPoint, opts)=>{
	let ctx = {
		//libs  : Libs,
		build : buildPath,
		less  : '',
		entry : {
			name : path.basename(entryPoint).split('.')[0],
			dir  : path.dirname(entryPoint)
		}
	};

	const bundler = browserify({
			standalone : ctx.entry.name,
			//paths      : opts.shared,
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>{
				if(filepath.indexOf('node_modules') == -1) return true;
				Libs[id] = filepath;
				return false;
			}
		})
		.require(entryPoint)
		.transform((file)=>transform(ctx, file), /*{global : true}*/);

	const bundle = ()=>{
		return new Promise((resolve, reject)=>bundler.bundle((err, buf) => err ? reject(err) : resolve(buf.toString())));
	};

	const style = async ()=>{
		return new Promise((resolve, reject)=>{
			less.render(ctx.less, {
				//TODO: used for shared path
				//paths: _.concat(['./node_modules'], opts.shared),
				compress: true,
			}, (err, res) => err ? reject(err) : resolve(res.css));
		})
		.then((renderedCSS)=>fse.writeFile(`${buildPath}/${ctx.entry.name}/bundle.css`, renderedCSS))
	};

	//TODO: Maybe make this be a promise.all?
	return fse.ensureDir(`${buildPath}/${ctx.entry.name}`)
		.then(bundle)
		//.then(minify)
		.then((code)=>fse.writeFile(`${buildPath}/${ctx.entry.name}/bundle.js`, code))
		.then(style)
		.then(()=>generator(ctx))
		// .then(()=>{
		// 	//Libs = Object.assign(Libs, ctx.libs);
		// })
};

const bundleLibs = (opts)=>{
	//TODO: Should list out the libs you are building in logs
	console.log('Building Libs', Object.keys(Libs));

	return new Promise((resolve, reject)=>{
		browserify({ /*paths: opts.shared */ }).require(Object.keys(Libs))
			.bundle((err, buf) => err ? reject(err) : resolve(buf.toString()))
	})
	//TODO: Minifiying is really slow, try doing it as a transform
	//.then(minify)
	.then((code)=>fse.writeFile(`${buildPath}/libs.js`, code))
}

module.exports = (entryPoints, opts)=>{
	if(!Array.isArray(entryPoints)) entryPoints = [entryPoints];
	return fse.emptyDir(buildPath)
		.then(()=>Promise.all(entryPoints.map(bundleEntryPoint)))
		.then(bundleLibs)
		.catch((err)=>{
			console.log('ERR', err);
		})
};

