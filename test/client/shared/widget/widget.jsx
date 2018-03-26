const React       = require('react');
const createClass = require('create-react-class');
const _           = require('lodash');


const Widget = createClass({
	getDefaultProps : function(){
		return {

		};
	},
	render : function(){
		return <div className='widget'>
			Widget Component Ready.
		</div>;
	}
});

module.exports = Widget;
