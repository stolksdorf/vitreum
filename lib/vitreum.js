// npm i --save-dev react react-dom browserify @babel/core @babel/preset-react watchify through2 source-map-support



const browserify = require('browserify');
const path = require('path');
const sourceMaps = require('source-map-support');


const {rel, chalk} = require('./utils.js');


// const babelify = async (code)=>(await require('@babel/core').transformAsync(code,{
// 	presets : ['@babel/preset-react']
// })).code;

// const defaultTransforms = {
// 	'.json' : (code, filename)=>`module.exports=${code};`,
// 	'.js' : (code, filename)=>babelify(code),
// 	'.jsx' : (code, filename)=>babelify(code),
// 	'*' : (code, filename)=>`module.exports=\`${code}\`;`
// };

const defaultTransforms = require('../transforms/default.js');


const customTransforms = (transforms={})=>{
	const apply = async (code, filename)=>(transforms[path.extname(filename)] || transforms['*'])(code,filename);
	return (filename, opts)=>{
		let contents = '';
		return require('through2')((chunk, enc, next)=>{ contents += chunk.toString(); next(); },
			async function(done){
				try{this.push(await apply(contents, filename));}
				catch(err){this.emit('error', err);}
				done();
			}
		)
	}
};

///////////

const runBundler = async (bundler)=>new Promise((res, rej)=>bundler.bundle((err, buf)=>err ? rej(err) : res(buf.toString())));

let Libs;

module.exports = async (entrypoint, _opts={})=>{
	const ep = rel(entrypoint, 2);

	const opts = {
		name       : _opts.name || '__entrypoint__',
		transforms : {...defaultTransforms, ..._opts.transforms},
		dev        : _opts.dev || null,
		libs       : ['react', 'react-dom'].concat(_opts.libs || [])
	};

	let bundler = browserify(ep, { standalone : opts.name, cache : {} })
		.external(opts.libs)
		.transform(customTransforms(opts.transforms), {global:true});

	if(!!opts.dev) sourceMaps.install();

	const pack = async ()=>{
		console.time(chalk.cyan('bundled'));

		if(!Libs) Libs = await runBundler(browserify().require(opts.libs));
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
