var _ = require('lodash');

module.exports = {

/* ---- GULP ---- */

	gulp : () => {
		return `var vitreumTasks = require('vitreum/tasks');
var gulp = require('gulp');

var gulp = vitreumTasks(gulp, {
	entryPoints: [
		'./client/main'
	],

	DEV: true,
	buildPath: './build/',
	pageTemplate: './client/template.dot',
	projectModules: [],
	additionalRequirePaths : ['./node_modules'],
	assetExts: ['*.svg', '*.png', '*.jpg', '*.pdf', '*.eot', '*.otf', '*.woff', '*.woff2', '*.ico', '*.ttf'],
	serverWatchPaths: ['server'],
	serverScript: 'server.js',
	libs: [
		'react',
		'react-dom',
		'lodash',
		'classnames'
	],
	clientLibs: [],
});
`;
	},

/* ---- SERVER ---- */

	server : () => {
		return `require('app-module-path').addPath('./shared');

var _ = require('lodash');
var vitreumRender = require('vitreum/render');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/build'));

app.get('*', function (req, res) {
	vitreumRender({
		page: './build/main/bundle.dot',
		globals:{},
		prerenderWith : './client/main/main.jsx',
		initialProps: {
			url: req.originalUrl,
		},
		clearRequireCache : !process.env.PRODUCTION,
	}, function (err, page) {
		return res.send(page)
	});
});

var port = process.env.PORT || 8000;
app.listen(port);
console.log('Listening on localhost:' + port);
`;
	},


	/* ---- TEMPLATE ---- */

	template : () => {
		return `<!DOCTYPE html>
<html>
	<head>
		<script>global=window</script>
		<link href='//netdna.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css' rel='stylesheet' />
		<link href='//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700' rel='stylesheet' type='text/css' />
		<link rel='icon' href='/assets/main/favicon.ico' type='image/x-icon' />
		{{=vitreum.css}}
		{{=vitreum.globals}}
		<title>New Project</title>
	</head>
	<body>
		<div id='reactContainer'>{{=vitreum.component}}</div>
	</body>
	{{=vitreum.libs}}
	{{=vitreum.js}}
	{{=vitreum.reactRender}}

	{{? vitreum.inProduction}}
		<!-- Put PRoduction only code here -->
	{{?}}
</html>
`;
	},

	/* ---- GITIGNORE ---- */

	gitIgnore : () => {
		return `logs
*.log

build/*
architecture.json

node_modules
`;
		},
}