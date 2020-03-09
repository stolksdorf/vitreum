const LessLib = require('less');

//TODO: make the requires into a util, takes a transform fn
// returns a list of paths, plus transformed code

const clearLessCache = ()=>{
	const fileManagers = LessLib.environment && LessLib.environment.fileManagers || [];
	fileManagers.forEach((fileManager)=>{
		if(fileManager.contents) fileManager.contents = {};
	});
};

const imports = new Set();
const styleTransform = (code, fp, opts)=>imports.add(fp);

styleTransform.renderToCSS = async (dev=false)=>{
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
}

module.exports = styleTransform;