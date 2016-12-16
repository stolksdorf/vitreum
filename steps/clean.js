const fse = require('fs-extra');

const log = require('../utils/log.js');
const addPartial = require('../utils/partialfn.js');

const clean = () => {
	const endLog = log.time('clean');
	return new Promise((resolve, reject) => {
		fse.emptydir('./build', (err)=>{
			if(err) return reject(err);
			endLog();
			return resolve();
		})
	});
};


module.exports = addPartial(clean);