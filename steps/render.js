const ReactDOMServer = require('react-dom/server');
const React = require('react');
const path = require('path');

const HeadTags = require('./head/head.js');

const isProd = process.env.NODE_ENV === 'production';


var requireUncache = function(filePath){
	delete require.cache[filePath];
}


const getHead = (name) => {
	return `
<link rel="stylesheet" type="text/css" href="/${name}/bundle.css" />
${HeadTags()}
`;
};

const getJS = (name, props) => {
	return `
<script src="/libs.js"></script>
<script src="/${name}/bundle.js"></script>
<script>${runtime(name, props)}</script>`;
};

const runtime = (name, props)=>{
	return `
	(function(){
		var root = document.getElementById('react');
		if(!root) throw "Vitreum: Could not find element with id 'react' to mount into";
		var element = require('react').createElement(${name}, ${JSON.stringify(props)});
		require('react-dom').render(element, root);
	})();
`;
};

const getBody = (name, props) => {
	const bundlePath = path.resolve(`./build/${name}/bundle.js`);
	if(!isProd) requireUncache(bundlePath);
	const Element = require(bundlePath);
	return ReactDOMServer.renderToString(React.createElement(Element, props));
};

const render = (name, props={}, templateFn) => {



	return new Promise((resolve) => {
		const body = getBody(name, props); //body has to render first for head tags

		try{
			const page = templateFn({
				head : getHead(name),
				body : body,
				js   : getJS(name, props)
			});
			return resolve(page)
		}catch(err){
			console.log('CAUGHT ERR', err);
		}
	});
};

module.exports = render;