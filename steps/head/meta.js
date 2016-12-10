const React = require('react');
const Storage = require('../utils/storage.js');

const Meta = React.createClass({
	componentWillMount: function() {
		Storage.meta(this.props);
	},
	render : function(){
		return null;
	}
})

module.exports = Meta;