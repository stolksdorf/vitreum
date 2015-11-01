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

**clean** - clears out the build folder and removes all `architecture.json` files
**libs** - uses browserify to build your `libs.js` file from the list provide in the config. These files will not be a part of your js bundle and will be minified.





### render

