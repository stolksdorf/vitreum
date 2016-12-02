const watchify = require('watchify');
const Bundler = require('./utils/bundler.js');

const isProd = process.env.NODE_ENV === 'production';



const chalk = require('chalk');

const watch = (name, path, libs)=>{

	const label = `${name}-js`;

	console.time(label);
	return new Promise((resolve) => {
		const bundler = watchify(Bundler.get(name, path, libs));

		bundler.on('update', ()=>{
			const label2 = `${name}-rebuild`;
			console.time(label2);
			Bundler.run(name, bundler)
				.then(()=>{
					console.timeEnd(label2);
				})
		});

		Bundler.run(name, bundler)
			.then(()=>{
				console.timeEnd(label)
				return resolve();
			})
	});
}

module.exports = watch;