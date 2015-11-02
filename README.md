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
|   └─ /myProj
├─ server.js
└─ gulpfile.js
```

### gulpfile.js


### tasks

**cmds** - Lists all the tasks

**clean** - clears out the build folder and removes all `architecture.json` files

**libs** - uses browserify to build your `libs.js` file from the list provide in the config. These files will not be a part of your js bundle and will be minified.

**js** - first builds an `architecture.json` which is a file that maps the dependacy structure of each entrypoint. Vitreum uses this is a few other processes, it's also useful for debugging. It then uses browserify to build a bundle for each entrypoint, excluding all modules listed in the `libs` in the gulpfile config.

**js-watch** - Does the same as above but also setups up [watchify] which will do (very fast) incremental builds whenever any of your js/jsx files change.

**less** - uses the `architecture.json` to find any .less files that belong to required jsx components and auto-imports them. It builds a `bundles.less` for each entrypoint.

**less-watch** - Same as above but also setups up a watcher to re-run the `less` task whenever a less file changes.

**assets** - uses the glob-matching list provided in the gulpfile to move assets into the build folder. They will maintain most of their folder pathing when moved, so same named assets don't clobber eachother.

**template** - generates a entrypoint-specific `bundle.dot` file using the `template.dot` defined in the gulpfile. Vitreum/render uses this to render your webapp on the server first before shipping it.

**livereload** - setups a [livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) server to hot-load js and css into your webapp while developing whenever their is a change in the build.

**runserver** - starts the server file. Sets up a listening for any changes in that file and the server file that will automatically restart the server.


### hybrid tasks

**run** - `assets, js-watch, less-watch, template, livereload, runserver`

**fresh** - `clean, libs, run`

**build** - `clean, libs, assets, js, less, template`

**prod** - `build` (with dev flag forced to false)

**default** - `run`



### render

