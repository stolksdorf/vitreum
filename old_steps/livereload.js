const log = require('../utils/log.js');

let lr_server;
const runLivereload = (opts={}) => {
	log.setSilent(opts.silent);
	log.checkProduction('livereload');
	const livereload = require('livereload');
	log.watch('livereload running');
	if(!lr_server) lr_server = livereload.createServer();
	return lr_server.watch(`build`);
};

module.exports = runLivereload;