const _ = require('lodash');
const fse = require('fs-extra');
const path = require('path');
const browserify = require('browserify');
const babelify = require('babelify');
const uglify = require("uglify-js");
const chalk = require('chalk');

const storage = require('./storage.js');
const log = require('./timeLog.js');

const isProd = process.env.NODE_ENV === 'production';



const showBundleWarnings = (bundledLibs) => {
	if(!bundledLibs.length) return;
	console.log(chalk.red("Warning: ") + "The following node modules are in your js bundle.");
	console.log('    ' + chalk.yellow(bundledLibs.join('\n    ')));
	console.log(chalk.green("Consider adding these the 'libs' field in your project.json\n"));
}

const processDeps = (deps) => {
	return _.reduce(deps, (r, file) => {
		if(_.endsWith(file.id, '.jsx')){
			r.jsx.push(file.id);
		}

		//TODO: Remove?
		r.deps[file.id] = _.keys(file.deps);

		//Check for bundled files that are actually libs
		if(file.id.indexOf('node_modules') !== -1){
			r.warnings.push(file.id.substring(file.id.indexOf('node_modules') + 13));
		}
		return r;
	}, { warnings : [], deps : {}, jsx : [] });
};

let jsxDeps = {};

module.exports = {
	get : function(name, entryPoint, libs=[], shared=[]){

		storage.entryDir(name, path.dirname(entryPoint));

		const bundler = browserify({
				debug: !isProd,
				cache: {},
				packageCache: {},
				standalone : name,
				paths : shared
			})
			.require(entryPoint)
			.transform({global: true}, babelify)
			.external(libs);

		//As we're bundling collect the project dependacies

		let deps = [];
		bundler.pipeline.get('deps')
			.on('data', (data) => {
				deps.push(data);
			})
			.on('end', () => {
				const res = processDeps(deps);
				showBundleWarnings(res.warnings);
				storage.deps(name, res.jsx);
				console.log(name, res.jsx);
				jsxDeps[name] = res.jsx;
			})

		return bundler;
	},
	run : function(name, bundler){
		return new Promise((resolve, reject) => {

			console.log(jsxDeps);

			bundler.bundle((err, buf) => {
				if(err) return reject(err);

				console.log('test', jsxDeps);

				let code = buf.toString();

				if(isProd){
					code = uglify.minify(buf.toString(), {fromString: true}).code;
				}

				fse.outputFile(`build/${name}/bundle.js`, code, (err)=>{
					if(err) return reject(err);
					console.log(jsxDeps[name]);
					return resolve(true, jsxDeps[name]);
				});
			})
		});
	}
}