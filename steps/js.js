const Bundler = require('./utils/bundler.js');
const log = require('./utils/timeLog.js');
const addPartial = require('./utils/addPartial.js');


const runJSBundle = (name, path, libs, shared)=>{
	const logEnd = log(`${name}[js]`);
	return Bundler
		.run(name, Bundler.get(name, path, libs))
		.then((res) => {
			logEnd();
			return res;
		})
};

module.exports = addPartial(runJSBundle);
