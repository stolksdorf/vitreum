const test = require('pico-check');
const Svg = require('../../lib/transforms/svg.transform.js');

const opts = {
	build:'./tests/build',
	entry : {
		dir : __dirname,
		name : 'svgTest'
	}
};



test.skip()('Renders a standard svg to a react element', (t)=>{


});

test.skip()('Can pass props to it', (t)=>{


});

test.skip()('SVGs tags are filtered and optimized', (t)=>{


});


module.exports = test;