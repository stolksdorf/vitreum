const livereload = require('livereload');
const utils = require('.utils.js');

module.exports = (watchPath)=>{
	const lr = livereload.createServer();
	lr.server.on('error', (err)=>{
		if(err.code == 'EADDRINUSE'){
			console.log('ERR: Could not setup LiveReload conection. This is because another livereload instance is running.');
		}else{
			throw err;
		}
	})
	lr.watch(utils.rel(watchPath, 2);
}
