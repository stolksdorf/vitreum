const chalk = Object.entries({
	bright: 1,  dim:   2,  red:  31,
	green:  32, yellow:33, blue: 34,
	magenta:35, cyan:  36, white:37
}).reduce((acc, [name, id])=>{return {...acc, [name]:(txt)=>`\x1b[${id}m${txt}\x1b[0m`}});

module.exports = chalk;