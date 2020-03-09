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

It's up to you how'd you like to use these pieces of contruct your app's specific build process.


### Features
- **Custom Transforms:** Control how vitreum loads and processes specific filetypes. Allowing you to require images, css files, etc. all within your bundle.
- *Dev Mode:* Vitreum can watch your file system and rebundle only the files that change while developing




## Recipes

Since each project has different build needs `vitreum` functions more like a toolbox, exposing useful tools to use to craft the build system you need. Vitreum doesn't work right out-of-box, and it's expected that you have a build script written for your project. This way as your project changes you can tweak and modify the process easily without needing to use a bunch of plugins or 3rd party tooling.

Vitreum comes with several examples, or "recipes" for common build flows. Most of the time you can just copy and paste one of them and you're good to go.

[Link to recipes here]




## API

### `async vitreum.pack(path_to_component, [opts]) -> {bundle, render, ssr}`

Takes a `path_to_component`, and any additional options, and async returns `bundle`, `render`, `ssr`.


#### options

```
{
  dev : [function], //If provided will put vitreum in dev mode, watching for file changes. Will call the function with the new results of `pack` on change
  transforms : [object], //Any custom transforms, key should be file extension, and value is a transform function
  libs : [arr of strings], //Any libraries or files that should not have transforms applied to them. Usually for large complex dependacies
  ...rest, //Any additional opts will be passed directly to Browserify as options
}
```


### `vitreum.html({head, body, tail, props}) -> string of html`

Provides a very basic html template renderer if you project doesn't need anything special. Copy this file into your project and make changes to it if you'd like more control over how your HTML is rendered.

```js
const { pack, writeFile, html } = require('vitreum');

pack('./client/main.jsx')
  .then(({render})=>{
    return writeFile('./build/index.html', html({
      body : render();
    }))
  });
```


### `async vitreum.writeFile(path_to_file, contents)`
A simple utility function that combines [`fs-extra.ensureFile`](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md) and [`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback). It will create any needed directory structure inorder to successfully create/update the file.

```js
const { writeFile } = require('vitreum');

writeFile('./build/main/foobar/note.txt', 'oh, Hello.')
  .then(()=>console.log('Success!'));

```


### `vitreum.server(path_to_folder, [opts]) -> Launches a simple server`
Sometimes you just need a really simple server to host your project for development purposes. `vitreum` ships with one that does the trick. *Note:* For dev-purposes only, use a more mature solution for production.

`path_to_folder` is the folder the server will hsot from.


```js
const { server } = require('vitreum');


server('./build', {
  port : 8001,
})

```

```js
//Opts
{
  port : 8000, //What port the server should run on
  basepath : '/foo', //Always ensures every URL is prefexed with this base_path. Used for testing github pages functionality.
}

```





### `vitreum.livereload({head, body, tail, props}) -> string of html`







## Transforms



### Server-side Rendering



```js
// Express Example
const app = require('express')();
const MainRender = require('./build/main/render.js');

app.get('/', (req, res)=>{
  res.send(MainRender({ url : req.url });
});
```


### Transforms
Whenever Vitreum encounters a file it will check it's list of [transforms](docs/transforms.md) and potentially modify the file (or do other operations) before it adds it to the bundle. These transforms allow you to require in assets, styles, or other various files.

** Built in transforms **


### Live-reloading

When running a dev-build Vitreum will [livereload](http://livereload.com/) any code and style changes that happen. By installing and using the [LiveReload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) your browser will instantly switch up javscript and styles when they change.



## Additional Docs

- [Command Line Tools](docs/cli.md)
- [Options](docs/options.md)
- [Headtags](docs/headtags.md)
- [Requirable](docs/requirable.md)
- [Transforms](docs/transforms.md)
- [Migration from v4](docs/migration.md)