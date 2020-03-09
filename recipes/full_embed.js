const fs = require('fs').promises;
const { pack, html, utils, server } = require('../../vitreum');
const isDev = !!process.argv.find(x=>x=='--dev');

const build = async ({ bundle, render })=>{
	const props = {};
	fs.writeFileSync(utils.rel('../build/index.html'), html({
		body : render(props),
		tail : `<script>${bundle}</script>`,
		props
	}));
}




build(await pack('../client/main.jsx', {
	dev : isDev && build
}));


if(isDev){
	server({ root : utils.rel('../build')})
}