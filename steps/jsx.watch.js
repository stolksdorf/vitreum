require('source-map-support').install();

const watchify = require('watchify');
const chokidar  = require('chokidar');
const path  = require('path');

//const Bundler = require('./utils/bundler.js');
const log = require('./utils/log.js');
const addPartial = require('./utils/addPartial.js');
const storage = require('./utils/storage.js');

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

const watch = (name, entryPoint, libs, shared)=>{
	log.checkProduction('jsx-watch');

	//const bundler = Bundler.get(name, path, libs);
	//const _rebuild = rebuild.bind(null, name, bundler);


	//TODO: Add entryDir to storage for less-watch
	const entryDir = path.dirname(entryPoint);


	let bundler;
	const remakeBundler = ()=>{
		bundler = jsx.makeBundler(name, entryPoint, libs, shared);
	};
	const rebundle = ()=>{
		console.log('rebundling');
		return bundler.run()
			.then((deps) => {
				console.log('new deps', deps);
				//store these for access from less.watch
				storage.deps(name, deps);
			})
			.catch((err) => {
				console.error(err.toString());
			});
	}
	const rebuild = (label) => {
		console.log(label);
		remakeBundler();
		rebundle();
	}

	remakeBundler();

	//Possibly just use rebundle here
	return bundler.run()
		.then((deps) => {

			//deps: store these for access from less.watch
			storage.deps(name, deps);

			console.log('setup watchify', bundler.rawBundler);
			watchify(bundler.rawBundler).on('update', ()=>{

				console.log('yo');
				rebundle();
			});


			chokidar.watch([`${entryDir}/**/*.jsx`, `${entryDir}/**/*.js`], {ignoreInitial : true})
				.on('add', ()=>{
					rebuild('js file added');
				}) //Probably run a rebundle here
				.on('unlink', ()=>{
					rebuild('js file removed');
				});



			log.watch(`Enabling js-watch for ${name}   ✓`);
		});
}


module.exports = addPartial(watch);