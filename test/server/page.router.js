const router = require('express').Router();
const mainRenderer = require('../build/main/render.js');

router.get('*', (req, res) => {
	console.log('request hit', req.url);

	//console.log('REMOVING', require.resolve('../build/main/bundle.js'));
	//delete require.cache[require.resolve('../build/main/bundle.js')]


	return res.send(mainRenderer({
		url : req.url
	}));
});

module.exports = router;