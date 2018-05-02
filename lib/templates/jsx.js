const fse = require('fs-extra');
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

module.exports = (args, loc=process.cwd())=>{
	const name = args.component;
	const Name = capitalize(name);

	fse.outputFileSync(`${loc}/${name}/${name}.less`, `.${name}{\n\n}`);

	if(args.pure){
		fse.outputFileSync(`${loc}/${name}/${name}.jsx`,
`require('./${name}.less');
const React = require('react');

module.exports = ({
	...props
})=>{
	return <div className='${name}' {...props}>
		${Name} Pure Component Ready.
	</div>;
};`);
	}else{
		fse.outputFileSync(`${loc}/${name}/${name}.jsx`,
`require('./${name}.less');
const React       = require('react');
const createClass = require('create-react-class');
const cx          = require('classnames');

const ${Name} = createClass({
	getDefaultProps(){
		return {
		};
	},
	render(){
		return <div className='${name}'>
			${Name} Component Ready.
		</div>;
	}
});

module.exports = ${Name};`);
	}

	if(args.smart){
		fse.outputFileSync(`${loc}/${name}/${name}.smart.jsx`,
`const Store = require('shared/store.js');
const Actions = require('shared/actions.js');
const ${Name} = require('./${name}.jsx');

module.exports = (props)=>{
	return <Store.component
		component={${Name}}
		getProps={()=>{
			return {
				count   : Store.getValue(),
				onClick : Actions.inc
			}
		}}
	/>
};`);
	}
}