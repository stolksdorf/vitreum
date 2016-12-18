const livereload = require('livereload');
const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

let lr_server;
const livereload = () => {
	log.checkProduction('livereload');
	log.watch('live reoad running');
	if(!lr_server) lr_server = livereload.createServer();
	return lr_server.watch(`build`);
};

module.exports = addPartial(livereload);