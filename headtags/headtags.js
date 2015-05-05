var _ = require('lodash');
var React = require('react');
global.HEAD_TAGS = {};

module.exports = {
	setTitle : function(titleText){
		global.HEAD_TAGS.title = React.createElement("title", null, titleText);
		if(typeof document !== 'undefined') document.title = titleText;
	},
	addTags : function(tagObj){
		global.HEAD_TAGS = _.extend(global.HEAD_TAGS, tagObj);
	},
	convertToString : function(){
		return _.reduce(global.HEAD_TAGS, function(r, tags, key){
			if(!_.isArray(tags)) tags = [tags];
			var convertedTags = _.map(tags, function(tag){
				return React.renderToStaticMarkup(tag);
			});
			return _.union(r, convertedTags);
		}, []).join('\n')
	}
}