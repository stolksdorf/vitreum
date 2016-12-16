global.vitreum = {
	title : null,
	meta : [],
	deps : {}
};


/*
let storage = {};
let deps = {};
let entryDir = {};
let titles = {};
let metas = {};
*/

//Rename to watch.storage

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

	//Remove below
/*

	get : (key) => { return storage[key]; },
	set : (key, value) => { storage[key] = value; },


	deps : (name, val=false) => {
		if(val !== false) deps[name] = val;
		return deps[name];
	},
	entryDir : (name, val=false) => {
		if(val !== false) entryDir[name] = val;
		return entryDir[name];
	},


	clear : () => { storage = {}; }
*/
}