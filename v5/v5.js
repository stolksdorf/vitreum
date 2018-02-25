const browserify = require('browserify');
const fse = require('fs-extra');
const _     = require('lodash');
const through = require('through2');
const path  = require('path');

const testpath = './a.js'

/*
todo:
- update to through 2
- wrap into a function
- https://github.com/browserify/browserify-handbook#how-node_modules-works
- https://github.com/browserify/browserify-handbook#compiler-pipeline
*/


// const transform = (filename)=>{
// 	console.log('transform', filename);
// 	//if(filename.indexOf('node_modules') !== -1) return through();
// 	var data = '';

// 	const write = (buf)=>{ data += buf }
// 	async function end(){
// 		const res = await handle(filename, data);
// 		if(res) this.queue(res);
// 		this.queue(null);
// 	}
// 	return through(write, end);
// }



const bucket = (regex, handler)=>{

}


const transform = (filename)=>{
	let buffer = '';
	return through(
		function (chunk, enc, next) {
			buffer += chunk.toString();
			next();
		},
		async function (done) {
			const res = await handle(filename, buffer);
			if(res) this.push(res);
			done();
		}
	)


}


const handle = (filename, contents)=>{
	console.log('handling', filename);
	console.log('___________________');
	if(libs[filename]){
		return;
	}

	// if(filename.indexOf('node_modules') !== -1){
	// 	//console.log(bundler);
	// 	//bundler._external.push('lodash');
	// 	console.log('here');
	// 	return;
	// }

	//console.log(contents);

	if(filename.indexOf('.txt') !== -1) return `return '${filename}';`;
	return contents
}



let libs = {}
const parseEntryPoint = (entryPoint)=>{
	return new Promise((resolve, reject)=>{
		const entryName =  path.basename(entryPoint);
		console.log(entryName);
		let bundler = browserify({ /*standalone : entryName,*/ })
			.require(testpath)
			//.external(['lodash'])
			.transform(transform, {global : true})

		bundler.on('file', (filename, id) => {

			if(filename.indexOf('node_modules') !== -1){
				console.log('filename', filename);
				console.log('id', id);
				libs[filename] = id;

				//TODO: try excluding to ignoring, https://github.com/browserify/browserify-handbook#ignoring-and-excluding
				bundler._external.push(id);
			}
		})


		bundler.bundle((err, buf) => {
			if(err) return reject(err);
			fse.writeFileSync('alpha.jsd', buf);
			console.log(libs);
			resolve();
		});
	})
};

const parseLibs = ()=>{
	console.log('Building libs', Object.values(libs));
	return new Promise((resolve, reject)=>{
		let bundler = browserify({ /*standalone : entryName,*/ })
			.require(Object.values(libs))

		bundler.bundle((err, buf) => {
			if(err) return reject(err);
			let code = buf.toString();

			fse.writeFileSync('build.jsd', buf);
		});

	})
}




parseEntryPoint(testpath).then(()=>parseLibs())
