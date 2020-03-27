const express = require('express');
const server  = express();
server.use(express.static(__dirname + '/../build'));

const renderMain = require('./renderPage.js');

server.get('/', (req, res)=>{
	const props = {title : 'ssr'}
	return res.send(renderMain(props));
});


server.listen(8000, ()=>{
	console.log('_____________________________');
	console.log(`server running on port: 8000 🔔`);
});
