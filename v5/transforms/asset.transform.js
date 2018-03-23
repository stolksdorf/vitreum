const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'assets',
	test  : (filepath)=>true,
	apply : async (filepath, contents, opts)=>{
		const assetPath = `/assets/${opts.entry.name}/${path.relative(opts.entry.dir, filepath)}`;

		await fse.ensureDir(path.dirname(`${opts.build}${assetPath}`));
		await fse.copy(filepath, `${opts.build}${assetPath}`);
		return `module.exports='${assetPath}';`
	}
}