const fs = require('fs').promises;
const { pack, html, server } = require('../../vitreum');
const isDev = !!process.argv.find(x=>x=='--dev');


const { style, less, css } = require('../../vitreum/transforms');

const bundle = async ({ bundle, render })=>{
	await fs.writeFile('./todo_bundle.html', html({
		body : render(props),
		tail : `<script>${bundle}</script>`
	}));
}


const transforms = {
	'.less' : {}
}




pack('./client/main.jsx', {
	transforms,
	dev : isDev && bundle
}).then(bundle);


if(isDev){
	server({ root : utils.rel('../build')})
}