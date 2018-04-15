const test = require('pico-check');
const Style = require('../../lib/transforms/style.transform.js');
const Less = require('../../lib/utils/less.js');

const opts = {
	build:'./tests/build',
	entry : {
		dir : __dirname,
		name : 'styleTest'
	}
};

test('Compiles regular css', async (t)=>{
	const css = `body {
  background-color: red;
}
`;
	const bundled = await Style.apply('', css, opts);
	const complied = await Less.render();
	t.is(bundled, undefined);
	t.is(complied, css);
});

test('Compiles less', async (t)=>{
	const less = `@color : red; body{ background-color: @color; }`;
	const bundled = await Style.apply('', less, opts);
	const complied = await Less.render();
	t.is(bundled, undefined);
	t.is(complied, `body {
  background-color: red;
}
`);
});

test('Can require assets and resolves to urls', async (t)=>{
	const less = `body{
  background-image: require('./hex_bg.jpg');
}`;
	const bundled = await Style.apply('', less, opts);
	const complied = await Less.render();

	t.is(bundled, undefined);
	t.is(complied, `body {
  background-image: url('/assets/styleTest/hex_bg.jpg');
}
`);

});

module.exports = test;