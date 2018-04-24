const _ = require('lodash'); // try to remove
const React = require('react');
const ReactDOMServer = require('react-dom/server');

let TagStorage=[];

const renderTag = (props)=>{
	if(props.structuredData){
		let data = _.deep(props.structuredData, (obj)=>_.mapKeys(obj, (val, key)=>(key == 'type'?'@type':key)));
		data['@context'] = data['@context'] || data['context'] || 'http://schema.org';
		delete data['context'];
		return `<script type='application/ld+json'>${JSON.stringify(data, null, '  ')}</script>`;
	}
	if(props.title) return ReactDOMServer.renderToStaticMarkup(React.createElement('title', null, props.title));
	return ReactDOMServer.renderToStaticMarkup(React.createElement('meta', props));
};


module.exports = {
	store : (tag)=>{
		TagStorage.push(tag);
	},
	generateTags : ()=>{
		const tags = _.flatMap(TagStorage, (props)=>{
			if(props.bulk){
				return _.map(props.bulk, (content, name)=>{
					if(name == 'structuredData') return renderTag({structuredData:content});
					if(name == 'title') return renderTag({title:content});
					return renderTag({name, content});
				})
			}
			return renderTag(props);
		});
		TagStorage = [];
		return tags.join('\n');
	},

}