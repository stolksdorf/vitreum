const path       = require('path');
const utils      = require('./lib/utils.js');
const browserify = require('browserify');
const transform  = require('./lib/transforms');
const getOpts    = require('./lib/getopts.js');

module.exports = (filepath)=>{
	const fullTargetPath = path.resolve(utils.getCaller().file, filepath);
	const opts = getOpts({app:'', entry:{}}, fullTargetPath);
	return new Promise((resolve, reject)=>{
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
			return resolve(eval(code));
		});
	})
};