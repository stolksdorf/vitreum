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

	if(args.class){
		fse.outputFileSync(`${loc}/${name}/${name}.jsx`,
`require('./${name}.less');
const React       = require('react');
const createClass = require('create-react-class');
${args.yaml ? `const content = require('./${name}.yaml');` : ''}

const ${Name} = createClass({
	displayName : '${Name}',
	getDefaultProps(){
		return {
		};
	},
	render(){
		return <div className={\`${Name}\`}>
			${Name} Component Ready.
		</div>;
	}
});

module.exports = ${Name};`);
	}else{
		fse.outputFileSync(`${loc}/${name}/${name}.jsx`,
`require('./${name}.less');
const React = require('react');
${args.yaml ? `const content = require('./${name}.yaml');` : ''}

function ${Name}({ ...props }){
	return <div className={\`${Name}\`} {...props}>
		${Name} Component Ready.
	</div>;
};

module.exports = ${Name};`);
	}

	if(args.smart){
		fse.outputFileSync(`${loc}/${name}/${name}.smart.jsx`,
`const ${Name} = require('./${name}.jsx');

const Store   = require('shared/store.js');
const Actions = require('shared/actions.js');

const Smart${Name} = Component({
	component : ${Name},
	sources   : [Store],
	getProps  : ({ value, ...props })=>{
		return {
			value    : Store.getValue(value),
			onAction : (arg)=>Actions.doThing(arg),
			...props
		};
	}
});

module.exports = Smart${Name};`);
	}
}