const test = require('pico-check');
const Style = require('../../lib/transforms/style.transform.js');
const Less = require('../../lib/utils/less.js');

const opts = {
	build:'./tests/build',
	entry : {
		dir : __dirname,
		name : 'assetsTest'
	}
};

test.skip()('Moves assets and returns proper path', (t)=>{


});


test.skip()('Can handle weird extensions', (t)=>{


});



test.skip()('Can base64 encode and embed assets', (t)=>{


});


module.exports = test;