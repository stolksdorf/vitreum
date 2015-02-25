"use strict";

var gulp = require('gulp');
var vitreum = require("vitreum");

gulp = vitreum.tasks(gulp, {
	entryPoints: ["./client/testProj"],
	DEV: true,

	projectType : 'STATIC',

	buildPath: "./build/",
	pageTemplate: "./client/template.hbs",

	projectModules: ["./node_modules/testProj"],
	assetExts: ["*.svg", "*.png", "*.jpg", "*.pdf", "*.eot", "*.ttf", "*.woff", "*.woff2"],

	serverWatchPaths: ["server"],
	serverScript: "./server.js",
	cdn: {
		'react/addons' : ["window.React","<script src='//cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react-with-addons.min.js'></script>"],
		jquery : ["window.jQuery","<script src='//code.jquery.com/jquery-1.11.0.min.js'></script>"],
		lodash : ["window._","<script src='//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js'></script>"],

	},
	libs: [],
});

