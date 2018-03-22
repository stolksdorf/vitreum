// const config = require('nconf')
// 	.env({ lowerCase: true, separator: '.' })
// 	.argv()
// 	.file('environment', { file: `config/${process.env.NODE_ENV}.json` })
// 	.file('defaults', { file: 'config/default.json' });

const server = require('./server/server.js');




const PORT = 8000
server.listen(PORT, () => {
	console.log(`server on port:${PORT}`);
});