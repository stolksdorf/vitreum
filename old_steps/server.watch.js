const _    = require('lodash');
const path = require('path');

const log = require('../utils/log.js');

const watchServer = (serverPath, watchFolders=[], opts={args : []})=>{
	log.setSilent(opts.silent);
	log.checkProduction('server-watch');

	const nodemon = require('nodemon');
	nodemon(_.assign({}, {
		script : serverPath,
		watch  : _.map(_.concat(watchFolders, serverPath), (watch)=>path.normalize(watch))
	}, opts));
	nodemon.on('restart', (files)=>console.log('Server restart'));

	log.watch(`Enabled server watching`);
	return Promise.resolve();
};

module.exports = watchServer;
