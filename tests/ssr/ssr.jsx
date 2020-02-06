const React = require('react');

function SSR({name='unset', ...props}){
	const [scriptsRan, setScriptsRan] = React.useState(false);

	React.useEffect(()=>{
		setScriptsRan(true);
	},[]);

	return <div className='SSR'>
		SSR Ready. Name is {name}. {scriptsRan ? 'Scripts Ran.' : 'Scripts did not run.'}
	</div>
}

module.exports = SSR;
