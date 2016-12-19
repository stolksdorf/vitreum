const _ = require('lodash');

const path  = require('path');

const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');
const storage = require('../utils/storage.js');

const jsx = require('./jsx.js');


const jsxwatch = (name, entryPoint, libs, shared)=>{
	log.checkProduction('jsx-watch');

	require('source-map-support').install();
	const watchify = require('watchify');
	const chokidar  = require('chokidar');

	const entryDir = path.dirname(entryPoint);
	storage.entryDir(name, entryDir);

	let bundler;
	const remakeBundler = ()=>{
		if(bundler) bundler.rawBundler.close();
		bundler = jsx.makeBundler(name, entryPoint, libs, shared);
		bundler.rawBundler.plugin(watchify);
		bundler.rawBundler.on('update', rebundle);
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
	};
	const rebuild = (label) => {
		log.updateCache(label);
		remakeBundler();
		rebundle();
	};

	remakeBundler();
	return bundler.run()
		.then((deps) => {
			storage.deps(name, deps);

			chokidar.watch([`${entryDir}/**/*.jsx`, `${entryDir}/**/*.js`], {ignoreInitial : true})
				.on('add', ()=>{
					rebuild('file added');
				})
				.on('unlink', ()=>{
					rebuild('file removed');
				});

			log.watch(`Enabling js-watch for ${name}`);
		});
};

module.exports = addPartial(jsxwatch);
