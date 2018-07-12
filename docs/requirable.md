# Requirable
Vitreum can also be used as a requirable library. This can be used to write specific scritps with overrides, or pre/post tasks to build or dev tasks.

`vitreum/build([targets], [opts])`


LINK TO OPTIONS HERE


## options

`targets` an array of paths to entry points for your web app

`shared` an array of paths vitreum will consider to be part of the `require` look-up paths. _default:_ `['./client']`

`app` a string path to the server entry point. _default:_ `pckg.main`

`dev` a boolean indicating to certain steps if we are doing a dev step. _default:_ `false`

`static` a boolean indicating if during a build vitreum should also render a static html version of each entry point. _default:_ `false`

`embed` a boolean or array of regexes indicating which assets should be base64 encoding and embedding into the bundle.

`template` a string path to a js file that will be used to create the html renders for each entrypoint. _default:_ `vitreum/src/default.template.js`

`paths` is an object that defines what paths and files naming conventions vitruem will use. _defaults:_

```
paths  : {
  build  : './build',
  code   : 'bundle.js',
  style  : 'bundle.css',
  render : 'render.js',
  static : 'static.html',
  libs   : 'libs.js'
}
```



## Two Different Build Paths
Sometimes your project might require two completely separate "builds" for one project. One example of this would be having a user facing app, one with several entry points, and an admin interface. There should be minimal code shared between them and you'd like even separate `libs.js` files since there are very different interfaces.


```js
const build = require('vitreum/build');

Promise.resolve()
	.then(()=>{
		return build('./client/admin/admin.jsx', {
			paths : {
				build : './build/private'
			}
		})
	})
	.then(()=>{
		return build(['./client/developer/developer.jsx', './client/customer/customer.jsx'], {
			paths : {
				build : './build/public'
			}
		})
	})
	.catch((err)=>console.error(err));
```

The above will produce the following files

```
/build
  ├─ /private
  |  ├─ libs.js
  |  └─ /admin
  |     ├─ bundle.js
  |     ├─ bundle.css
  |     └─ render.js
  └─ /public
    ├─ libs.js
    ├─ /developer
    |  ├─ bundle.js
    |  ├─ bundle.css
    |  └─ render.js
    └─ /customer
       ├─ bundle.js
       ├─ bundle.css
       └─ render.js
```