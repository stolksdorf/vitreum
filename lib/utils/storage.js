global.vitreum = {
	meta : [],
	less : []
};

module.exports = {
	meta : (val) => {
		if(val === false) global.vitreum.meta = [];
		if(val) global.vitreum.meta.push(val);
		return global.vitreum.meta;
	},
	less : (val)=>{
		if(val === false) global.vitreum.less = [];
		if(val) global.vitreum.less.push(val);
		return global.vitreum.less;
	}
};