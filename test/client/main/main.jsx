const React       = require('react');
const createClass = require('create-react-class');
const _           = require('lodash/core');
//const config      = require('shared/config');
const PicoRouter  = require('pico-router');

require('./main.less');

const Pages = {
	Home : require('./home/home.jsx'),
};

const Main = createClass({
	getDefaultProps : function(){
		return {
			url    : '',
			config : {}
		};
	},
	componentWillMount : function(){
		//config.set(this.props.config);
		this.Router = PicoRouter.createRouter({
			'/home' : <Pages.Home />,
			'*' : <div>Not Found</div>
		});
	},
	render : function(){
		return <div className='main'>
			<this.Router defaultUrl={this.props.url} />
		</div>;
	}
});



module.exports = Main;