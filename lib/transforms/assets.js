const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'assets',
	test  : (filepath)=>true,
	apply : async (filepath, contents, opts)=>{
		const sep = path.sep == '\\' ? '\\\\' : '/';
		//TODO: add an embed flag
		//if(opts.embed === true || opts.embed.some((embed)=>embed.match(filepath))){
			// Read in file if no contents, base64 encode, module.exports=url pathing to base64 encoding
		//

		const rel = path.relative(opts.entry.dir, filepath).replace(/\\/g, '/');
		const newrel = rel.replace(/\.\.\//g, '');
		const assetPath = path.join('assets', opts.entry.name, newrel);

		if(opts.pathOnly) return `/${assetPath.replace(/\\/g, '/')}`;

		const buildPath = path.join(opts.paths.build, assetPath);
		await fse.ensureDir(path.dirname(buildPath));
		await fse.copy(filepath, buildPath);
		return `module.exports='/${assetPath.replace(/\\/g, '/')}';`;
	}
}