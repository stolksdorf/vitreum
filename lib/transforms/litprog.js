const path = require('path');
const fse  = require('fs-extra');

const Code = require('./code.transform.js');
const Style = require('./style.transform.js');

//TODO: use utils.regex

module.exports = {
	name : 'litprog',
	test  : (filepath)=>filepath.endsWith('.lp') || filepath.endsWith('.lp.md'),
	apply : async (filepath, contents, opts)=>{
		const extractCodeblocks = /```([a-z]*)\n([\s\S]*?\n)```/g;
		let match, codeBlocks='', styleBlocks='';
		do{
			match = extractCodeblocks.exec(contents);
			if(!match) continue;
			if(Code.test(`t.${match[1]}`))  codeBlocks += `${match[2]}\n`;
			if(Style.test(`t.${match[1]}`)) styleBlocks += `${match[2]}\n`;
		}while(match);
		await Style.apply(null, styleBlocks, opts);
		return Code.apply(null, codeBlocks, opts);
	}
}