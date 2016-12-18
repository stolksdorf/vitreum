const livereload = require('livereload');
const log = require('../utils/log.js');

let lr_server;
module.exports = () => {
	log.checkProduction('livereload');
	log.watch('live reoad running');
	if(!lr_server) lr_server = livereload.createServer();
	return lr_server.watch(`build`);
};
