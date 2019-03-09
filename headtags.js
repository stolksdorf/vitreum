const React = require('react');
const createClass = require('create-react-class');

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


let Storage;


const Render = {
	title  : (title)=>{ if(title) return buildElement('title', {}, title); },
	description  : (description)=>{
		if(description) return buildElement('meta', {content: description, name: 'description'}, null, true);
	},
	favicon  : (favicon)=>{
		if(favicon) return buildElement('link', favicon, null, true);
	},
	namedMeta:(_meta)=>{
		const meta = Object.values(_meta);
		if(meta && meta.length){
			return meta.reverse().map((props)=>buildElement('meta', props, null, true));
		}
	},
	unnamedMeta:(meta)=>{
		if(meta && meta.length){
			return meta.reverse().map((props)=>buildElement('meta', props, null, true));
		}
	},
	noscript : (noscripts)=>{
		if(noscripts && noscripts.length){
			return buildElement('noscript', {}, noscripts.join('\n'));
		}
	},
	script : (scripts)=>{
		return scripts.map((scriptProps)=>{
			return buildElement('script', scriptProps);
		})
	},
	structuredData : (data)=>{
		if(data) return buildElement('script', {type:'application/ld+json'}, JSON.stringify(data, null, '  '));
	}
};

const HeadComponents = {
	Title : createClass({
		componentWillMount(){ Storage.title = this.props.children; },
		render(){
			if(typeof document !== 'undefined') document.title = this.props.children;
			return null;
		}
	}),
	Description : createClass({
		componentWillMount(){ Storage.description = this.props.children; },
		render(){ return null; }
	}),
	Favicon : createClass({
		getDefaultProps(){ return {
			type : 'image/png',
			href : '',
			rel  : 'icon',
			id   : 'favicon'
		}},
		componentWillMount(){ Storage.favicon = this.props; },
		render(){
			if(typeof document !== 'undefined') document.getElementById(this.props.id).href=this.props.href;
			return null;
		}
	}),
	Noscript : createClass({
		componentWillMount(){ Storage.noscript.push(this.props.children); },
		render(){ return null; }
	}),
	Script : createClass({
		getDefaultProps(){ return { id : '', src : '', children : ''}},
		componentWillMount(){ Storage.script.push(this.props); },
		render(){ return null; }
	}),

	Meta : createClass({
		getDefaultProps(){ return {

		}},
		componentWillMount(){
			const addTag = (props)=>{
				(props.property || props.name)
					? Storage.namedMeta[props.property || props.name] = props
					: Storage.unnamedMeta.push(props);
			}
			this.props.bulk
				? map(this.props.bulk, (content, property)=>addTag({ content, property }))
				: addTag(this.props);
		},
		render(){ return null; }
	}),
	Structured : createClass({
		processStructuredData(data){
			return reduce(data, (acc, val, key)=>{
				if(key == 'type')    key = '@type';
				if(key == 'context') key = '@context';
				acc[key] = (typeof val == 'object'
					? this.processStructuredData(val)
					: val
				);
				return acc;
			}, {});
		},
		componentWillMount(){ Storage.structuredData = this.processStructuredData(this.props.data); },
		render(){ return null; }
	})
};

const HeadTags = {
	...HeadComponents,
	flush : ()=>{
		Storage = {
			title       : null,
			description : null,
			favicon     : null,
			namedMeta   : {},
			unnamedMeta : [],
			noscript    : [],
			script      : [],
			structuredData : null,
		}
	},
	generate : ()=>{
		const headString = Object.keys(Render).reduce((acc, tagName)=>{
			return acc.concat(Render[tagName](Storage[tagName]))
		}, []).filter(x=>!!x).join('\n');

		HeadTags.flush();
		return headString;
	}
};

HeadTags.flush();
module.exports = HeadTags;