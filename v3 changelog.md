# migrating to vitreum 3
Oh boy. Vitreum3 is big news. Let's get your projects ready to rumble.

#### improvements
* Huge speed improvements. Sometimes up to 6x faster.
* Size of project down 40%
* Code is much easier read and follow
* All dependacies are up to date
* React 0.14 support
* Built projects should be smaller
* Ignoring `node_modules` now, keeping the project up to date



#### computer stuff
* Update npm to 3.3.x and node to 4.2.x

#### component stuff
* We are now using React 0.14.x, update it.
* Remove `/** @jsx React.DOM */` from the top of any `.jsx` files
* We are not using `react/addons` anymore.
* `react/addons/cx` has been replaced with the `classnames` module
* `react/addons/CSSTransitionGroups` have been replaced with the `react-csstransitgroup` module. This will make your libs much smaller.


#### project modules
* Completely remove palette, prism, and vitreum as submodules from your project. [How to](https://gist.github.com/kyleturner/1563153)
* Add a `/shared` folder to the root of the project.
* Move `/node_modules/[Proj Name]` to `/shared/[Proj Name]`
* Re-add palette and prism as submodules in your `/shared` folder
* Vitreum will now be a node_module, not a submodule, so you can just install it, `npm install vitreum`
* If the proejct node_modules were installed with npm2 (in a tree structure, rather than flat), it's **strongly** recommended that you delete all existing node_modules and do a fresh `npm install`

#### server.js
* Change `var vitreum = require('vitreum')` to `var vitreumRender = require('vitreum/render')`. The render has been separated to improve load times.
* If your project was using 'cache busting', you can remove it completely.
* `.hbs` changed to `.dot`
* Add `require('app-module-path').addPath('./shared');` to the top of the file
* Added a `clearRequireCache` which should only be true in dev (this replaces the old cache busting)
* Changed `config` to `globals` to be more general. `globals` now consumes an object and adds it to the `<head>` as global variables.
* Your render call to look like this:

```
vitreumRender({
	page: './build/amethyst/bundle.dot',
	clearRequireCache : process.env.NODE_ENV === 'development',
	globals : {
		config : Config.client
	},
	prerenderWith : './client/amethyst/amethyst.jsx',

	initialProps: {
		url: req.originalUrl,
	}
}, function (err, page) {
	return res.send(page)
});
```



#### stockpiler
* `npm install browserify-stockpiler`, a browserify-able wrapper for Stockpiler for client-side use.
* any client side code that needs to use stockpiler should use `bowserify-stockpiler` instead. Most projects use a `/shared/[proj]/config.js` to wrap client-side configs, so just update it there.

```
module.exports = require('browserify-stockpiler')({
	envPrefix: "AMETHYST"
}).client;
```

#### templates
* We have moved from Handlebars to [doT](http://olado.github.io/doT/index.html). All `.hbs` files will now be `.dot`. The syntax is nearly the same, biggest difference is `{{{` to replaced with `{{=`.
* `vitreum.cdn` has been removed completely, so remove it from the `template.dot`. You may need to move the google analytics tag into the `template.dot`
* Added `vitreum.inProduction` and `vitreum.inDev` as conditions to the templating
* The `vitreum.component` must be wrapped in a div with the id of 'reactContainer' due to updates in React not liking us mutating the `<body>` directly

```
<div id="reactContainer">{{=vitreum.component}}</div>
```



#### gulpfile.js
* Instead of requiring `vitreum`, do this `vitreumTasks = require("vitreum/tasks")`
* `projectType` has been removed
* We are not cdn-ing things in anymore. CDNs fail, slow dev, and increase the number of calls that need to be made. All non-thalmic code will be rolled into `libs.js` (including lodash, react, etc.)
* Vitreum will now warn you if it detects things that look like non-thalmic code in your build.
* Add `clientLibs`, which are just js files that you want included on client-side only with no processing. Added to `libs.js` during the `libs` task.
* the `serverScript` is now automatically added to the `serverWatchPaths` so you can removed it from there.
* `projectModules` should all point to `'./shared/amethyst'` instead of `'./node_modules/amethyst'`
* `pageTemplate` should end with a `.dot`
* Add most of the stuff from `cdn` to `libs`
* Add `additionalRequirePaths : ['./shared'],` in the config obj

#### gulp tasks
* `architecture` is now ran automatically with `js`
* Added `js-watch` and `less-watch` which run their associated tasks and setup watchers. `js` and `js-watch` should never be ran at the same time.
* Removed the `watch` task.
* Removed the `architecture` task.
* Removed the `icons` task.
* Removed the `config` task.
* Renamed `server` to `runserver`
* Renamed `html` to `template`
* Builds have been sped up incredibly. Especially the `js` task.
* Since we are now packaging our previously CDN'd modules into our libs the `libs` task will take **much** longer. This is fine, this task should be ran very infrequently.
* You should almost always want to run just `gulp` now instead of `gulp fresh`. `gulp` will do most of what `gulp fresh` use to do, but much faster. We've moved our slow tasks to `fresh` now.
* Here's a run down of what the new tasks do

```
gulp run   = assets, js-watch, less-watch, template, livereload, runserver
gulp fresh = clean, libs, run
gulp build = clean, libs, assets, js, less, template
gulp prod  = build (but with the dev flag set to false)

gulp = run
```
