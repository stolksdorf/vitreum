/*
This recipe will bundle _everything_ into a single html file.
It includes base64 encoding images and embedding the js and css all into a single file.
This is useful if you want to simply upload a webapp to S3 to host it.

We are using the base64encode transform here that will detect the filetype you are trying to require
and create a base64 url from it and return it as a string, embedding the entire content of the file
into your bundle
*/

const fs = require('fs-extra');

const { pack, html, server, livereload  } = require('../../vitreum');
const isDev = !!process.argv.find(arg=>arg=='--dev');

const headtags = require('../../vitreum/headtags.js');

const encodeTransform = require('../../vitreum/transforms/base64.js');
const cssTransform = require('../../vitreum/transforms/css.js');
const lessTransform = require('../../vitreum/transforms/less.js');

const transforms = {
	'.css' : cssTransform,
	'.less' : lessTransform,
	'.png' : encodeTransform
};

const build = async ({ bundle, render })=>{
	const props = { title : 'embed'};
	const body = render(props);
	await fs.outputFile('./build/index.html', html({
		head : `
			${headtags.generate()}
			<style>${cssTransform.generate()}</style>
			<style>${await lessTransform.generate(isDev)}</style>
		`,
		body,
		tail : `<script>${bundle}</script>`,
		props
	}))
};

fs.emptyDirSync('./build');
pack('./src/main.jsx', {
	dev : isDev && build,
	transforms
})
.then(build)
.catch((err)=>console.log(err));


if(isDev){
	livereload('./build');
	server('./build');
}