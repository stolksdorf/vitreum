let cache = {}
const transform = (code, fp, opts)=>{
	cache[fp]=code;
}
//TODO: figure out how to make sourcemaps for generic css
//https://github.com/floridoo/concat-with-sourcemaps
transform.generate = ()=>Object.values(cache).join('\n');

module.exports = transform;