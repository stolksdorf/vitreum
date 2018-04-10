const path = require('path');
const fse  = require('fs-extra');

module.exports = {
	name : 'assets',
	test  : (filepath)=>true,
	apply : async (filepath, contents, opts)=>{

		//TODO: add an embed flag

		//if(opts.embed === true || opts.embed.some((embed)=>embed.match(filepath))){
			// Read in file, base64 encode, module.exports=url pathing to base64 encoding
		//
		const assetPath = `/assets/${opts.entry.name}/${path.relative(opts.entry.dir, filepath)}`;

		await fse.ensureDir(path.dirname(`${opts.build}${assetPath}`));
		await fse.copy(filepath, `${opts.build}${assetPath}`);
		return `module.exports='${assetPath}';`;
	}
}