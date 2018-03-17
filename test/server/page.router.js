const router = require('express').Router();

const renderer = require('../build/main/render.js');

router.get('*', (req, res) => {
	return res.send(renderer({
		url : req.url
	}));

});



module.exports = router;