/*
Github allows you to place a webpage within the /docs folder of your repo. However Github
hosts the project from [username].github.io/[projectname], so you'll need to prefix all
your urls with your project name.

This recipe show how to tweak vitreum's builtins to do this prefixing, even while developing.

if you run this recipe with the '--dev' flag it will start a server and a livereload watcher for you

npm i react react-dom less @babel/core @babel/preset-react
*/


const fs = require('fs-extra');

const { pack, html, livereload, watchFile, server } = require('../../vitreum');
const isDev = !!process.argv.find(arg=>arg=='--dev');


const Project = '/' + require('./package.json').name;

const headtags = require('../../vitreum/headtags.js');
const cssTransform = require('../../vitreum/transforms/css.js');
const lessTransform = require('../../vitreum/transforms/less.js');


const transforms = {
	'.css' : cssTransform,
	'.less' : lessTransform,

	//The 2nd param will prefix all asset urls with the project url
	'*': require('../../vitreum/transforms/asset.js')('./docs', Project)
};

const build = async ({ bundle, render })=>{
	await fs.outputFile('./docs/bundle.css', cssTransform.generate() + '\n' + await lessTransform.generate(isDev));
	await fs.outputFile('./docs/bundle.js', bundle);
	await fs.outputFile('./docs/index.html', html({
		head : `<link href='${Project}/bundle.css' rel='stylesheet'></link>\n${headtags.generate()}`,
		body : render(),
		tail : `<script src='${Project}/bundle.js'></script>`,
	}));
};


fs.emptyDirSync('./docs');

pack('./src/main.jsx', {
	dev : isDev && build,
	transforms
})
.then(build);


if(isDev){
	livereload('./docs');
	server('./docs', {basepath : Project})
}

