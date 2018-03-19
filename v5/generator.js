const fse = require('fs-extra');
const path = require('path')

const buildPath ='./build';

const defaultTempate = require('./default.template.js');

const getRenderedTemplate = (template, entryName)=>{
	const head = `<link rel='stylesheet' type='text/css' href='/${entryName}/bundle.css' />\n	\${metatags}`;
	const body = `<main id='vitreum-root'>\${component}</main>`;
	const tail = `<script src='/libs.js'></script>
	<script src='/${entryName}/bundle.js'></script>
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


//TODO: Pass a dev flag that will decache the bundle each time
module.exports = async (ctx, opts={})=>{
	const renderedTemplate = getRenderedTemplate(defaultTempate, ctx.entry.name);
	const code = `const ReactDOMServer = require('react-dom/server');
const React = require('react');
const meta = require('vitreum/utils/meta.gen.js');

module.exports = (props)=>{
	${opts.dev ? `delete require.cache[require.resolve('./bundle.js')];` : ''}
	const Element = require('./bundle.js');
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

	return fse.writeFile(`${buildPath}/${ctx.entry.name}/render.js`, code)
		.then(()=>{
			//if(!opts.static) return;
			console.log(process.cwd());
			console.log(require.resolve(path.resolve(process.cwd(), `${buildPath}/${ctx.entry.name}/render.js`)));
			console.log(path.resolve(process.cwd(), `${buildPath}/${ctx.entry.name}/render.js`));
			//const renderer = require(require.resolve(`${buildPath}/${ctx.entry.name}/render.js`, {paths : [process.cwd()]}));

			const renderer = require(path.resolve(process.cwd(), `${buildPath}/${ctx.entry.name}/render.js`));
			return fse.writeFile(`${buildPath}/${ctx.entry.name}/static.html`, renderer())
		})
};
