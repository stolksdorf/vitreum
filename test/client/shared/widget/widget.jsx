const React = require('react');
const _     = require('lodash/core');

module.exports = ({
	className = '',
	...props
}) => {
	return <div className={`widget ${className}`} {...props}>
		Widget Pure Component Ready.
	</div>;
};
