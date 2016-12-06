module.exports = (fn)=>{
	fn.partial = (...args)=>{
		return fn.bind(this, ...args);
	};
	return fn;
};