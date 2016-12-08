let storage = {};
let deps = {};
let entryDir = {};


//Rename to watch.storage

module.exports = {
	get : (key) => { return storage[key]; },
	set : (key, value) => { storage[key] = value; },



	deps : (name, val=false) => {
		if(val === false) deps[name] = val;
		return deps[name];
	},
	entryDir : (name, val=false) => {
		if(val === false) entryDir[name] = val;
		return entryDir[name];
	},


	clear : () => { storage = {}; }
}