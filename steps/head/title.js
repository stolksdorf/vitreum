const React = require('react');
const Storage = require('../utils/storage.js');

const Title = React.createClass({
	componentWillMount: function() {
		Storage.title(this.props.children);
	},
	componentDidMount: function() {
		if(typeof document !== 'undefined') document.title = this.props.children;
	},
	render : function(){
		return null;
	}
})

module.exports = Title;