const { execSync } = require('child_process');
const Libs = require('../lib/templates/libs.js');


const peerlibs = ()=>{
	console.log('Installing all peer libs needed libs for vitreum...');
	console.log(execSync(`npm i --no-save ${Libs.peer.join(' ')}`).toString());
}


const coreLibs = ()=>{
	console.log('Installing all needed libs for vitreum...');

	console.log(execSync(`npm i --no-save ${Libs.standard.join(' ').replace(' vitreum', '')} ${Libs.peer.join(' ')}`).toString());
	console.log();
	console.log('  Navigate to `../vitreum_test` and `$ npm run build` to experiment with changes.');
}

const projectLibs = ()=>{
	console.log('Installing all needed libs for text project...');
	//react, react-dom

	console.log(execSync(`cd ../vitreum_test && npm i ${Libs.peer.join(' ')}`).toString());
	console.log();
	//console.log(execSync(`npm link ../vitreum`).toString());
	console.log('  Navigate to `../vitreum_test` and `$ npm run build` to experiment with changes.');
}

peerlibs();

//coreLibs();
//projectLibs();

// console.log('Installing all needed libs locally...');

// exec(`npm i --no-save ${Libs.standard.join(' ').replace(' vitreum', '')} ${Libs.peer.join(' ')}`, (err, stdout, stderr) => {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	}
// 	console.log(stdout);
// 	console.log();
// 	console.log('  Navigate to `../vitreum_test` and `$ npm run build` to experiment with changes.');
// });