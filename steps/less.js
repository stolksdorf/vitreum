const _ = require('lodash');

const storage = require('./utils/storage.js');

const isProd = process.env.NODE_ENV === 'production';

const less = require('less');

const fs = require('fs');


/*
if(fs.existsSync(lessName)) {
	result.push('@import "' + lessName + '";')
}
*/



const runStyle = (name, shared=[]) => {
	const label = `${name}-less`;
	console.time(label);


	return new Promise((resolve) => {

		var file = _.map(_.keys(storage.get(name)), (jsx)=>{
			return `@import "${jsx.replace('.jsx', '.less')}";`
		}).join('\n');

		less.render(file,
			{
				paths: shared,  // Specify search paths for @import directives
				filename: `${name}.less`, // Specify a filename, for better error messages
				compress: isProd,

				sourceMap: {sourceMapFileInline: !isProd}
			},
			(err, res) => {

			fs.writeFile(`build/${name}/bundle.css`, res.css, (err)=>{
				console.timeEnd(label);
				return resolve();
			});
		})

	});
};

module.exports = runStyle;