#vitreum
vitreum is a build system for web apps using a specific project structure. It use React, gulp, Browserify, and Less. It's broken into three main components.

**Tasks** : Adds a series of gulp tasks to create built files for development and production

**Render** : Used on the server to pre-render your web-app server-side to give you isomorphism.

**Headtags** : (might be moved into it's own module later) Modifying tags within the head with an isomorphic app is tricky. This package makes it easy.

### project structure
```
/myProj
├─ /build/...
├─ /node_modules/...
├─ /client
|   ├─ template.dot
|   └─ /entryPointA
|      ├─ entryPointA.jsx
|      └─ entryPointA.less
├─ /shared
|   └─ /myProj/...
├─ /server/...
├─ server.js
└─ gulpfile.js
```

### gulpfile.js

Vitreum/tasks takes a configuration objection to setup a series of gulp tasks for you. Here's what it looks like:

```
//gulpfile.js
var gulp = require("gulp");
var vitreumTasks = require("vitreum/tasks");

var gulp = vitreumTasks(gulp, {
	entryPoints: ["./client/vitreumSample"],
	DEV: true,

	buildPath: "./build/",
	pageTemplate: "./client/template.dot",

	projectModules: ["./shared/vitreumSample"],
	additionalRequirePaths : ['./shared'],
	assetExts: ["*.svg", "*.png", "*.jpg", "*.ttf", "*.ico"],

	serverWatchPaths: ["server"],
	serverScript: "server.js",
	libs: [
		"react",
		"react-dom",
		"lodash",
		"classnames",
		"marked"
	],
	clientLibs: [],
});

gulp.task('myCustomTask', function(){ ... });
```

`entryPoints` - an array of paths to top-level components. Each entrypoint is considered a separate build (but the `libs.js` is shared). Having separate entrypoints is useful when you have large parts of the project that don't interact, eg. a developer portal and a marketting website.

`DEV` - a boolean to toggle dev-mode and prod-mode. While true, your bundles will not be minified and source mapping will be added. This is exposed here to just test your builds as prod builds. When deploying to prod you should use the `gulp prod` task, which will set this to false for you.

`buildPath` - path to where you want your built files to go

`templatePath` - path to where your core template file is. Modify this to add things like CDNs, Google analytics tags, etc.

`projectModules` - an array of paths to folder that contains client-side project code outside of `/client`. This is useful for sharing code between components. Letting Vitreum know these paths lets it setup watchers properly.

`additionalRequirePaths` - an array of paths that Browserify will consider node modules to be in.

`assetExts` - a glob-list of all the assets Vitreum should care about.

`serverWatchPaths` - a glob-list of paths that the `runserver` tasks should watch for to auto-restart the server

`serverScript` - path to the server script to restart if their are server changes

`libs` - a list of node modules that shouldn't be included in your js builds, but hould be included in your libs build. They are separated to greatly increase build speeds, and to leverage client-side caching. Vitreum will warn you if it detects node modules getting in your js builds.

`clientLibs` - an array of paths to client-side only javascript files to be appended onto the `libs.js` build. This is used for when your webapp needs to use a library that can't be ran on the server, or doesn't exist on NPM, or that is just too large to include in th normal build. This ode will **not** be available during the prerender process on the server, but will be available on the client after the web-app initially mounts.


### tasks

Vitreum/tasks will setup a series of tasks to help you help your project. The individual tasks are listed below and the hybrid ones after. Most of the time you will just use the default `gulp`, whenever you change libs you'll need to re-run `gulp fresh`.

**cmds** - Lists all the tasks

**clean** - clears out the build folder and removes all `architecture.json` files

**libs** - uses browserify to build your `libs.js` file from the list provide in the config. These files will not be a part of your js bundle and will be minified.

**js** - first builds an `architecture.json` which is a file that maps the dependacy structure of each entrypoint. Vitreum uses this is a few other processes, it's also useful for debugging. It then uses browserify to build a bundle for each entrypoint, excluding all modules listed in the `libs` in the gulpfile config. Vitreum will give you wanrings if it detects you are putting modules from `/node_modules` in your build. This will also add source-mapping, so if you get errors in your bundle they will map back to your poject files.

**js-watch** - Does the same as above but also setups up [watchify] which will do (very fast) incremental builds whenever any of your js/jsx files change.

**less** - uses the `architecture.json` to find any .less files that belong to required jsx components and auto-imports them. It builds a `bundles.less` for each entrypoint. This will also add source-mapping, so if you get errors in your bundle they will map back to your poject files.

**less-watch** - Same as above but also setups up a watcher to re-run the `less` task whenever a less file changes.

**assets** - uses the glob-matching list provided in the gulpfile to move assets into the build folder. They will maintain most of their folder pathing when moved, so same named assets don't clobber eachother.

**template** - generates a entrypoint-specific `bundle.dot` file using the `template.dot` defined in the gulpfile. Vitreum/render uses this to render your webapp on the server first before shipping it.

**livereload** - setups a [livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) server to hot-load js and css into your webapp while developing whenever their is a change in the build.

**runserver** - starts the server file. Sets up a listening for any changes in that file and the server file that will automatically restart the server.


### hybrid tasks

**run** - `assets, js-watch, less-watch, template, livereload, runserver`

**fresh** - `clean, libs`

**build** - `clean, libs, assets, js, less, template`

**prod** - `build` (with dev flag forced to false)

**default** - `run`



### render

VitreumRender will use the built files and a config on the server to generate the html to send to the client. `vitreumRender(configObj, function(err, pageHtml){})`.

```
var vitreumRender = require('vitreum/render');
var express = require("express");
var app = express();
app.use(express.static(__dirname + '/build'));

app.get('*', function (req, res) {
	vitreumRender({
		page: './build/vitreumSample/bundle.dot',
		globals:{},
		prerenderWith : './client/vitreumSample/vitreumSample.jsx',
		initialProps: {
			url: req.originalUrl,

			initalText : "## Vitreum\n* a super cool build system"
		},
		clearRequireCache : true,
	}, function (err, page) {
		return res.send(page)
	});
});
```

`page` - path to the built template file.

`globals` - a JSON object that will be added to the `<head>` as global javascript files. Useful for configs.

`prerenderWith` - path to the associated entryPoint so vitreum can prerender the page on the server before sending it.

`initialProps` - a JSON object of props that will be passed into the top-level React component specificied in `prerenderWith`

`clearRequireCache` - when set to true, the server will reload the entrypoint's code everytime and not use the `require()` cache. Set this to `true` on development, `false` in staging and prod. Best to use environment variables for this.
