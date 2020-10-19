/*
This recipe shows how to use vitreum for a traditional server + webapp
It produces a js and css bundle, as well as a server-side rendering script
that the server can use to render what the webapp would look like (given props)
as a string and serve that on the initial request.

We're also using the 'asset' transform here which will copy and required assets
into the './build' folder and return their new path as a string.

*/

const fs = require('fs-extra');

const { pack, watchFile, livereload } = require('../../vitreum');
const isDev = !!process.argv.find(arg=>arg=='--dev');


const lessTransform = require('../../vitreum/transforms/less.js');
const assetTransform = require('../../vitreum/transforms/asset.js');

const transforms = {
	'.less' : lessTransform,
	'.css' : lessTransform,
	'*': assetTransform('./build')
};

const build = async ({ bundle, ssr })=>{
	await fs.outputFile('./build/bundle.css', await lessTransform.generate());
	await fs.outputFile('./build/bundle.js', bundle);
	await fs.outputFile('./build/ssr.js', ssr); // Check out /server/renderPage.js to see this in use
};


fs.emptyDirSync('./build');
pack('./src/main.jsx', {
	dev : isDev && build,
	transforms
})
.then(build);


//In development set up a watch server and livereload
if(isDev){
	livereload('./build');
	watchFile('./server/server.js', {
		watch : [] // Watch additional folders if you want
	});
}

