const path = require('path');
const selfpath = path.join(__dirname, 'require.js');
const getOpts   = require('./lib/getopts.js');
const fse = require('fs-extra');
const keyName = '____';

if(process.argv[1] != selfpath){
	const child_process = require('child_process');
	const vm = require('vm');
	return module.exports = (targetPath)=>{
		const fullTargetPath = path.resolve(path.dirname(module.parent.filename), targetPath);
		const cmd = `node ${__dirname}/require.js ${fullTargetPath}`;
		const compiledCode = child_process.execSync(cmd).toString();
		const sandbox = {};
		vm.runInNewContext(compiledCode, sandbox);
		return sandbox[keyName];
	}
}else{
	const browserify = require('browserify');
	const transform = require('./lib/transforms');
	const targetFile = process.argv[2];
	const opts = getOpts({app:''}, targetFile);
	browserify(targetFile, {
			standalone    : keyName,
			paths         : opts.shared,
			ignoreMissing : true,
		})
		.transform((file)=>transform(file, opts))
		.bundle((err, buf)=>{
			if(err) return process.stderr.write(err.toString());
			process.stdout.write(buf.toString())
		});
}