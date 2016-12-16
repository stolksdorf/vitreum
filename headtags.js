const React = require('react');
const Storage = require('../utils/storage.js');

module.exports = {
	title : React.createClass({
		componentWillMount: function() {
			Storage.title(this.props.children);
		},
		componentDidMount: function() {
			if(typeof document !== 'undefined') document.title = this.props.children;
		},
		render : function(){
			return null;
		}
	}),

	meta : React.createClass({
		componentWillMount: function() {
			Storage.meta(this.props);
		},
		render : function(){
			return null;
		}
	})
};
