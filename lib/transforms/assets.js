const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'assets',
	test  : (filepath)=>true,
	apply : async (filepath, contents, opts)=>{

		//TODO: add an embed flag

		//if(opts.embed === true || opts.embed.some((embed)=>embed.match(filepath))){
			// Read in file if no contents, base64 encode, module.exports=url pathing to base64 encoding
		//

		const assetPath = path.join('assets', opts.entry.name, path.relative(opts.entry.dir, filepath));

		const buildPath = path.join(opts.paths.build, assetPath);
		await fse.ensureDir(path.dirname(buildPath));
		await fse.copy(filepath, buildPath);

		if(opts.raw) return `/${assetPath.replace(/\\/g, '/')}`;
		return `module.exports='/${assetPath.replace(/\\/g, '/')}';`;
	}
}