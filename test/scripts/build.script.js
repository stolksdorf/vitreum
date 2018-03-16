// const label = 'build';
// console.time(label);

// const _ = require('lodash');
// const steps = require('../../steps');
// const Proj = require('./project.js');

// Promise.resolve()
// 	.then(() => steps.clean())
// 	.then(() => steps.libs(Proj.libs))
// 	.then(() => Promise.all(_.map(Proj.entryPoints, (path, name) => {
// 		return steps.jsx(name, path, {
// 			libs       : Proj.libs,
// 			shared     : Proj.shared,
// 			transforms : [],
// 			silent : true
// 		})
// 			.then((deps) => steps.less(name, { shared: Proj.shared }, deps));
// 	})))
// 	.then(() => steps.assets(Proj.assets, Proj.shared))
// 	.then(() => console.timeEnd(label))
// 	.catch((err) => console.error(err));


const entryPoint = './client/main/main.jsx';
//const entryPoint = './client/example/a.js';
const build = require('../../v5/build.js');

// build([entryPoint, './client/example/d.js'], {})
// 	.then(()=>{
// 		console.log('done');
// 	})


build(entryPoint, {})
	.then(()=>{
		console.log('done');
	})
