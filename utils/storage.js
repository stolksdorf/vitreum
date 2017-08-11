global.vitreum = {
	meta : [],
	deps : {},
	entryDir : {}
};

module.exports = {
	meta : (val) => {
		if(val === false) global.vitreum.meta = [];
		if(val) global.vitreum.meta.push(val);
		return global.vitreum.meta;
	},
	deps : (name, val) => {
		if(val) global.vitreum.deps[name] = val;
		return global.vitreum.deps[name];
	},
	entryDir : (name, val) => {
		if(val) global.vitreum.entryDir[name] = val;
		return global.vitreum.entryDir[name];
	}
};