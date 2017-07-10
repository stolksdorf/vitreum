# examples
Vitreum is a set of build tools, so you can use each part of it however you like. The following are some best practices to get you going and tweak from there.

#### `package.json` scripts

```javascript
{
  "name": "test_project",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "node scripts/build.js",
    "prod" : "set NODE_ENV=production&& npm run build",

    "postinstall": "npm run build",
    "start" : "node server/server.js"
  },
  "author": "",
  "license": "ISC"
}
```

To run these:

- `npm run build` - Will create a fresh build including build `libs`. Always best to do this first.
- `npm run prod`  - Runs the build script in production mode. Everything should be compressed and sourcemapping removed. This may take much longer than a regular build step. Useful for testing how a prod build would look like in production.
- `npm run dev`   - Will start development mode with file watching and livereloading.


#### build scripts
It's best to build two scripts `dev.js` and `build.js`. Dev is for active development and includes livereloading and filesystem watching, where `build` bundles together your libs which can time-consuming.


`build.js`
```javascript
const label = 'build';
console.time(label);

const steps = require('vitreum/steps');
const Proj = require('./project.json');

Promise.resolve()
	.then(()=>steps.clean())
	.then(()=>steps.libs(Proj.libs))
	.then(()=>steps.jsx('main', './client/main/main.jsx', Proj.libs))
	.then((deps)=>steps.less('main', [], deps))
	.then(()=>steps.assets(Proj.assets, ['./client']))
	.then(()=>console.timeEnd(label))
	.catch((err)=>console.error(err));
```

#### `dev.js`
```javascript
const label = 'dev';
console.time(label);
const steps = require('vitreum/steps');

const Proj = require('./project.json');

Promise.resolve()
	.then(()=>steps.jsxWatch('main', './client/main/main.jsx', Proj.libs))
	.then((deps)=>steps.lessWatch('main', [], deps))
	.then(()=>steps.assetsWatch(Proj.assets, ['./client']))
	.then(()=>steps.livereload())
	.then(()=>steps.serverWatch('./server.js', ['server']))
	.then(()=>console.timeEnd(label))
	.catch((err)=>console.error(err));
```


#### isomorphic server rendering
The `render` simply takes a created bundled and makes it into a ready-to-ship HTML string, so this can either be used for static rendering, or isomorphic rendering on the server first.

`server.js`

```javascript
const templateFn = require('./client/template.js');
app.get('*', (req, res) => {
	//Load some data or state in here
	render('main', templateFn, {
			url : req.url,
			data : coolProps
		})
		.then((page) => res.send(page))
		.catch((err) => {
			console.log(err);
		});
});
```


#### static rendering
Vitreum makes it very easy to take advantage of isomorphic rendering, however it's `render` step can be used within a script to statically render HTML to serve.

```javascript
const label = 'static';
console.time(label);

const fs = require('fs');
const steps = require('vitreum/steps');
const templateFn = require('./client/template.js');
const Proj = require('./project.json');

Promise.resolve()
	.then(()=>steps.clean())
	.then(()=>steps.libs(Proj.libs))
	.then(()=>steps.jsx('main', './client/main/main.jsx', Proj.libs))
	.then((deps)=>steps.less('main', [], deps))
	.then(()=>steps.assets(Proj.assets, ['./client']))
	.then(()=>render('main', templateFn))
	.then((renderedPage)=>fs.writeFileSync('./build/main.html', renderedPage))
	.then(()=>console.timeEnd(label))
	.catch((err)=>console.error(err));
```



