const test = require('pico-check');
const Yaml = require('../../lib/transforms/yaml.js');

const opts = {
	build:'./tests/build',
	entry : {
		dir : __dirname,
		name : 'yamlTest'
	}
};



test.skip()('Loads a standard YAML file', (t)=>{
	const res = Yaml.apply(null, ``, opts);


});

test.skip()('Throws errors if YAML is improperly formatted', (t)=>{


});


module.exports = test;