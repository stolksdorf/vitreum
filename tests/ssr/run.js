const fs = require('fs').promises;

const pack = require('../../lib/vitreum.js');
const html = require('../../lib/html.js');
const utils = require('../../lib/utils.js');


const isDev = !!process.argv.find(x=>x=='--dev');

const express = require('express');
express.static(__dirname);
const app = express();

//TODO: test the hot loading


(async ()=>{

	await pack('./ssr.jsx', {
		dev : async ({ bundle, ssr })=>{
			await fs.writeFile(utils.rel('./ssr.bundle.js'), ssr);
			await fs.writeFile(utils.rel('./client.bundle.js'), bundle);
		}
	});


	const ssr_render = require('./ssr.bundle.js');

	app.get('/', async (req, res)=>{
		res.send(html({
			body : ssr_render({name : 'server'}),
			tail : `<script>${bundle}</script>`,
			props : {name: 'embed'}
		}));
	})

	app.listen(8001, ()=>{
		console.log('ssr server is running at port: 8001');
	});

})();

