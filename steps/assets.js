

const _ = require('lodash');
const fse = require('fs-extra');
const path = require('path');

const log = require('./utils/timeLog.js');
const addPartial = require('./utils/addPartial.js');



const runAssets = (name, exts=[], shared=[]) => {
	const endLog = log('assets');
	return new Promise((resolve, reject) => {

		//TODO: try adding entryDir to shared list

		//loop over the following for each shared

		const rootPath = './client/main';
		const name = 'main';
		const exts = ['.txt'];

		console.log(path.basename(rootPath));

		let items = [];
		fse.walk(rootPath)
			.on('data', (item) => {
				if(_.includes(exts, path.extname(item.path))){
					items.push(item.path)
				}
			})
			.on('end', function () {
				_.each(items, (assetPath)=>{
					const dest = path.resolve(`./build/assets/${name}`, path.relative(rootPath, assetPath));
					fse.copySync(assetPath, dest);
				})
				endLog();
				return resolve();
			});
		});
};

module.exports = addPartial(runAssets);