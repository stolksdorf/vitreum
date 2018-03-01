let config = {};
module.exports = {
	set : (obj) => config=obj,
	add : (path, obj) => config[path]=obj,
	get : (path) => {
		return path.split('.').reduce((res, part) => ((res && res[part]) ? res[part] : undefined), config);
	}
};