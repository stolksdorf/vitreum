# Vitreum
Web app build system using Browserify, Gulp, React.js and Less



## Directory Structure


## Commands


## Sample gulpfile.js
```
"use strict";

var gulp = require('gulp');
var vitreum = require("vitreum");

gulp = vitreum.tasks(gulp, {
	entryPoints: ["./client/samplePage"],
	DEV: true,
	buildPath: "./build/",

	pageTemplate: "./client/template.hbs",

	configPath : 'sample/config',

	projectModules: ["./node_modules/sample", "./node_modules/palette"],
	assetExts: ["*.svg", "*.png", "*.jpg", "*.pdf", "*.eot", "*.ttf", "*.woff", "*.woff2"],

	serverWatchPaths: ["server"],
	serverScript: "./server/server.js",

	cdn: {
		"react": ["window.React", "<script src='//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react-with-addons.js'></script>"],
		"jquery": ["window.jQuery", "<script src='//code.jquery.com/jquery-1.11.0.min.js'></script>"],
		"lodash": ["window._", "<script src='//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js'></script>"]
	},
	libs: [],
});
```

`entryPoints` : An array that describes the location of each 'web app'. Each will be built separately from eachother. Normally it will just be one.

`DEV` : Sets Vitreum into Dev mode.
buildPath: "./build/",

pageTemplate: "./client/template.hbs",

configPath : 'sample/config',

projectModules: ["./node_modules/sample", "./node_modules/palette"],
assetExts: ["*.svg", "*.png", "*.jpg", "*.pdf", "*.eot", "*.ttf", "*.woff", "*.woff2"],

serverWatchPaths: ["server"],
serverScript: "./server/server.js",

cdn: {
	"react": ["window.React", "<script src='//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react-with-addons.js'></script>"],
	"jquery": ["window.jQuery", "<script src='//code.jquery.com/jquery-1.11.0.min.js'></script>"],
	"lodash": ["window._", "<script src='//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js'></script>"]
},
libs: [],