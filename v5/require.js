
//potentially use: https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options

const browserify = require('browserify');


const utils = require('./utils.js');
const transform = require('./transforms');
const getOpts = require('./default.opts.js');


// TODO: use child_process execSync, but use a browserify commandline
// opts, bundleExternal: false, ignoreMIssing

module.exports = async (modPath)=>{

	const opts = getOpts(opts, [modPath]);


	const bundler = browserify({
			standalone : modPath,
			paths      : opts.shared,
			ignoreMissing : true,
			postFilter : (id, filepath, pkg)=>filepath.indexOf('node_modules') == -1
		})
		.require(opts.targets[0])
		.transform((file)=>transform(ctx, file), /*{global : true}*/);

	utils.bundle(bundler)
		.then((code)=>{

		})





}