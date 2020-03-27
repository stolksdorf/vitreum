const injectTag = (tag, props, children)=>{
	const injectNode = document.createElement(tag);
	Object.entries(props).map(([key, val])=>injectNode[key]=val);
	if(children) injectNode.appendChild(document.createTextNode(children));
	document.getElementsByTagName('head')[0].appendChild(injectNode);
};

module.exports = injectTag;