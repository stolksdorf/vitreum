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

module.exports = getStack;