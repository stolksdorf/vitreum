const React = require('react');

const reduce = (obj, fn, init)=>Object.keys(obj).reduce((acc, key)=>fn(acc, obj[key], key), init);
const map    = (obj, fn)=>Object.keys(obj).map((key)=>fn(obj[key], key));

const objToAttr = (props)=>{
	return map(props, (val, key)=>{
		return val ? `${key}="${val}"` : '';
	}).filter(x=>!!x).join(' ');
}
const buildElement = (el, props, content, selfClose=false)=>{
	const {children, ...rest} = props;
	if(!content) content = children;
	let attrs = objToAttr(rest);
	if(attrs) attrs = ' ' + attrs;
	return selfClose
		? `<${el}${attrs} />`
		: `<${el}${attrs}>${content}</${el}>`;
};
const processStructuredData = (data)=>{
	return reduce(data, (acc, val, key)=>{
		if(key == 'type')    key = '@type';
		if(key == 'context') key = '@context';
		acc[key] = (typeof val == 'object'
			? processStructuredData(val)
			: val
		);
		return acc;
	}, {});
};
const addMetaTag = (props)=>{
	(props.property || props.name)
		? Storage.namedMeta[props.property || props.name] = props
		: Storage.unnamedMeta.push(props);
};
const isEmpty = (val)=>{
	if(typeof val == 'object') return Object.values(val).length == 0;
	return !val;
};


let Storage={};


const Render = {
	title  : (title)=>buildElement('title', {}, title),
	description  : (description)=>buildElement('meta', {content: description, name: 'description'}, null, true),
	favicon  : (favicon)=>buildElement('link', favicon, null, true),
	namedMeta:(meta)=>Object.values(meta).reverse().map((props)=>buildElement('meta', props, null, true)),
	unnamedMeta:(meta)=>meta.reverse().map((props)=>buildElement('meta', props, null, true)),
	noscript : (noscripts)=>buildElement('noscript', {}, noscripts.join('\n')),
	script : (scripts)=>scripts.map((scriptProps)=>buildElement('script', scriptProps)),
	structuredData : (data)=>buildElement('script', {type:'application/ld+json'}, JSON.stringify(data, null, '  ')),
};

const onServer = (typeof window === 'undefined');

const HeadComponents = {
	Title({ children }){
		if(onServer) Storage.title = children;
		React.useEffect(()=>{document.title = children}, [children]);
		return null;
	},
	Description({ children }){
		if(onServer) Storage.description = children;
		return null;
	},
	Favicon({ type = 'image/png', href = '', rel='icon', id= 'favicon'}){
		if(onServer) Storage.favicon = {type, href, rel, id};
		React.useEffect(()=>{document.getElementById(id).href=href}, [id, href]);
		return null;
	},
	Noscript({ children }){
		if(onServer) Storage.noscript.push(children);
		return null;
	},
	Script({ id='', src='', children='' }){
		if(onServer) Storage.script.push({ id, src, children });
		return null;
	},
	Meta({bulk, ...props}){
		if(onServer){
			!!bulk
				? map(bulk, (content, property)=>addMetaTag({ content, property }))
				: addMetaTag(props);
		}
		return null;
	},
	Structured({ data }){
		if(onServer) Object.assign(Storage.structuredData, processStructuredData(data));
		return null;
	},
};

const HeadTags = {
	...HeadComponents,
	flush : ()=>{
		Storage = {
			title       : undefined,
			description : undefined,
			favicon     : undefined,
			namedMeta   : {},
			unnamedMeta : [],
			noscript    : [],
			script      : [],
			structuredData : {},
		}
	},
	generate : ()=>{
		const headString = Object.keys(Render).reduce((acc, tagName)=>{
			return !isEmpty(Storage[tagName])
				? acc.concat(Render[tagName](Storage[tagName]))
				: acc;
		}, []).filter(x=>!!x).join('\n');

		HeadTags.flush();
		return headString;
	}
};

HeadTags.flush();
module.exports = HeadTags;