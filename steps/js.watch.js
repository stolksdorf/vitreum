const watchify = require('watchify');

const Bundler = require('./utils/bundler.js');
const log = require('./utils/timeLog.js');

const chokidar  = require('chokidar');

require('source-map-support').install();

//TODO: Use chodirak to watch for added and removed files to rebuild

const rebuild = (name, bundler) => {
	const logEnd = log(`${name}-rebuild`);
	Bundler.run(name, bundler)
		.then(logEnd)
		.catch((err) => {
			console.error(err.toString());
			//console.log(err);
		});
}


const watch = (name, path, libs)=>{
	const bundler = Bundler.get(name, path, libs);
	const _rebuild = rebuild.bind(null, name, bundler);

	//Pull from storage
	const rootPath = `client/${name}`;

	const logEnd = log(`${name}[js]`);
	return Bundler.run(name, bundler)
		.then(() => {
			logEnd();


			watchify(bundler).on('update', _rebuild);

			chokidar.watch(`${rootPath}/**/*.jsx`, {ignoreInitial : true})
				.on('add', _rebuild);
				.on('unlink', _rebuild);

			console.log(`Enabling js-watch for ${name}   ✓`);
		});
}


module.exports = watch;