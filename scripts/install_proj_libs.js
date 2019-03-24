const { execSync } = require('child_process');
const Libs = require('../lib/templates/libs.js');

const projectLibs = ()=>{
	console.log('Installing all needed libs for test project...');

	console.log(execSync(`npm i ${Libs.standard.join(' ').replace(' vitreum', '')} ${Libs.peer.join(' ')} source-map-support`).toString());
	console.log();
}

projectLibs();
