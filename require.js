const utils      = require('./lib/utils.js');
const path       = require('path');
const browserify = require('browserify');
const transform  = require('./lib/transforms');
const getOpts    = require('./lib/getopts.js');

let Cache = {};

module.exports = async (targetFile, useCache=true)=>{
	const fullTargetPath = path.resolve(path.dirname(module.parent.filename), targetFile);
	const opts = getOpts({app:'', entry:{}}, fullTargetPath);

	return new Promise((resolve, reject)=>{
		if(useCache && Cache[fullTargetPath]) return resolve(Cache[fullTargetPath]);
		browserify({
			standalone    : '___',
			paths         : opts.shared,
			ignoreMissing : true,
			node          : true,
			postFilter    : (id, filepath, pkg)=>utils.shouldBundle(filepath, id, opts),
		})
		.require(fullTargetPath)
		.transform((file)=>transform(file, opts), {global :true})
		.bundle((err, buf)=>{
			if(err) return reject(err);
			const code = `(function() { ${buf.toString()}\nreturn module.exports;}())`;
			Cache[fullTargetPath] = eval(code);
			return resolve(Cache[fullTargetPath]);
		});
	})
};