const test = require('pico-check');
const React  = require('react');
const ReactDOMServer = require('react-dom/server');
const html2json  = require('html2json').html2json;


const Headtags = require('../headtags.js');

const render = (el, props, content)=>ReactDOMServer.renderToString(React.createElement(el, props, content));
const getHead = ()=>html2json(Headtags.generate()).child


test.group('Script', (test)=>{
	test('props work', (t)=>{
		render(Headtags.Script, {id : 'yo', src : '/fancy.js'});
		const res = getHead()[0];
		t.is(res.tag, 'script');
		t.is(res.attr.id, 'yo');
		t.is(res.attr.src, '/fancy.js');
		t.is(res.child[0].text, '');
	});

	test('content works', (t)=>{
		const code = 'I am javascript';
		render(Headtags.Script, {}, code);
		const res = getHead()[0];
		t.no(res.attr)
		t.is(res.child[0].text, code);
	});
});








module.exports = test;