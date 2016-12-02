let storage = {};

module.exports = {
	get : (key) => { return storage[key]; },
	set : (key, value) => { storage[key] = value; },
	clear : () => { storage = {}; }
}