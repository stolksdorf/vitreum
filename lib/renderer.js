const fse = require('fs-extra');
const path = require('path');

const getRenderedTemplate = (template, opts)=>{
	const paths = opts.paths;
	const head = `<script>vitreum_props=\${propsString};</script>
		<link rel='stylesheet' type='text/css' href='/${opts.entry.name}/${paths.style}' />
		\${headtags}`;
	const body = `<main id='vitreum-root'>\${component}</main>`;
	const tail = `<script src='/${paths.libs}'></script>
	<script src='/${opts.entry.name}/${paths.code}'></script>
	<script>
		(function(){
			require('react-dom').hydrate(
				require('react').createElement(${opts.entry.name}, vitreum_props),
				document.getElementById('vitreum-root')
			);
		})();
	</script>`;
	return template(head, body, tail);
};
module.exports = async (opts={})=>{
	const paths = opts.paths;
	const code = `const ReactDOMServer = require('react-dom/server');
const React = require('react');
const Headtags = require('vitreum/headtags.js');
let cache = {};
${opts.dev ? `require('source-map-support/register');` : ''}

module.exports = (props, opts={})=>{
	opts = Object.assign({render:true, cache:false}, opts);
	let component = '', headtags = '';
	const propsString = JSON.stringify(props);
	if(opts.cache && cache[propsString]) return cache[propsString];
	if(opts.render){
		${opts.dev ? `delete require.cache[require.resolve('./${paths.code}')];` : ''}
		global.vitreum_props = props;
		const Element = require('./${paths.code}');
		if(!Object.keys(Element).length && typeof Element !== 'function'){
			throw new Error('${opts.entry.name} component was improperly built. Check the /build folder.');
		}
		component = ReactDOMServer.renderToString(React.createElement(Element, props));
		headtags = Headtags.generate();
	}
	const html = \`${getRenderedTemplate(opts.template, opts)}\`;
	if(opts.cache) cache[propsString] = html;
	return html;
};`;
	await fse.writeFile(`${paths.build}/${opts.entry.name}/${paths.render}`, code);
	if(opts.static){
		//TODO: use the utils require
		const renderer = require(path.resolve(process.cwd(), `${paths.build}/${opts.entry.name}/${paths.render}`));
		await fse.writeFile(`${paths.build}/${opts.entry.name}/${paths.static}`, renderer())
	}
};
