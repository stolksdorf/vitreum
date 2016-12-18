const _ = require('lodash');


const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');



const assetwatch = (globs, folders) => {
	log.checkProduction('assets-watch');

	const chokidar  = require('chokidar');
	const assets = require('./assets.js');

	const allPaths = _.reduce(folders, (r, folder) => {
		return _.concat(r, _.map(globs, (glob) => {
			return `${folder}/**/${glob}`;
		}));
	}, []);

	return assets(globs, folders)
		.then(() => {
			chokidar.watch(allPaths, {ignoreInitial : true})
				.on('add', assets.partial(globs, folders))
				.on('change', assets.partial(globs, folders))
				.on('unlink', assets.partial(globs, folders));

			log.watch(`Enabling asset-watch`);
		});
};

module.exports = addPartial(assetwatch);