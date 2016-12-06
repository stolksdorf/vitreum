const log = require('./utils/timeLog.js');
const fse = require('fs-extra');


const clean = (yo, b) => {
	console.log(yo, b);
	const endLog = log('clean');
	return new Promise((resolve, reject) => {
		fse.emptydir('./build', (err)=>{
			if(err) return reject(err);
			endLog();
			return resolve();
		})
	});
};

clean.partial = (...args) => {
	return clean.bind(this, ...args)
}

module.exports = clean;