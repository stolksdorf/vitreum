const express = require('express');
const server  = express();
server.use(express.static(__dirname + '/../build'));

const renderMain = (props)=>{
	return `<!DOCTYPE html>
<!-- Doctype HTML5 -->
<html lang='en'>
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
		<link href='/bundle.css' rel='stylesheet'></link>
	</head>
	<body>
		<main>${require('../build/ssr.js')(props)}</main>
	</body>
	<script src='/bundle.js'></script>
	<script>start_app(${JSON.stringify(props)})</script>
</html>`;

}

server.get('/', (req, res)=>{
	const props = {title : 'ssr'}
	return res.send(renderMain(props));
});

server.listen(8000, ()=>{
	console.log('_____________________________');
	console.log(`server running on port: 8000 🔔`);
});
