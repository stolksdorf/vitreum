const fse = require('fs-extra');
const path = require('path');

const getRenderedTemplate = (template, entryName, opts)=>{
	const paths = opts.paths;
	const head = `<link rel='stylesheet' type='text/css' href='/${entryName}/${paths.style}' />\n	\${metatags}`;
	const body = `<main id='vitreum-root'>\${component}</main>`;
	const tail = `<script src='/${paths.libs}'></script>
	<script src='/${entryName}/${paths.code}'></script>
	<script>
		(function(){
			require('react-dom').hydrate(
				require('react').createElement(${entryName}, \${JSON.stringify(props)}),
				document.getElementById('vitreum-root')
			);
		})();
	</script>`;
	return template(head, body, tail);
};


//TODO: replace ctx with just the entry name
module.exports = async (ctx, opts={})=>{
	const paths = opts.paths;
	const renderedTemplate = getRenderedTemplate(opts.template, ctx.entry.name, opts);
	const code = `const ReactDOMServer = require('react-dom/server');
const React = require('react');
const meta = require('vitreum/utils/meta.gen.js');

module.exports = (props)=>{
	${opts.dev ? `delete require.cache[require.resolve('./${paths.code}')];` : ''}
	const Element = require('./${paths.code}');
	//TODO: check that this is a react component
	// https://github.com/treyhuffine/is-react/blob/master/index.js
	if(!Object.keys(Element).length && typeof Element !== 'function'){
		throw new Error('${ctx.entry.name} component was improperly built. Check the /build folder.');
	}
	const component = ReactDOMServer.renderToString(React.createElement(Element, props));

	//TODO: check if rendered component, react.isValidElement(component)

	const metatags  = meta();
	return \`${renderedTemplate}\`;
};`;

	await fse.writeFile(`${paths.build}/${ctx.entry.name}/${paths.render}`, code);
	if(opts.static){
		//TODO: use the utils require
		const renderer = require(path.resolve(process.cwd(), `${paths.build}/${ctx.entry.name}/${paths.render}`));
		await fse.writeFile(`${paths.build}/${ctx.entry.name}/${paths.static}`, renderer())
	}
};
