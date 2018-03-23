const React       = require('react');
const createClass = require('create-react-class');
const _           = require('lodash/core');

const Widget = require('shared/widget/widget.jsx');

const Home = createClass({
	getDefaultProps : function(){
		return {};
	},
	handleClick(){
		console.log('yo');



	},
	render : function(){
		return <div className='home page' onClick={this.handleClick} style={require('./home.less')}>
			Home Page Ready HOOLLLA BOI.
			<Widget />
		</div>;
	}
});

module.exports = Home;