const { execSync } = require('child_process');
const Libs = require('../lib/templates/libs.js');

const peerlibs = ()=>{
	console.log('Installing all peer libs needed libs for vitreum...');
	console.log(execSync(`npm i --no-save ${Libs.peer.join(' ')}`).toString());
}

peerlibs();
