const React       = require('react');
const createClass = require('create-react-class');
const _           = require('lodash/core');

const { Widget } = require('shared/components');

const Home = createClass({
	getDefaultProps : function(){
		return {};
	},
	render : function(){
		return <div className='home page'>
			Home Page Ready.
			<Widget onClick={()=>alert('test')} />
		</div>;
	}
});

module.exports = Home;