const server = require('../../lib/server.js');
const utils = require('../../lib/utils.js');


server({
	port : 8001,
	root : utils.rel()
})