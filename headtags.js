const React = require('react');
const createClass = require('create-react-class');

const reduce = (obj, fn, init)=>Object.keys(obj).reduce((acc, key)=>fn(acc, obj[key], key), init);
const map    = (obj, fn)=>Object.keys(obj).map((key)=>fn(obj[key], key));

let Storage;

const mapProps = (props)=>map(props, (val, key)=>`${key}="${val}"`).join(' ');
const processData = (data)=>{
	return reduce(data, (acc, val, key)=>{
		if(key == 'type')    key = '@type';
		if(key == 'context') key = '@context';
		acc[key] = (typeof val == 'object'
			? processData(val)
			: val
		);
		return acc;
	}, {});
};

//TODO: Replace all of these with functional components and hooks

const HeadTags = {
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
		getDefaultProps(){ return { type : 'image/png', href : ''}},
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
		getDefaultProps(){ return { id : '', src : ''}},
		componentWillMount(){ Storage.script.push(this.props); },
		render(){ return null; }
	}),
	Meta : createClass({
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
		componentWillMount(){ Storage.structuredData = processData(this.props.data); },
		render(){ return null; }
	}),
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
		let res = [];
		if(Storage.title){
			res.push(`<title>${Storage.title}</title>`);
		}
		if(Storage.favicon){
			res.push(`<link id='favicon' rel='shortcut icon' type='${Storage.favicon.type}' href='${Storage.favicon.href}' />`);
		}
		if(Storage.description){
			res.push(`<meta content='${Storage.description}' name='description' />`);
		}
		const Meta = Object.values(Storage.namedMeta).concat(Storage.unnamedMeta);
		if(Meta && Meta.length){
			res = res.concat(Meta.reverse().map((metaProps)=>`<meta ${mapProps(metaProps)} />`));
		}
		if(Storage.noscript && Storage.noscript.length){
			res = res.concat(`<noscript>${Storage.noscript.join('\n')}</noscript>`);
		}
		if(Storage.script && Storage.script.length){
			res = res.concat(Storage.script.map((script)=>{
				return `<script id='${script.id}' src='${script.src}'>${script.children}</script>`;
			}).join('\n'));
		}
		if(Storage.structuredData){
			res.push(`<script type='application/ld+json'>${JSON.stringify(Storage.structuredData, null, '  ')}</script>`);
		}
		HeadTags.flush();
		return res.join('\n');
	}
};

HeadTags.flush();
module.exports = HeadTags;