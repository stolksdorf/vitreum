const Bundler = require('./utils/bundler.js');
const log = require('./utils/timeLog.js');


const runBundle = (name, path, libs, shared)=>{
	const logEnd = log(`${name}[js]`);

	const bundler = Bundler.get(name, path, libs)

	return Bundler.run(name, bundler)
		.then(logEnd)

}


module.exports = runBundle;