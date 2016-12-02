
const Bundler = require('./utils/bundler.js');

const label = 'js';

const runBundle = (name, path, libs, shared)=>{
	const label = `${name}-js`;
	console.time(label);

	const bundler = Bundler.get(name, path, libs)

	return Bundler.run(name, bundler)
		.then(()=>{
			console.timeEnd(label);
		});
}


module.exports = runBundle;