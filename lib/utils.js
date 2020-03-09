const path = require('path');
const fs = require('fs');

const fse = require('fs-extra');
// const chalk = Object.entries({
// 	bright  :'\x1b[1m',
// 	dim     :'\x1b[2m',
// 	red     :'\x1b[31m',
// 	green   :'\x1b[32m',
// 	yellow  :'\x1b[33m',
// 	blue    :'\x1b[34m',
// 	magenta :'\x1b[35m',
// 	cyan    :'\x1b[36m',
// 	white   :'\x1b[37m'
// }).reduce((acc, [name, val])=>{acc[name] = (txt)=>val+txt+'\x1b[0m';return acc;},{});



// const chalk = Object.entries({bright:1,dim:2,red:31,green:32,yellow:33,blue:34,magenta:35,cyan:36,white:37})
// 	.reduce((acc, [name, id])=>{return {...acc, [name] : (txt)=>`\x1b[${id}m${txt}\x1b[0m`}});


const chalk = Object.entries({
	bright:1,  dim:2,     red:31,
	green:32,  yellow:33, blue:34,
	magenta:35,cyan:36,   white:37
}).reduce((acc, [name, id])=>{return {...acc, [name] : (txt)=>`\x1b[${id}m${txt}\x1b[0m`}});



// const chalk = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
// 	.reduce((acc, name, idx)=>{return {...acc, [name] : (txt)=>`\x1b[${31+idx}m${txt}\x1b[0m`}});


// const chalk = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
// 	.reduce((acc, name, idx)=>{return {...acc, [name] : (txt)=>`\x1b[${31+idx}m${txt}\x1b[0m`}});

//.reduce((acc, name, idx)=>{acc[name] = (txt)=>`\x1b[${31+idx}m${txt}\x1b[0m`;return acc;},{});
//.reduce((acc, name, idx)=>{return {...acc, [name] : (txt)=>`\x1b[${31+idx}m${txt}\x1b[0m`}});


const _internalPaths = Object.keys(process.binding('natives')).concat(['bootstrap_node', 'node']).map((name) => `${name}.js`);
const getStack = (idx=false)=>{
	const stack = (new Error()).stack.split('\n').map((raw)=>{
		const [_, name, file, line, col] =
			/    at (.*?) \((.*?):(\d*):(\d*)\)/.exec(raw) || /    at ()(.*?):(\d*):(\d*)/.exec(raw) || [];
		return { name, file, line : Number(line), col  : Number(col), raw };
	}).filter(({file})=>!!file && !_internalPaths.includes(file)).slice(1);
	if(idx !== false) return stack[idx];
	return stack;
};

const relativePath = (fp='.', offset=1)=>path.resolve(path.dirname(getStack(offset).file), fp);
const decache = (fp)=>delete require.cache[relativePath(fp, 2)];

const read = async (fp)=>{};
const writeFile = async (fp, contents)=>{
	await fse.ensureFile(fp);
	await fse.writeFile(fp, contents);
};

module.exports = {
	chalk,
	relativePath,
	decache,
	writeFile
}