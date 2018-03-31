const path = require('path');
const fse  = require('fs-extra');

const code = require('./code.transform.js');
const style = require('./style.transform.js');

module.exports = {
	name : 'litprog',
	//TODO: .lp.md won't work
	test  : (filepath)=>filepath.endsWith('.lp') || filepath.endsWith('.lp.md'),
	apply : async (filepath, contents, opts)=>{
		const extractCodeblocks = new RegExp('```([a-z]*)\n([\s\S]*?\n)```', 'g');

		//filter and sort by type
		//group by type and concat, then pass through code/style transforms

		//good and conca

		//

	}
}