//const _ = require('lodash');

//const storage = require('./utils/storage.js');
//const log = require('./utils/timeLog.js');

//const isProd = process.env.NODE_ENV === 'production';


//const fs = require('fs');




const addPartial = require('./utils/addPartial.js');

const chokidar  = require('chokidar');



const LessStep = require('./less.js');

/*
if(fs.existsSync(lessName)) {
	result.push('@import "' + lessName + '";')
}
*/

//TODO: Should close watcher on error

const watch = (name, shared=[]) => {

	//TODO: pull from storage
	const rootPath = `client/${name}`;


	return LessStep(name, shared)
		.then(() => {
			chokidar.watch(`${rootPath}/**/*.less`)
				.on('change', LessStep.partial(name, shared))

			console.log(`Enabling less-watch for ${name}   ✓`);
		})


/*
	return new Promise((resolve) => {

		var server = livereload.createServer();

		server.watch(__dirname + "/public");



	});

*/
};

module.exports = watch;