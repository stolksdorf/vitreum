const _ = require('lodash');
const browserify = require('browserify');
const babelify = require('babelify');
const chalk = require('chalk');

const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');

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
	get : function(name, path, libs=[], shared=[]){
		const bundler = browserify({
				debug: !isProd,
				cache: {},
				packageCache: {},
				standalone : name,
				paths : shared
			})
			.require(path)
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
				storage.set(name, res.deps)
			})

		return bundler;
	},
	run : function(name, bundler){
		return new Promise((resolve) => {
			const bundle = bundler
				.bundle()
				.on('error', (err)=>{
					console.log('BUNDLE ERR', err);
					//utils.handleError.call(this, config.DEV, err)
					throw err;
				})
				.pipe(source('bundle.js'))
				.pipe(buffer());

			if(isProd) bundle.pipe(uglify());

			bundle
				.pipe(gulp.dest(`build/${name}`))
				.on('finish', resolve);
		});
	}
}