# vitreum
An opinioned build system for modern web apps.

[![npm version](https://badge.fury.io/js/vitreum.svg)](https://badge.fury.io/js/vitreum)


`vitreum` is a build tool for creating web applications; similar to webpack and [parcel](https://parceljs.org/). It uses common tools: React, Browserify, LESS, and LiveReload. `vitreum` focuses on incredibly fast build times and tooling for tightly active development.



### How it works

Vitreums goal is to take a webapp code, format it, and bundle it so it can be served and rendered client-side. Vitreum takes in a list of entrypoint files; For each file it walks down it's dependacies, [transforming](docs/transforms.md) the file and then adding it to the various bundles.
It produces a `bundle.js`, `bundle.css`, and `render.js` for each entrypoint. And produces a shared `libs.js` and an `/assets` folder.


#### Produced Files

- `/build/[entrypoint]/bundle.js` is a complete client-side ready bundle of all the code needed to run that single entrypoint. On require it exposes the top level export of the entrypoint.

- `/build/[entrypoint]/bundle.css` is a complete bundle of all the required in style files (`.css` or `.less`) needed for that entrypoint.

- `/build/[entrypoint]/render.js` is used for doing easy isomorphic rendering. It exports a syncronous function that takes a `props` object and an option `opts` object as parameters. It returns a sever-side rendered HTML string of the bundle given those props passed in.

Default options for `opts` are `{ render : true, cache : false }`. When `cache` is set to `true` the function will return a cached result if provided identical props it has seen before.

~*Note:* Vitreum will populate a global variable client-side called `vitreum_props` with a copy of the props passed in via the `render.js`. This is populated before any other code is loaded so it can be used immediately.~

```js
// Express Example
const app = require('express')();
const MainRender = require('./build/main/render.js');

app.get('/', (req, res)=>{
  res.send(MainRender({ url : req.url });
});
```



- `/build/libs.js` is a bundling of all the libraries used by the entrpoints. As Vitreum is detecting dependacies, if a depedancy is located in the `node_modules` folder (and not defined in the `bundle` option), it's added to `libs.js`. This operation is expensive so dev-builds on Vitreum will not bundle libs.

- `/build/assets/...` is a directory of all the copies of assets discovered during the build process. Each file path to the asset is the same as it is in the project.


## Key Concepts


### folder-based components
One of the core reason why Vitreum exists to to make it easy to use folder-based components. These components are self-contained within a folder with a JSX component, an associated LESS file with it, and any files or sub-compoennts that it needs.

This method keeps your components incredibly modular and then your file system reflects your component hierarchy.

```
/page
  ├─ page.jsx
  ├─ page.less
  ├─ user.png
  └─ /widget
    ├─ widget.jsx
    └─ widget.less
```

### Isomorphic Rendering
[Isomorphic Rendering](https://medium.com/airbnb-engineering/isomorphic-javascript-the-future-of-web-apps-10882b7a2ebc#.4nyzv6jea) is the process of pre-rendering what your site should look like on a per request basis, rendering it to an HTML string on the server and sending that back on request.


### Transforms
Whenever Vitreum encounters a file it will check it's list of [transforms](docs/transforms.md) and potentially modify the file (or do other operations) before it adds it to the bundle. These transforms allow you to require in assets, styles, or other various files.



### Live-reloading

When running a dev-build Vitreum will [livereload](http://livereload.com/) any code and style changes that happen. By installing and using the [LiveReload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) your browser will instantly switch up javscript and styles when they change.


### Static
Vitreum also supports the ability to do static builds of your project, if you have no need for any server-side logic, or server-side rendering. A useful application of this using this with [Github Pages](https://pages.github.com/).


- *on build* it runs the renderer and produces an `index.html` for each entrypoint.
- *on dev* uses an internal http server to serve the files and assets. Replicates for Github pages work.

`$ vitreum init --static` will also configure your project to be ready to be used with github pages if you [configure your publish source as `/docs`](https://help.github.com/en/articles/configuring-a-publishing-source-for-github-pages).


```
{
  "scripts": {
    "build": "vitreum --static",
    "dev": "vitreum --dev --static"
  },
  ...
}
```






## Additional Docs

- [Command Line Tools](docs/cli.md)
- [Options](docs/options.md)
- [Headtags](docs/headtags.md)
- [Requirable](docs/requirable.md)
- [Transforms](docs/transforms.md)
- [Migration from v4](docs/migration.md)