const React = require('react');
const createClass = require('create-react-class');
const Storage = require('./utils/storage.js');

module.exports = createClass({
	componentWillMount: function() {
		Storage.meta(this.props);
	},
	componentDidMount: function() {
		if(typeof document == 'undefined') return;
		if(this.props.title) document.title = this.props.title;
		if(this.props.bulk && this.props.bulk.title) document.title = this.props.bulk.title;
	},
	render : function(){
		return null;
	}
});

