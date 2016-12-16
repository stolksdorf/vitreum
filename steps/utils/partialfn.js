module.exports = (fn)=>{
	fn.partial = function(...args){
		return fn.bind(this, ...args);
	};
	return fn;
};