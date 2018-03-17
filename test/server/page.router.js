const config = require('nconf');
const router = require('express').Router();
//const render = require('../../steps/render');
const pageTemplate = require('./page.template.js');

const renderer = require('../build/main/render.js');

router.get('*', (req, res) => {
	return res.send(renderer({
		url : req.url
	}));
	// render('main', pageTemplate, {
	// 	url    : req.url,
	// 	config : config.get('client')
	// })
	// 	.then((page) => res.send(page))
	// 	.catch((err) => console.log(err));
});

module.exports = router;