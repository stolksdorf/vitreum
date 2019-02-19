const test = require('pico-check');
const React  = require('react');
const ReactDOMServer = require('react-dom/server');
const html2json  = require('html2json').html2json;


const Headtags = require('../headtags.js');

const render = (el, props, content)=>ReactDOMServer.renderToString(React.createElement(el, props, content));
const getHead = ()=>{
	const raw = Headtags.generate();
	return {
		tags : html2json(raw).child,
		raw
	}
};
const hasSelfClose = (str)=>str.endsWith('/>');


test.group('Title', (test)=>{
	test('works', (t)=>{
		render(Headtags.Title, {}, 'I am a title');
		const {tags, raw} = getHead();
		t.is(tags[0].tag, 'title');
		t.is(tags[0].attr, undefined);
		t.is(tags[0].child[0].text, 'I am a title');
		t.not(hasSelfClose(raw));
	});
});

test.group('Description', (test)=>{
	test('basic props work', (t)=>{
		const desc = 'I am a description';
		render(Headtags.Description, {}, desc);
		const {tags, raw} = getHead();
		t.is(tags[0].tag, 'meta');
		t.is(tags[0].attr.content, desc.split(' '));
		t.is(tags[0].attr.name,'description');
		t.is(tags[0].child, undefined);
		t.not(hasSelfClose(raw));
	});
})

test.group('Favicon', (test)=>{
	test('basic props work', (t)=>{
		render(Headtags.Favicon, {href : '/fancy.png'});
		const {tags, raw} = getHead();
		t.is(tags[0].tag, 'link');
		t.is(tags[0].attr.id, 'favicon');
		t.is(tags[0].attr.rel, ['shortcut', 'icon']);
		t.is(tags[0].attr.type, 'image/png');
		t.is(tags[0].attr.href, '/fancy.png');
		t.is(tags[0].child, undefined);
		t.ok(hasSelfClose(raw));
	});
	test('adv props work', (t)=>{
		render(Headtags.Favicon, {type: 'image/x-icon', href : '/fancy.ico', rel : 'icon'});
		const {tags, raw} = getHead();
		t.is(tags[0].tag, 'link');
		t.is(tags[0].attr.id, 'favicon');
		t.is(tags[0].attr.rel, 'icon');
		t.is(tags[0].attr.type, 'image/x-icon');
		t.is(tags[0].attr.href, '/fancy.ico');
		t.is(tags[0].child, undefined);
	});
});



test.group('Script', (test)=>{
	test('props work', (t)=>{
		render(Headtags.Script, {id : 'yo', src : '/fancy.js'});
		const {tags, raw} = getHead();
		t.is(tags[0].tag, 'script');
		t.is(tags[0].attr.id, 'yo');
		t.is(tags[0].attr.src, '/fancy.js');
		t.is(tags[0].child[0].text, '');
		t.not(hasSelfClose(raw));
	});

	test('content works', (t)=>{
		const code = 'I am javascript';
		render(Headtags.Script, {}, code);
		const {tags, raw} = getHead();
		t.no(tags[0].attr)
		t.is(tags[0].child[0].text, code);
		t.no(hasSelfClose(raw));
	});
});

test.group('Noscript', (test)=>{
	test('props work', (t)=>{
		render(Headtags.Noscript, {}, 'No JS plz.');
		const {tags, raw} = getHead();
		t.is(tags[0].tag, 'noscript');
		t.is(tags[0].attr, undefined);
		t.is(tags[0].child[0].text, 'No JS plz.');
	});
});


test.group('Structured', (test)=>{
	test('complex data', (t)=>{
		const data = {
			context: 'http://schema.org',
			type: 'Organization',
			url: 'http://www.example.com',
			nested: {
				type: 'test',
				foo : 'bar'
			}
		};

		const dataAsString = JSON.stringify({
			'@context': 'http://schema.org',
			'@type': 'Organization',
			url: 'http://www.example.com',
			nested: {
				'@type': 'test',
				foo : 'bar'
			}
		}, null, '  ')

		render(Headtags.Structured, {data});
		const {tags, raw} = getHead();

		t.is(tags[0].tag, 'script');
		t.is(tags[0].attr.type, 'application/ld+json');
		t.is(tags[0].child[0].text, dataAsString);
		t.no(hasSelfClose(raw));
	});
});


test.group('Meta', (test)=>{
	test('simple works', (t)=>{
		render(Headtags.Meta, {property: 'twitter:url', content: 'http://og.gg'});
		const {tags, raw} = getHead();

		t.is(tags[0].tag, 'meta');
		t.is(tags[0].attr.property, 'twitter:url');
		t.is(tags[0].attr.content, 'http://og.gg');

		t.ok(hasSelfClose(raw));
	});


	test('bulk prop', (t)=>{
		render(Headtags.Meta, {bulk : {
			'og:title' : 'My Page',
			'twitter:url' : 'http://og.gg',
		}});
		const {tags, raw} = getHead();

		t.is(tags[0].tag, 'meta');
		t.is(tags[0].attr.property, 'twitter:url');
		t.is(tags[0].attr.content, 'http://og.gg');

		t.is(tags[2].tag, 'meta');
		t.is(tags[2].attr.property, 'og:title');
		t.is(tags[2].attr.content, 'My Page'.split(' '));

		t.ok(hasSelfClose(raw));
	});
})

module.exports = test;