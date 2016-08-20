var _ = require('lodash');

module.exports = {
	jsx : (name) => {
		var Name = _.upperFirst(name);
		return `var React = require('react');
var _     = require('lodash');
var cx    = require('classnames');

var ${Name} = React.createClass({

	render : function(){
		return <div className='${name}'>
			${Name} Component Ready.
		</div>
	}
});

module.exports = ${Name};
`;
	},
	less : (name) => {
		var Name = _.upperFirst(name);
		return `.${name}{\n\n}`;
	}
}