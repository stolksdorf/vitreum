const React = require('react');
const createClass = require('create-react-class');

const reduce = (obj, fn, init)=>Object.keys(obj).reduce((acc, key)=>fn(acc, obj[key], key), init);
const map    = (obj, fn)=>Object.keys(obj).map((key)=>fn(obj[key], key));

let Storage;

const objToAttr = (props)=>{
	return map(props, (val, key)=>{
		return val ? `${key}="${val}"` : ''
	}).join(' ');
}
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
const buildElement = (el, props, content, selfClose=false)=>{
	const {children, ...rest} = props;
	if(!content) content = children;
	return selfClose
		? `<${el} ${objToAttr(rest)} />`
		: `<${el} ${objToAttr(rest)}>${content}</${el}>`;
};




const Render = {
	script : (scripts)=>{
		return scripts.map((scriptProps)=>{
			return buildElement('script', scriptProps, null, false);
		}).join('\n')
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
			rel  : 'icon'
		}},
		componentWillMount(){ Storage.favicon = this.props; },
		render(){
			if(typeof document !== 'undefined') document.getElementById('favicon').href=this.props.href;
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
		componentWillMount(){ Storage.structuredData = processStructuredData(this.props.data); },
		render(){ return null; }
	})
};


const HeadTags = {
	...HeadComponents,
	flush : ()=>{
		Storage = {
			title       : null,
			description : null,
			namedMeta   : {},
			unnamedMeta : [],
			noscript    : [],
			script      : []
		}
	},
	generate : ()=>{
		//TODO: Make in element builders
		let res = [];
		if(Storage.title){
			res.push(`<title>${Storage.title}</title>`);
		}
		if(Storage.description){
			res.push(`<meta content='${Storage.description}' name='description' />`);
		}
		if(Storage.favicon){
			res.push(`<link id='favicon' rel='icon' type='${Storage.favicon.type}' href='${Storage.favicon.href}' />`);
		}
		const Meta = Object.values(Storage.namedMeta).concat(Storage.unnamedMeta);
		if(Meta && Meta.length){
			res = res.concat(Meta.reverse().map((metaProps)=>`<meta ${objToAttr(metaProps)} />`));
		}
		if(Storage.noscript && Storage.noscript.length){
			res = res.concat(`<noscript>${Storage.noscript.join('\n')}</noscript>`);
		}


		res.push(Render.script(Storage.script));

		// if(Storage.script && Storage.script.length){
		// 	res = res.concat(Storage.script.map((scriptProps)=>{
		// 		return buildElement('script', scriptProps);
		// 		//return `<script id='${script.id}' src='${script.src}'>${script.children}</script>`;
		// 		//return `<script id='${script.id}' src='${script.src}'></script>`;
		// 	}).join('\n'));
		// }
		if(Storage.structuredData){
			res.push(`<script type='application/ld+json'>${JSON.stringify(Storage.structuredData, null, '  ')}</script>`);
		}
		HeadTags.flush();
		return res.filter(str=>!!str).join('\n');
	}
};

HeadTags.flush();
module.exports = HeadTags;