// const label = 'dev';
// console.time(label);

// const _ = require('lodash');
// const steps = require('../../steps');
// const Proj = require('./project.js');

// Promise.resolve()
// 	.then(() => Promise.all(_.map(Proj.entryPoints, (path, name) => {
// 		return steps.jsxWatch(name, path, {
// 			libs       : Proj.libs,
// 			shared     : Proj.shared,
// 			transforms : []
// 		})
// 			.then((deps) => steps.lessWatch(name, { shared: Proj.shared }, deps));
// 	})))
// 	.then(() => steps.assetsWatch(Proj.assets, Proj.shared))
// 	.then(() => steps.livereload())
// 	.then(() => steps.serverWatch('./app.js', ['server']))
// 	.then(() => console.timeEnd(label))
// 	.catch((err) => console.error(err));

const entryPoint = './client/main/main.jsx';
//const entryPoint = './client/example/a.js';
const dev = require('../../v5/dev.js');

dev(entryPoint, {})
	.then(()=>{
		console.log('done');
	})
	.catch((err)=>{
		console.log(err);
	})