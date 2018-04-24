global.vitreum = {
	meta : [],
	less : {}
};

module.exports = {
	meta : (val) => {
		if(val === false) global.vitreum.meta = [];
		if(val) global.vitreum.meta.push(val);
		return global.vitreum.meta;
	},
	less : (key, val)=>{
		if(key === false) global.vitreum.less = {};
		if(val) global.vitreum.less[key] = val;
		return global.vitreum.less;
	}
};