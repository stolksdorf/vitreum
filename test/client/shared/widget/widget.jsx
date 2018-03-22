const React = require('react');
const _     = require('lodash/core');
require('./widget.less');


module.exports = ({
	className = '',
	...props
}) => {
	return <div className={`widget ${className}`} {...props}>
		Widget Pure Component Ready.
	</div>;
};
