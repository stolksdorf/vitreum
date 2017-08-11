const _ = require('lodash');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Storage = require('./storage.js');


const renderMeta = (props)=>{
	if(props.title){
		return ReactDOMServer.renderToStaticMarkup(
			React.createElement('title', null, props.title)
		);
	}
	return ReactDOMServer.renderToStaticMarkup(
		React.createElement('meta', props)
	);
}

const renderTags = ()=>{
	const tags = _.flatMap(Storage.meta(), (props)=>{
		if(props.bulk){
			return _.map(props.bulk, (content, name)=>{
				if(name == 'title') return renderMeta({title:content});
				return renderMeta({name, content});
			})
		}
		return renderMeta(props);
	});
	Storage.meta(false);
	return tags.join('\n');
};

module.exports = renderTags;