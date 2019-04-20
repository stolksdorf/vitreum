const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'assets',
	test  : (filepath)=>true,
	apply : async (filepath, contents, opts)=>{
		const sep = path.sep == '\\' ? '\\\\' : '/';

		const rel = path.relative(opts.entry.dir, filepath).replace(/\\/g, '/');
		const newrel = rel.replace(/\.\.\//g, '');
		const assetPath = path.join('assets', opts.entry.name, newrel);
		const buildPath = path.join(opts.paths.build, assetPath);

		try{
			const info = await fse.lstat(buildPath);
			if(info.isSymbolicLink()) await fse.unlink(buildPath);
		}catch(err){
			if(err.code != 'ENOENT') throw err;
		}

		await fse.ensureDir(path.dirname(buildPath));
		await fse.symlink(filepath, buildPath);

		if(opts.pathOnly) return `/${assetPath.replace(/\\/g, '/')}`;
		return `module.exports='/${assetPath.replace(/\\/g, '/')}';`;
	}
}