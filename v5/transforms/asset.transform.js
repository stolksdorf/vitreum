const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'assets',
	test  : (filepath)=>true,
	apply : async (filepath, contents, ctx)=>{
		const assetPath = `/assets/${ctx.entry.name}/${path.relative(ctx.entry.dir, filepath)}`;
		await fse.ensureDir(path.dirname(`${ctx.build}${assetPath}`));
		await fse.copy(filepath, `${ctx.build}${assetPath}`);
		return `module.exports='${assetPath}';`
	}
}