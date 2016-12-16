const chokidar  = require('chokidar');

const storage = require('../utils/storage.js');
const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

const LessStep = require('./less.js');

const lesswatch = (name, shared=[]) => {
	log.checkProduction('less-watch');
	const rootPath = storage.entryDir(name);
	return LessStep(name, shared, storage.deps(name))
		.then(() => {
			chokidar.watch(`${rootPath}/**/*.less`)
				.on('change', ()=>{
					LessStep(name, shared, storage.deps(name))
						.catch((err) => {
							console.error(err.toString());
						});
				})
			log.watch(`Enabling less-watch for ${name}`);
		});
};

module.exports = lesswatch;
