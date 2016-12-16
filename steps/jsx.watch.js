require('source-map-support').install();

const _ = require('lodash');
const watchify = require('watchify');
const chokidar  = require('chokidar');
const path  = require('path');

//const Bundler = require('../utils/bundler.js');
const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');
const storage = require('../utils/storage.js');

const jsx = require('./jsx.js');


/*
const rebuild = (name, bundler) => {
	Bundler.run(name, bundler)
		.then(logEnd)
		.catch((err) => {
			console.error(err.toString());
		});
};
*/

const jsxwatch = (name, entryPoint, libs, shared)=>{
	log.checkProduction('jsx-watch');

	//const bundler = Bundler.get(name, path, libs);
	//const _rebuild = rebuild.bind(null, name, bundler);


	//TODO: Add entryDir to storage for less-watch
	const entryDir = path.dirname(entryPoint);
	storage.entryDir(name, entryDir);


	let bundler;
	const remakeBundler = ()=>{
		bundler = jsx.makeBundler(name, entryPoint, libs, shared);
		bundler.rawBundler.plugin(watchify);
	};
	const rebundle = ()=>{
		return bundler.run()
			.then(() => {
				const newDeps = _.keys(bundler.rawBundler._options.cache);
				storage.deps(name, newDeps);
			})
			.catch((err) => {
				console.error(err.toString());
			});
	}
	const rebuild = (label) => {
		log.updateCache(label);
		remakeBundler();
		rebundle();
	}

	remakeBundler();

	//Possibly just use rebundle here
	return bundler.run()
		.then((deps) => {
			storage.deps(name, deps);

			watchify(bundler.rawBundler).on('update', rebundle);

			chokidar.watch([`${entryDir}/**/*.jsx`, `${entryDir}/**/*.js`], {ignoreInitial : true})
				.on('add', ()=>{
					rebuild('file added');
				})
				.on('unlink', ()=>{
					rebuild('file removed');
				});



			log.watch(`Enabling js-watch for ${name}`);
		});
}


module.exports = addPartial(jsxwatch);