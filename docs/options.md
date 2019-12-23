# options


## how to set

Options can be set by commandline args or through the `options` parameter using Vitreum as a [requirable](). You can also set defaults in your `package.json` using the `vitreum` key.



`targets` - array of paths to entry points for your web app

`shared` - array of paths vitreum will consider to be part of the `require` look-up paths. _default:_ `['./client']`

`app` - string path to the server entry point. If not set the server will not be automatically started when running the dev task. _default:_ `pckg.main`

`prod` - boolean flag to determine if vitreum should compress files. If not set defaults to `true` if `NODE_ENV` is set to production. _default:_ `process.env.NODE_ENV == 'production'`

`dev` - boolean indicating to certain steps if we are doing a dev step. Automatically set by detecting environment, but you can manually set it. _default:_ `auto on env`

`static` - boolean indicating if during a build vitreum should also render a static html version of each entry point. If set when using `dev` starts a simple internal http server with livereloading to serve your static files. _default:_ `false`

`rootPath` - the path that will be prefixed in the renderer to each of paths of the assets. This is useful if the entrypoint needs to be served from subpath, such as with Github pages. _default:_ `'/'`

`embed` - boolean indicating if the generated js and css should be embeded into the rendered HTML directly.

`bundle` - an array of [globs]() that should be ignored when considering which packages to bundle in `libs.js`. This is useful when using private npm modules. _defaults:_ `[]`

`transformLibs` - (default: false) if true applies the babel transforms to your libs. This will greatly slowdown build times.

`packagesToTransform` - an array of package names that should be ignored when considering which packages to bundle in `libs.js`. This is useful when using private npm modules. _defaults:_ `[]`

`template` - string path to a js file that will be used to create the html renders for each entrypoint. _default:_ `vitreum/lib/templates/html.js`

`paths` - an object that defines what paths and files naming conventions vitruem will use. _defaults:_

```
paths  : {
  build  : './build',
  code   : 'bundle.js',
  style  : 'bundle.css',
  render : 'render.js',
  static : 'index.html',
  libs   : 'libs.js'
}
```
