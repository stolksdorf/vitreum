const _ = require('lodash');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Storage = require('./storage.js');

_.mixin({
	deep: (obj, mapper)=>{
		return mapper(_.mapValues(obj, (v)=>{
			return _.isPlainObject(v) ? _.deep(v, mapper) : v;
		}));
	},
});

const renderTag = (props)=>{
	if(props.structuredData){
		let data = _.deep(props.structuredData, (obj)=>{
			return _.mapKeys(obj, (val, key)=>(key == 'type'?'@type':key));
		});
		data['@context'] = data['@context'] || data['context'] || 'http://schema.org';
		delete data['context'];
		return `<script type='application/ld+json'>${JSON.stringify(data, null, '  ')}</script>`;
	}
	if(props.title){
		return ReactDOMServer.renderToStaticMarkup(
			React.createElement('title', null, props.title)
		);
	}
	return ReactDOMServer.renderToStaticMarkup(
		React.createElement('meta', props)
	);
};

const renderTags = ()=>{
	const tags = _.flatMap(Storage.meta(), (props)=>{
		if(props.bulk){
			return _.map(props.bulk, (content, name)=>{
				if(name == 'structuredData') return renderTag({structuredData:content});
				if(name == 'title') return renderTag({title:content});
				return renderTag({name, content});
			})
		}
		return renderTag(props);
	});
	Storage.meta(false);
	return tags.join('\n');
};

module.exports = renderTags;