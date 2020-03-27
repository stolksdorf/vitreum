require('./main.css');
require('./styles/style.less');
const React = require('react');

const { Title, Inject } = require('../../../vitreum/headtags');

const injectTag = require('../../../vitreum/utils/injectTag.js');

//require in an image, should be nested
//require in some styling


const rocketImg = require('./imgs/rocket.png');

function Main({ title, ...props }){
	const [counter, setCounter] = React.useState(0);
	React.useEffect(()=>{
		setTimeout(()=>{
			setCounter(counter+1)
		}, 500)
	},[counter])


	React.useEffect(()=>{
		injectTag('script', {}, `
			console.log('hello world')
		`);
	}, [])

	return <div className='Main'>
		<Title>{title} - {counter}</Title>
		<Inject tag='style' type='text/css'>
			{`body{
				border: 1px solid black;
			}`}
		</Inject>

		This is the {title} recipe!
		<div>{counter} - This should be increasing</div>
		<section>
			<img src={rocketImg}/>
		</section>
	</div>
};

module.exports = Main;