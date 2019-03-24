const fse = require('fs-extra');
const path = require('path');

const getRenderedTemplate = (template, opts)=>{
	const paths = opts.paths;
	const head = `<link rel='stylesheet' type='text/css' href='${opts.rootPath}${opts.entry.name}/${paths.style}' />
		\${headtags}`;
	const body = `<main id='vitreum-root'>\${component}</main>`;
	const tail = `<script src='${opts.rootPath}${paths.libs}'></script>
	<script src='${opts.rootPath}${opts.entry.name}/${paths.code}'></script>
	<script>
		(function(){
			require('react-dom').hydrate(
				require('react').createElement(${opts.entry.name}, \${propsString}),
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
		const renderer = require(path.resolve(process.cwd(), `${paths.build}/${opts.entry.name}/${paths.render}`));
		await fse.writeFile(`${paths.build}/${opts.entry.name}/${paths.static}`, renderer());

		const isFirstTarget = opts.targets[0].indexOf(opts.entry.dir) === 0;
		if(isFirstTarget) await fse.writeFile(`${paths.build}/${paths.static}`, renderer());
	}
};
