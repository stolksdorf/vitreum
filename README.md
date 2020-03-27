# vitreum
An opinioned build system for modern web apps.

[![npm version](https://badge.fury.io/js/vitreum.svg)](https://badge.fury.io/js/vitreum)


`vitreum` is a build tool for creating web applications; similar to webpack and [parcel](https://parceljs.org/). It uses common tools: React, Browserify, and LiveReload. `vitreum` focuses on incredibly fast build times and tooling for tightly active development.


*Example build script for your project*
```js
const { pack, writeFile } = require('vitreum');

let cssCache = {}
const transforms = {
  '.css' : (code, filename)=>{
    cssCache[filename] = code;
    return;
  }
};

const renderHTML = ({head, body, props})=>{
  return `<html lang='en'>
  <head>
    ${head}
  </head>
  <body>
    <main>${body}</main>
  </body>
  <script src='/bundle.js'></script>
  <script>start(${JSON.stringify(props)})</script>
</html>`
};


const build = async ()=>{
  const { bundle, render } = await pack('../client/main.jsx', {
    transforms,
    libs : ['very_big_lib.js']
  });

  const props = { msg : 'hello world!'};

  await writeFile('./build/bundle.js', bundle);
  await writeFile('./build/index.html'), renderHTML({
    head: `<style>${Object.values(cssCache).join('\n')}</style>`
    body : render(props),
    props
  });
};

build();
```
_ In this example we are bundling a component and producing a `bundle.js` and a `index.html` with the component pre-rendered with the given props. The `start()` function will kick off the React app. We've added a custom transform to be able to require in CSS files and have them rendered into the `<head>` of the HTML. And lastly, there's a very large library that will be included, but the transforms will not be applied to it. _


### How it works

Vitreums goal is to take a path to a react component, process and bundle it, then return three things:

1. `bundle`: Client-side friendly bundle of all needed code to run it
2. `render`: A function to render a string html version of the component with given opts.
3. `ssr`: Code for server-side rendering this component on request.

It's up to you how'd you like to use these pieces of contruct your app's specific build process. Maybe bundles everything together into a single HTML file and upload it to S3? Easily add a react-powered github page to your repo? Use transforms to bundle everything into a chrome extension and zip it? Entirely up to you!


### Features
- **Custom Transforms:** Control how vitreum loads and processes specific filetypes. Allowing you to require images, css files, etc. all within your bundle.
- **Dev Mode:** Vitreum can watch your file system and rebundle only the files that change while developing




## Recipes

Since each project has different build needs `vitreum` functions more like a toolbox, exposing useful tools to use to craft the build system you need. Vitreum doesn't work right out-of-box, and it's expected that you have a build script written for your project. This way as your project changes you can tweak and modify the process easily without needing to use a bunch of plugins or 3rd party tooling.

Vitreum comes with several examples, or "recipes" for common build flows. Most of the time you can just copy and paste one of them and you're good to go.

[Link to recipes here]




## API

### `async vitreum.pack(path_to_component, [opts]) -> {bundle, render, ssr}`

Takes a `path_to_component`, and any additional options, and async returns `bundle`, `render`, `ssr`.

- `bundle` : A string of javascript that is all the code needed to execute your app client-side (including React and libraries). It exposes a single global function `start(props, target)` that will start your webapp with the props provided and targeting a specific DOM node.
- `render(props)`: A function that when called with `props` will return a string of HTML of your webapp rendered with the given props.
- `ssr`: A string of javascript that will expose a function for doing server-side rendering (essentially `render()`). Save this and require it in your server to dynamically server-side render your app on request.


```js
const fs = require('fs').promises;
const { pack, html } = require('vitreum');

const run = async ()=>{
  const { bundle, render, ssr } = pack('./client/main.jsx', {
    libs : ['very_large_lib.js'], // Won't have transforms applied to it
    paths : ['./client/shared']   // option passed to Browserify
  });

  const mainPage = html({
    body : render();
    tail : `<script src='./bundle.js'></script>`
  });
  await fs.writeFile('./build/index.html', mainPage);
  await fs.writeFile('./build/bundle.js', bundle);
  console.log('Done!');
}

run();
```


```js
//Opts
{
  dev : ({bundle, render, ssr})=>{}, //If provided will put vitreum in dev mode, watching for file changes. Will call the function with the new results of `pack` on change
  transforms : {}, //Any custom transforms, key should be file extension, and value is a transform function
  libs : ['foo', 'big_lib'], //Any libraries or files that should not have transforms applied to them. Usually for large and/or complex dependacies
  ...rest, //Any additional opts will be passed directly to Browserify as options, https://github.com/browserify/browserify#browserifyfiles--opts
}
```





### `vitreum.html({head, body, tail, props}) -> string of html`

Provides a very basic html template renderer if you project doesn't need anything special. Copy this file into your project and make changes to it if you'd like more control over how your HTML is rendered.

- `head`: HTML string to be injected in the head of your html
- `body`: HTML string to be injected into the body of your html, wrapped in a `<main>` tag
- `tail`: HTML string to be injected at the end of your HTML
- `props`: A javascript object that will be stringified an embedded in the `start_app()` call

**Note:** `vitreum.html` will automatically add a startup script to the tail of your HTML. This kicks off React and starts your webapp. If you are generating your own HTML, make sure you copy over this functionality.

```js
const fs = require('fs').promises;
const { pack, html } = require('vitreum');

pack('./client/main.jsx')
  .then(({render})=>{
    return fs.writeFile('./build/index.html', html({
      head : `<title>My Project</title>`,
      body : render();
    }))
  });
```


### `vitreum.server(path_to_folder, [opts]) -> Launches a simple server`
Sometimes you just need a really simple server to host your project for development purposes. `vitreum` ships with one that does just that.

**Note:** For dev-purposes only, use a more mature solution for production.

```js
const { server } = require('vitreum');

// Use vitreum to bundle your project here...

//Then kick off the server!
server('./build', {
  port : 8001,
})

```

```js
//Opts
{
  port : 8000, //What port the server should run on
  basepath : '/foo', //Always ensures every URL is prefexed with this base_path. Used for testing github pages mainly.
}

```

### `vitreum.livereload(watch_path)`

Sets up a [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) watching the `watch_path`. Whenever a file changes there, sends a signal from the LiveReload server. If you have the extension installed it will automatically update the source on your page. Incredibly usage for developing.

```js
const { livereload, server } = require('vitreum');

// Bundle code here...

server('./build');
livereload('./build'); // Will update whenever a file is changed in the build folder
```


### `vitreum.utils`

A collection of little utilities that `vitreum` uses.

- `chalk(msg)`: a micro-implementation of [chalk](https://www.npmjs.com/package/chalk), used to color console messages
- `relativePath(path, offset=1)`: Returns an absolute path using the passed in relative path, and a stacktrace offset.
- `decache(path)`: de-caches a file from Node's `require`
- `writeFile(path, content)`: A simple utility function that combines [`fs-extra.ensureFile`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md) and [`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback). It will create any needed directory structure inorder to successfully create/update the file.






## Transforms

[Transforms](https://github.com/browserify/browserify-handbook#transforms) are Browserify's way of processing certain files before they get bundled. This can be leveraged in powerful ways, such as being able to require in text files as strings, or automatically copying assets to a build folder and getting the new path to it as a string in code.

`vitreum` exposes a simple iterface for writing your own transforms, along with some useful [builtin ones]() you can use.

A transform consists of an extension association and a transforming function, while will be passed the file's path and contents.

```js
const foo2js = require('foo2js');
const fse  = require('fs-extra');

const transforms = {
  '.foo': (code, filename, opts)=>{
    return foor2js(code);
  },
  '*': async (code, filename, opts)=>{
    const newPath = path.relative(opts.entrypoint, filename);
    await fse.copy(filename, './build/' + newPath);
    return `module.exports= '${newPath}';`
  }
}
```

In this example we have two custom transforms. The first is leveraging a third-party module to transform `.foo` files into javascript. The second transform is applied to any file that doesn't match the other transforms, and will copy them to the build directory and return the new path to it as a string.

#### Built-in Transforms

[list will go here]
- style
- asset
- yaml
- encode


#### Default Transforms

`vitreum` comes with 4 default transforms applied. These can be overwritten if you want.

```js
const babelify = async (code)=>(await require('@babel/core').transformAsync(code,{ presets : ['@babel/preset-react'] })).code;

const defaultTransforms = {
  '.js'   : (code, filename, opts)=>babelify(code),
  '.jsx'  : (code, filename, opts)=>babelify(code),
  '.json' : (code, filename, opts)=>`module.exports=${code};`,
  '*'     : (code, filename, opts)=>`module.exports=\`${code}\`;`
};

```


## Additional Docs

- [Command Line Tools](docs/cli.md)
- [Options](docs/options.md)
- [Headtags](docs/headtags.md)
- [Requirable](docs/requirable.md)
- [Transforms](docs/transforms.md)
