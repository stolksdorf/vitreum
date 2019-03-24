const { execSync } = require('child_process');
const Libs = require('../lib/templates/libs.js');


const projectLibs = ()=>{
	console.log('Installing all needed libs for test project...');

	console.log(execSync(`npm i ${Libs.standard.join(' ').replace(' vitreum', '')} ${Libs.peer.join(' ')} source-map-support`).toString());
	console.log();
}


//coreLibs();
projectLibs();

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