// npm i --save-dev react react-dom browserify @babel/core @babel/preset-react watchify through2 source-map-support

const browserify = require('browserify');
const path = require('path');
const sourceMaps = require('source-map-support');

const {chalk} = require('./utils.js');
const defaultTransforms = require('../transforms/default.js');

const customTransforms = (transforms={})=>{
	const apply = async (code, filename)=>(transforms[path.extname(filename)] || transforms['*'])(code,filename);
	return (filename, opts)=>{
		let contents = '';
		return require('through2')((chunk, enc, next)=>{ contents += chunk.toString(); next(); },
			async function(done){
				try{this.push((await apply(contents, filename)) || `module.exports = '';` );}
				catch(err){this.emit('error', err);}
				done();
			}
		)
	}
};

const runBundler = async (bundler)=>new Promise((res, rej)=>bundler.bundle((err, buf)=>err ? rej(err) : res(buf.toString())));

const getOpts = (opts)=>{
	const {name, transforms, dev, libs, ...rest} = opts;
	return {
		name       : name || '__entrypoint__',
		transforms : {...defaultTransforms, ...transforms},
		dev        : dev || null,
		libs       : ['react', 'react-dom'].concat(libs || []),
		rest
	}
}

module.exports = async (entrypoint, _opts={})=>{
	let Libs;


	//const ep = rel(entrypoint, 2);
	const opts = getOpts(_opts);

	console.log('HELLLO');

	console.log(path.resolve(process.cwd(), entrypoint));
	console.log(opts);

	console.log(opts.libs.map((lib)=>require.resolve(lib, {paths : [path.dirname(entrypoint)]})));

	let bundler = browserify(entrypoint, { standalone : opts.name, cache : {}, ...opts.rest})
		.external(opts.libs)
		.transform(customTransforms(opts.transforms), {global:true});

	if(!!opts.dev) sourceMaps.install();

	const pack = async ()=>{
		console.time(chalk.cyan('bundled'));



		if(!Libs) Libs = await runBundler(browserify().require(opts.libs));

		// if(!Libs){
		// 	Libs = await runBundler(opts.libs.reduce((acc, lib)=>{
		// 		return acc.require(require.resolve(lib, {paths : [path.dirname(entrypoint)]}), {expose : lib});
		// 	}, browserify());
		// }

		const Core = await runBundler(bundler);

		const renderAsString = `;const comp = module.exports; module.exports = (props)=>require('react-dom/server').renderToString(require('react').createElement(comp, props))`;
		const clientSideHydrate = `;start = (props={})=>require('react-dom').hydrate(require('react').createElement(${opts.name}, props),document.getElementsByTagName('main')[0]);`

		console.timeEnd(chalk.cyan('bundled'));
		return {
			bundle : Libs + Core + clientSideHydrate,
			ssr    : Core + renderAsString,
			render : (props={})=>{
				const comp = eval(`module=undefined;${Core};global.${opts.name};`);
				return require('react-dom/server').renderToString(require('react').createElement(comp, props));
			}

		};
	};
	if(opts.dev){
		console.log(chalk.magenta('watching...'));
		bundler = bundler.plugin('watchify').on('update', async ([file])=>{
			console.log(chalk.yellow(`changed:`), file.replace(process.cwd(), ''));
			opts.dev(await pack())
		});
	}
	return pack();
};
