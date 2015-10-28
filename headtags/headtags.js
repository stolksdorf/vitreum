var _ = require('lodash');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var headTags = {};

module.exports = {
	setTitle : function(titleText){
		if(!titleText) return;
		headTags.title = React.createElement("title", null, titleText);
		if(typeof document !== 'undefined') document.title = titleText;
	},
	setDescription : function(descriptionText){
		if(!descriptionText) return;
		headTags.description = React.createElement("meta", {
			name : "description",
			content : descriptionText
		});
	},
	addTags : function(tagObj){
		if (!_.isPlainObject(tagObj)) {
			throw new Error('Argument to addTags must be an object.');
		}
		headTags = _.extend(headTags, tagObj);
	},
	convertToString : function(){
		return _.reduce(headTags, function(r, tags, key){
			if(!_.isArray(tags)) tags = [tags];
			var convertedTags = _.map(tags, function(tag){
				return ReactDOMServer.renderToStaticMarkup(tag);
			});
			return _.union(r, convertedTags);
		}, []).join('\n')
	}
}
