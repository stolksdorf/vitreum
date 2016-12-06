require('source-map-support').install();

const watchify = require('watchify');
const chokidar  = require('chokidar');
const path  = require('path');

const Bundler = require('./utils/bundler.js');
const log = require('./utils/timeLog.js');
const addPartial = require('./utils/addPartial.js');
const storage = require('./storage.js');


const rebuild = (name, bundler) => {
	const logEnd = log(`${name}-rebuild`);
	Bundler.run(name, bundler)
		.then(logEnd)
		.catch((err) => {
			console.error(err.toString());
		});
};

const watch = (name, rootPath, libs)=>{
	const bundler = Bundler.get(name, path, libs);
	const _rebuild = rebuild.bind(null, name, bundler);

	//Pull from storage
	const rootPath = path.dirname( `client/${name}`;

	const logEnd = log(`${name}[js]`);
	return Bundler.run(name, bundler)
		.then(() => {
			logEnd();




			chokidar.watch(`${rootPath}/**/*.jsx`, {ignoreInitial : true})
				.on('add', _rebuild); //Probably run a rebundle here
				.on('unlink', _rebuild); //

			watchify(bundler).on('update', _rebuild);

			console.log(`Enabling js-watch for ${name}   ✓`);
		});
}


module.exports = addPartial(watch);