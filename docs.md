# docs

## steps
Vitreum exposes a series of steps you can use to create build and development scripts for your project. Each step is a `promise`, so they can be easily chained. Youd should use these within `npm scripts` which you define in your `package.json`. See the [examples.md](examples.md) for some best practices.

You can access all steps via an object by requiring `require('vitreum/steps')`. See the examples at the bottom.

### build steps

#### `clean()`
Ensures the `/build` folder exists and removes all files from it.

```js
const clean = require('vitreum/steps/clean');
clean()
	.then(() => {})
	.catch(console.error)
```

#### `libs(modulenames : array, [opts : object])`
Creates a standalone bundle at `/build/libs.js` that contains Browserified versions of all the module names passed in. This step is used to isolate very large common libraries from slowing down builds. This file can also be cached in a CDN as it shouldn't need to be ran often (can take up to 10s to run!).

```js
const libs = require('vitreum/steps/libs');
libs(['react', 'classnames', 'lodash'])
	.then(() => {})
	.catch(console.error)
```

```js
opts = {
	filename : 'libs.js', // File name of resulting bundle
	shared : [],          // List of paths to treat as require paths
	babel  : false        // If true, applies babel transform to all libs
	silent : false        // Silence any console output
}
```


#### `jsx(bundleName : string, entryPoint : string, [opts : object]) -> deps : array`
Creates a named js bundle at `./build/${bundleName}/bundle.js` using the component specified at `entryPoint`. Any modules listed in `libs` will not be included in the bundle and will be expected to be loaded extenerally. Any paths listed in `shared` will be used as additional require paths.

```js
const jsx = require('vitreum/steps/jsx');
jsx('main', './client/main/main.jsx', { libs : Proj.libs, shared : ['./shared'] })
	.then((deps) => {})
	.catch(console.error)
```

```js
opts = {
	filename : 'bundle.js', // File name of resulting bundle
	libs : [],              // List of module names that were built in the libs task
	shared : [],            // List of paths to treat as require paths
	global : true           // Apply the babelify transform globally
	transforms : [],        // An array of Browserify transforms you'd like to be applied
	silent : false          // Silence any console output
}
```

`deps` will be an array of dependacy paths that the entrypoint `require`d. This can be used be the `less` step to search for the appropriate `less` files.

#### `less(bundleName : string, opts : object, deps : array)`
Creates a named css bundle at `./build/${bundleName}/bundle.css` using the `deps`. This step will look at each dependacy provided and see if there is a related `less` file at that location, if so it will automatically included it within the bundle. The `shared` parameter lets the `less` step know where to look for additional require paths.

```js
const jsx = require('vitreum/steps/jsx');
const less = require('vitreum/steps/less');

jsx('main', './client/main/main.jsx', { libs : Proj.libs, shared : ['./shared'] })
	.then((deps) => less('main', {shared : Proj.shared}, deps))
	.catch(console.error)
```

```js
opts = {
	filename : 'bundle.css', // File name of resulting bundle
	shared : [],             // List of paths to treat as require paths
	silent : false           // Silence any console output
}
```

#### `assets(patterns : array, folders : array)`
Searches for all files in the array of `folders` that match any of the `patterns`. Copies each file, maintaining it's folder pathing, into `/build/assets/`, eg. `/build/assets/main/widget/imgs/user.png`.

```js
const assets = require('vitreum/steps/assets');
assets(['*.png', '*.otf', 'myClientLib.js'], ['./client', './shared'])
	.then(() => {})
	.catch(console.error)
```

#### `render(bundleName : string, templateFn : function, props : object, [fields], [opts])`
Takes a compiled bundled from the `jsx` step and a template function to render a HTML string. This string can be used to pipe to the client using express, or can be saved to a file for static HTML rendering.

`props` are passed to the entrypoint component when rendering it. The `fields` parameter is passed as a second parameter in the template function. This is useful for passing in things like a Google Analytics snippet, or other data. Check out the [examples.md](examples.md).

