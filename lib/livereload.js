const livereload = require('livereload');
const chalk = require('../utils/chalk.js');

module.exports = (watchPath=process.cwd())=>{
	const lr = livereload.createServer();
	lr.server.on('error', (err)=>{
		if(err.code == 'EADDRINUSE'){
			console.log('ERR: Could not setup LiveReload conection. This is because another livereload instance is running.');
		}else{
			throw err;
		}
	})
	console.log(chalk.green('listening for LiveReload changes:\t'), watchPath);
	lr.watch(watchPath);
}
