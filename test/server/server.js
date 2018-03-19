const express = require('express');
const app     = express();

app.use(express.static('./build'));
app.enable('trust proxy');

app.use((req, res, next) => {
	if (req.originalUrl === '/favicon.ico') {
		res.status(204).json({nope: true});
	} else {
		next();
	}
});

app.use(require('./page.router.js'));

// app.all('*', (req, res) => {
// 	res.status(404).send('Oh no.');
// });

module.exports = app;
