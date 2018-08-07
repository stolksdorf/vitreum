const React = require('react');
const createClass = require('create-react-class');

const reduce = (obj, fn, init)=>Object.keys(obj).reduce((acc, key)=>fn(acc, obj[key], key), init);
const map    = (obj, fn)=>Object.keys(obj).map((key)=>fn(obj[key], key));

let Storage={meta:[], noscript : []};

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

const HeadTags = {
	Title : createClass({
		componentWillMount(){ Storage.title = this.props.children; },
		componentDidMount(){
			if(typeof document !== 'undefined') document.title = this.props.children;
		},
		render(){ return null; }
	}),
	Favicon : createClass({
		getDefaultProps(){ return { type : 'image/png', href : ''}},
		componentWillMount(){ Storage.favicon = this.props; },
		//TODO: Add abiltiy to dynamically modify favicon
		render(){ return null; }
	}),
	Noscript : createClass({
		componentWillMount(){ Storage.noscript.push(this.props.children); },
		render(){ return null; }
	}),
	Meta : createClass({
		componentWillMount(){ Storage.meta.push(this.props); },
		render(){ return null; }
	}),
	Structured : createClass({
		componentWillMount(){ Storage.structuredData = processData(this.props.data); },
		render(){ return null; }
	}),
	Bulk : createClass({
		componentWillMount(){
			if(this.props.title) Storage.title = this.props.title;
			if(this.props.favicon) Storage.favicon = this.props.favicon;
			if(this.props.meta) Storage.meta = Storage.meta.concat(map(this.props.meta, (content, name)=>{return {content, name}}));
			if(this.props.structuredData) Storage.structuredData = processData(this.props.structuredData);
		},
		componentDidMount(){
			if(typeof document !== 'undefined' && this.props.title) document.title = this.props.title;
		},
		render(){ return null; }
	}),
	flush : ()=>Storage = {meta:[], noscript : []},
	generate : ()=>{
		let res = [];
		if(Storage.title) res.push(`<title>${Storage.title}</title>`);
		if(Storage.favicon) res.push(`<link rel='shortcut icon' type='${Storage.favicon.type}' href='${Storage.favicon.href}' />`);
		if(Storage.meta && Storage.meta.length){
			res = res.concat(Storage.meta.map((metaProps)=>`<meta ${mapProps(metaProps)} />`));
		}
		if(Storage.noscript && Storage.noscript.length){
			res = res.concat(`<noscript>${Storage.noscript.join('\n')}</noscript>`);
		}
		if(Storage.structuredData){
			res.push(`<script type='application/ld+json'>${JSON.stringify(Storage.structuredData, null, '  ')}</script>`);
		}
		HeadTags.flush();
		return res.join('\n');
	}
};

module.exports = HeadTags;