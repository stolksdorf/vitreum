const log = require('./timeLog.js');

const _ = require('lodash');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const uglify = require("uglify-js");


const chalk = require('chalk');

const storage = require('./storage.js');

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
		r.deps[file.id] = _.keys(file.deps);

		//Check for bundled files that are actually libs
		if(file.id.indexOf('node_modules') !== -1){
			r.warnings.push(file.id.substring(file.id.indexOf('node_modules') + 13));
		}
		return r;
	}, { warnings : [], deps : {}, jsx : [] });
};


module.exports = {
	get : function(name, rootPath, libs=[], shared=[]){

		//TODO: dump rootPath into storage


		const bundler = browserify({
				debug: !isProd,
				cache: {},
				packageCache: {},
				standalone : name,
				paths : shared
			})
			.require(rootPath)
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
				storage.set(name, res.deps);
				//TODO: also dump jsx files in here
			})

		return bundler;
	},
	run : function(name, bundler){
		return new Promise((resolve, reject) => {
			bundler.bundle((err, buf) => {
				if(err) return reject(err);

				let code = buf.toString();

				if(isProd){
					code = uglify.minify(buf.toString(), {fromString: true}).code;
				}

				fs.writeFile(`build/${name}/bundle.js`, code, (err)=>{
					if(err) return reject(err);
					return resolve();
				});
			})
		});
	}
}