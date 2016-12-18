const _ = require('lodash');
const nodemon = require('nodemon');
const path = require('path');

const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

const watchServer = (serverPath, watchFolders=[])=>{
	log.checkProduction('server-watch');

	nodemon({
		script: serverPath,
		watch: _.map(_.concat(watchFolders, serverPath), (watch)=>{
			return path.normalize(watch);
		})
	});
	nodemon
		.on('restart', (files) => {
			//TODO: make pretty
			console.log('Server restart');
		});

	log.watch(`Enabled server watching`);
	return Promise.resolve();
};

module.exports = addPartial(watchServer);
