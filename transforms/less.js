const LessLib = require('less');

const clearLessCache = ()=>{
	const fileManagers = LessLib.environment && LessLib.environment.fileManagers || [];
	fileManagers.forEach((fileManager)=>{
		if(fileManager.contents) fileManager.contents = {};
	});
};

const imports = new Set();
const transform = (code, fp, opts)=>imports.add(fp);

transform.generate = async (dev=false)=>{
	clearLessCache();
	const lessCode = Array.from(imports).reverse().map((fp)=>`@import (less) "${fp}";`).join('\n');
	return await LessLib.render(lessCode, {
		compress  : !dev,
		sourceMap : (dev ? {
			sourceMapFileInline: true,
			outputSourceFiles: true
		} : false),
	})
	.then(({css})=>css);
};

module.exports = transform;