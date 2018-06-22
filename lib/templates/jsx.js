const fse = require('fs-extra');
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const lower = (string) => string.charAt(0).toLowerCase() + string.slice(1);

module.exports = (args, loc=process.cwd())=>{
	const name = lower(args.component);
	const Name = capitalize(name);

	fse.outputFileSync(`${loc}/${name}/${name}.less`, `.${Name}{\n\n}`);

	if(args.yaml){
		fse.outputFileSync(`${loc}/${name}/${name}.yaml`, '');
	}

	if(args.pure){
		fse.outputFileSync(`${loc}/${name}/${name}.jsx`,
`require('./${name}.less');
const React = require('react');
${args.yaml ? `const content = require('./${name}.yaml');` : ''}

function ${Name}({
	...props
}){
	return <div className='${Name}' {...props}>
		${Name} Pure Component Ready.
	</div>;
};

module.exports = ${Name};`);
	}else{
		fse.outputFileSync(`${loc}/${name}/${name}.jsx`,
`require('./${name}.less');
const React       = require('react');
const createClass = require('create-react-class');
const cx          = require('classnames');
${args.yaml ? `const content = require('./${name}.yaml');` : ''}

const ${Name} = createClass({
	displayName : '${Name}',
	getDefaultProps(){
		return {
		};
	},
	render(){
		return <div className='${Name}'>
			${Name} Component Ready.
		</div>;
	}
});

module.exports = ${Name};`);
	}

	if(args.smart){
		fse.outputFileSync(`${loc}/${name}/${name}.smart.jsx`,
`const React   = require('react');
const Store   = require('shared/store.js');
const Actions   = require('shared/actions.js');
const component = require('./${name}.jsx');

function ${Name}Smart(props){
	const getProps = () => {
		return {
			count   : Store.getValue(),
			onClick : Actions.inc
		};
	};
	return <Store.component {...{ component, getProps }} />;
};

module.exports = ${Name}Smart;`);
	}
}