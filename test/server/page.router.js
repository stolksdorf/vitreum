const router = require('express').Router();
const mainRenderer = require('../build/main/render.js');

router.get('*', (req, res) => {
	return res.send(mainRenderer({url : req.url}));
});

module.exports = router;