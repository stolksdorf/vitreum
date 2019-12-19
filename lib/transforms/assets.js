const path = require('path');
const fse  = require('fs-extra');

const fixSep = (str)=>str.replace(/\\/g, '/');

module.exports = {
	name : 'assets',
	test  : (filePath)=>true,
	apply : async (filePath, contents, opts)=>{
		const relative = fixSep(path.relative(opts.entry.dir, filePath)).replace(/\.\.\//g, '');
		const assetPath = path.join('assets', opts.entry.name, relative);
		const buildPath = path.join(opts.paths.build, assetPath);

		try{
			const info = await fse.lstat(buildPath);
			if(info.isSymbolicLink()) await fse.unlink(buildPath);
		}catch(err){
			if(err.code != 'ENOENT') throw err;
		}

		await fse.ensureDir(path.dirname(buildPath));
		if(opts.prod){
			await fse.copy(filePath, buildPath);
		}else{
			await fse.symlink(filePath, buildPath);
		}


		if(opts.pathOnly) return `/${fixSep(assetPath)}`;
		return `module.exports='/${fixSep(assetPath)}';`;
	}
}