`opts` is an object of additional options
- `.useStatic` Toggles between using `ReactDOMServer.renderToString` and `ReactDOMServer.renderToStaticMarkup`. [Reference here](https://facebook.github.io/react/docs/react-dom-server.html)

```js
const render = require('vitreum/steps/render');
const templateFn = require('./client/template.js');
render('main', templateFn, {})
	.then((htmlString) => {})
	.catch(console.error)
```

**template function**
The template function is a simple function that will be given an object with three properties and is expected to return a string of HTML. You can use whatever templating technique you like: DoT, Handlebars, Jade, native template strings. The three properties are `head`, `body`, and `js`

```js
module.exports = (vitreum) => {
	return `<html>
		<head>
			${vitreum.head}
		</head>
		<body>
			<main id='reactRoot'>${vitreum.body}</main>
		</body>
		${vitreum.js}
	</html>`;
}
```
**note**: Injecting react compnents directly into the body is considered [bad practice](https://github.com/facebook/react/issues/3207). With Vitreum rendering you *must* have an element with an id of `reactRoot` somewhere for it to render your entryPoint into.



### watch steps
**Note**: These steps are only available when `vitreum` is installed in non-production envirnoments. Don't use them in production build steps!

#### `jsxWatch(bundleName : string, entryPoint : string, libs : array, shared : array)`
Creates a [watchified](https://github.com/substack/watchify) bundler and runs it. Each time a file in your project is updated, `watchify` will rebundle only what's changed resulting in up to a 10x increase in bundle speeds. This step also watches the file system for created or deleted files to updated the bundler's cache.

The deps created with this step will be shared with the less-watch step using global variables.

```js
const jsxWatch = require('vitreum/steps/jsx.watch');
jsxWatch('main', './client/main/main.jsx', Proj.libs, ['./shared'])
	.then(() => {})
	.catch(console.error)
```

#### `lessWatch(bundleName : string, shared : array)`
Watches the file system for changes in `.less` files and will re-run the `less` step.

```js
const lessWatch = require('vitreum/steps/less.watch');
lessWatch('main', ['./shared'])
	.then(() => {})
	.catch(console.error)
```

#### `assetsWatch(patterns : array, folders : array)`
Watches the file system for changes in provided `patterns` and will re-run the `asset` step.

```js
const assetWatch = require('vitreum/steps/assets.watch');
assetWatch(['*.png', '*.otf', 'myClientLib.js'], ['./client', './shared'])
	.then(() => {})
	.catch(console.error)
```

#### `livereload()`
Sets up a [livereload](http://livereload.com/) server that watches for changes in the `./build` folder. By installing and using the [LiveReload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) your browser will instantly switch up javscript and styles when they change. I *strongly* suggest using this, greatly speeds up development.

```js
const livereload = require('vitreum/steps/livereload');
livereload()
	.then(() => {})
	.catch(console.error)
```


#### `serverWatch(serverFile : string, serverDirs : array)`
Runs the provided `serverFile` and sets it up to automatically restart using [nodemon](https://github.com/remy/nodemon) when it detects changes in the file or any files within the `serverDirs`.

```js
const serverWatch = require('vitreum/steps/server.watch');
serverWatch('./server.js', ['server'])
	.then(() => {})
	.catch(console.error)
```


## Meta Tags
Sometimes you'll want your components to be able to modify what's in your HTML `head`, such for `title` tags or `meta` descriptions. This can be pretty tricky to pull off, so this functionality comes built into Vitreum.

```js
const Meta = require('vitreum/meta');

const Main = React.createClass({
	render: function(){
		return <div className='main'>
			<Meta title='My Fancy Page' />
			<Meta name='description' content='This is a really fancy page.' />
			<Meta bulk={{author:'Scott', keywords:'Super, Cool'}} />
			<Meta structuredData={{type:'Organization', logo:'cool.biz/logo.png'}}

			Hello World!
		</div>;
	}
});
```

The `bulk` prop accepts an object, where fors each key-value pair vitreum will produce a `<meta>` tag with corresponding `name` and `content` props.

The `title` prop will instead produce a `title` tag which it will inject into the head. If a `Meta` tag with a `title` prop is rendered onto an existing page, it will update the document's title dynamically.

The `structuredData` prop will produce a script tag formatted as [Structured Data](https://developers.google.com/search/docs/guides/intro-structured-data). It will automatically add `"@context": "http://schema.org"` and will convert any `type` keys to `@type`.


`vitreum/meta.js` provides a react component which will render into the head. When you use the vitreum `render` step, it will render the metatags into the `head` property. This means these tags will be scrapable by robots, even if you are using isomorphic rendering.