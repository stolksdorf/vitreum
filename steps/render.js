const ReactDOMServer = require('react-dom/server');
const React = require('react');
const path = require('path');



const isProd = process.env.NODE_ENV === 'production';


var requireUncache = function(filePath){
	var rc = require.cache[filePath];
	if(rc){
		//if(rc.parent.id) requireUncache(rc.parent.id);
		delete require.cache[filePath];
	}
}


//TODO: add in head tags here
const getHead = (name) => {
	return `
<link rel="stylesheet" type="text/css" href="/${name}/bundle.css" />
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
		const page = templateFn({
			head : getHead(name),
			body : getBody(name, props),
			js   : getJS(name, props)
		});
		return resolve(page)
	});
};

module.exports = render;