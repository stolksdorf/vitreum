const livereload = require('livereload');
let lr_server;

/*
module.exports = (name) => {
	console.log(`livereloading build/${name}`);
	if(!lr_server) lr_server = livereload.createServer();
	return lr_server.watch(`build/${name}`);
}
*/

module.exports = (name) => {
	//log.watch('live reoad running')
	if(!lr_server) lr_server = livereload.createServer();
	return lr_server.watch(`build`);
}