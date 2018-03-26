const _       = require('lodash');
const config  = require('nconf');
const express = require('express');
const app     = express();
app.use(express.static(`${__dirname}/build`));

config.argv()
	.env({lowerCase: true})
	.file('environment', {file: `config/${process.env.NODE_ENV}.json`})
	.file('defaults', {file: 'config/default.json'});

const pageTemplate = require('./page.template.js');
const render = require('vitreum/steps/render');

app.get('*', (req, res)=>{
	render('main', pageTemplate, {
		url : req.url
	})
		.then((page)=>res.send(page))
		.catch((err)=>console.log(err));
});

const PORT = config.get('port');
app.listen(PORT);
console.log(`server on port:${PORT}`);
