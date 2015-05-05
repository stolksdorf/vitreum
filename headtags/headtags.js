var _ = require('lodash');
var React = require('react');

var headTags = {};

module.exports = {
	setTitle : function(titleText){
		headTags.title = React.createElement("title", null, titleText);
		if(typeof document !== 'undefined') document.title = titleText;
	},
	addTags : function(tagObj){
		headTags = _.extend(headTags, tagObj);
	},
	convertToString : function(){
		return _.reduce(headTags, function(r, tags, key){
			if(!_.isArray(tags)) tags = [tags];
			var convertedTags = _.map(tags, function(tag){
				return React.renderToStaticMarkup(tag);
			});
			return _.union(r, convertedTags);
		}, []).join('\n')
	}
}
