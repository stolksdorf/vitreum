const fse = require('fs-extra');
const path = require('path');

const getRenderedTemplate = (template, opts)=>{
	const paths = opts.paths;
	const head = `<link rel='stylesheet' type='text/css' href='/${opts.entry.name}/${paths.style}' />\n	\${metatags}`;
	const body = `<main id='vitreum-root'>\${component}</main>`;
	const tail = `<script src='/${paths.libs}'></script>
	<script src='/${opts.entry.name}/${paths.code}'></script>
	<script>
		(function(){
			require('react-dom').hydrate(
				require('react').createElement(${opts.entry.name}, \${JSON.stringify(props)}),
				document.getElementById('vitreum-root')
			);
		})();
	</script>`;
	return template(head, body, tail);
};


//TODO: replace opts with just the entry name
module.exports = async (opts={})=>{
	const paths = opts.paths;
	const renderedTemplate = getRenderedTemplate(opts.template, opts);
	const code = `const ReactDOMServer = require('react-dom/server');
const React = require('react');
const meta = require('vitreum/lib/utils/meta.utils.js');

module.exports = (props)=>{
	${opts.dev ? `delete require.cache[require.resolve('./${paths.code}')];` : ''}
	const Element = require('./${paths.code}');
	//TODO: check that this is a react component
	// https://github.com/treyhuffine/is-react/blob/master/index.js
	if(!Object.keys(Element).length && typeof Element !== 'function'){
		throw new Error('${opts.entry.name} component was improperly built. Check the /build folder.');
	}
	const component = ReactDOMServer.renderToString(React.createElement(Element, props));

	//TODO: check if rendered component, react.isValidElement(component)

	const metatags  = meta.generateTags();
	return \`${renderedTemplate}\`;
};`;

	await fse.writeFile(`${paths.build}/${opts.entry.name}/${paths.render}`, code);
	if(opts.static){
		//TODO: use the utils require
		const renderer = require(path.resolve(process.cwd(), `${paths.build}/${opts.entry.name}/${paths.render}`));
		await fse.writeFile(`${paths.build}/${opts.entry.name}/${paths.static}`, renderer())
	}
};
