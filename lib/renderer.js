const fse = require('fs-extra');
const path = require('path');

const getRenderedTemplate = (template, opts)=>{
	const paths = opts.paths;

	let head = `<link rel='stylesheet' type='text/css' href='${opts.rootPath}/${opts.entry.name}/${paths.style}' />\n\${headtags}`;
	if(opts.embed){
		head = `<style>\${style}</style>\n		\${headtags}`;
	}

	const body = `<main id='vitreum-root'>\${component}</main>`;

	let imports = `<script src='${opts.rootPath}/${paths.libs}'></script>\n`
		+ `<script src='${opts.rootPath}/${opts.entry.name}/${paths.code}'></script>`
	if(opts.embed){
		imports = `<script>\${libs}</script>\n\t<script>\${bundle}</script>`
	}

	const start = opts.static ? 'render' : 'hydrate';

	const bootstrap = `\n\t<script>
		(function(){
			require('react-dom').${start}(
				require('react').createElement(${opts.entry.name}, \${propsString}),
				document.getElementById('vitreum-root')
			);
		})();
	</script>`;

	const tail = imports + bootstrap
	return template(head, body, tail);
};
module.exports = async (opts={})=>{
	const paths = opts.paths;
	const code = `const ReactDOMServer = require('react-dom/server');
const React = require('react');
const Headtags = require('vitreum/headtags.js');
${opts.embed ? `const fs = require('fs');` : ''}
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
	${opts.embed ?
		`const style=fs.readFileSync('${paths.build}/${opts.entry.name}/${paths.style}');
	const libs=fs.readFileSync('${paths.build}/${paths.libs}');
	const bundle=fs.readFileSync('${paths.build}/${opts.entry.name}/${paths.code}');
		` : ''}
	const html = \`${getRenderedTemplate(opts.template, opts)}\`;
	if(opts.cache) cache[propsString] = html;
	return html;
};`;
	await fse.writeFile(`${paths.build}/${opts.entry.name}/${paths.render}`, code);
};

