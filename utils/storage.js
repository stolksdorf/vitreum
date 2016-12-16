global.vitreum = {
	title : null,
	meta : [],
	deps : {}
};

module.exports = {
	title : (val=false) => {
		if(val !== false) global.vitreum.title = val;
		return global.vitreum.title;
	},
	meta : (val) => {
		if(val === false) global.vitreum.meta = [];
		if(val) global.vitreum.meta.push(val);
		return global.vitreum.meta;
	},
	deps : (name, val) => {
		if(val) global.vitreum.deps[name] = val;
		return global.vitreum.deps[name];
	}
};