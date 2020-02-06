const fs = require('fs');

const pack = require('../../lib/vitreum.js');
const html = require('../../lib/html.js');
const utils = require('../../lib/utils.js');


(async ()=>{
	const { bundle, render } = await pack('./embed.jsx');
	fs.writeFileSync(utils.rel('./embed.bundle.html'), html({
		body : render({name : 'embed-ssr'}),
		tail : `<script>${bundle}</script>`,
		props : {name: 'embed'}
	}));
})();

