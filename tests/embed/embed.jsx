const React = require('react');

function Embed({name='unset', ...props}){
	const [scriptsRan, setScriptsRan] = React.useState(false);

	React.useEffect(()=>{
		setScriptsRan(true);
	},[]);

	return <div className='Embed'>
		Embed Ready. Name is {name}. {scriptsRan ? 'Scripts Ran.' : 'Scripts did not run.'}
	</div>
}

module.exports = Embed;
