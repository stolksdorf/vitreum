const _ = require('lodash');
const path = require('path');

const HeadTags = require('../utils/headtags.gen.js');

const isProd = process.env.NODE_ENV === 'production';

const requireUncache = (filePath) => {
	delete require.cache[filePath];
};

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
		var root = document.getElementById('reactRoot');
		if(!root) throw "Vitreum: Could not find element with id 'reactRoot' to mount into";
		var element = require('react').createElement(${name}, ${JSON.stringify(props)});
		require('react-dom').render(element, root);
	})();
`;
};

const getBody = (name, props) => {
	const ReactDOMServer = require('react-dom/server');
	const React = require('react');

	const bundlePath = path.resolve(`./build/${name}/bundle.js`);
	if(!isProd) requireUncache(bundlePath);
	const Element = require(bundlePath);
	return ReactDOMServer.renderToString(React.createElement(Element, props));
};

const render = (name, templateFn, props, fields) => {
	if(!_.isFunction(templateFn)) throw 'No template function provided';

	return new Promise((resolve, reject) => {
		const body = getBody(name, props); //body has to render first for head tags
		try{
			const page = templateFn({
				head : getHead(name),
				body : body,
				js   : getJS(name, props)
			}, fields);
			return resolve(page);
		}catch(err){
			console.log('CAUGHT ERR', err);
			return reject(err);
		}
	});
};

module.exports = render;