const _ = require('lodash');
const nodemon = require('nodemon');
const path = require('path');


const log = require('./utils/log.js');
const addPartial = require('./utils/addPartial.js');


const watchServer = (serverPath, watchFolders=[])=>{
	nodemon({
		script: serverPath,
		watch: _.map(_.concat(watchFolders, serverPath), (watch)=>{
			return path.normalize(watch)
		})
	});
	nodemon.on('start', () => {
		//TODO: make all endabled a special color
		log.watch(`Enabled server watching   ✓ 👁 🕒 `);
	}).on('restart', (files) => {
		console.log('Server restart');
	});
	return Promise.resolve();
};

module.exports = addPartial(watchServer);
