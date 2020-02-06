const path = require('path');

const chalk = Object.entries({bright:'\x1b[1m',dim:'\x1b[2m',red:'\x1b[31m',green:'\x1b[32m',yellow:'\x1b[33m',blue:'\x1b[34m',magenta:'\x1b[35m',cyan:'\x1b[36m',white:'\x1b[37m'}).reduce((acc, [name, val])=>{acc[name] = (txt)=>val+txt+'\x1b[0m';return acc;},{});


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

const rel = (fp='.', offset=1)=>path.resolve(path.dirname(getStack(offset).file), fp);
const decache = (fp)=>delete require.cache[rel(fp, 2)];

module.exports = {
	chalk,
	rel,
	decache
}