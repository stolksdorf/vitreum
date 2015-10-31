#vitreum
vitreum is a build system for web apps using a specific project structure. It use React, gulp, Browserify, and Less. It's broken into three main components.

**Tasks** : Adds a series of gulp tasks to create built files for development and production

**Render** : Used on the server to pre-render your web-app server-side to give you isomorphism.

**Headtags** : (might be moved into it's own module later) Modifying tags within the head with an isomorphic app is tricky. This package makes it easy.

### project structure
```
myProj
├─ build
├─ node_modules
├─ client
|   ├─ template.dot
|   └─ entryPointA
|      ├─ entryPointA.jsx
|      └─ entryPointA.less
├─ server.js
└─ gulpfile.js

├── _includes
|   ├── footer.html
|   └── header.html
├── _layouts
|   ├── default.html
|   └── post.html
├── _posts
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.textile
|   └── 2009-04-26-barcamp-boston-4-roundup.textile
├── _data
|   └── members.yml
```

### tasks




### render

