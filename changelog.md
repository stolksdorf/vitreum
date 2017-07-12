# changelog

### v4.5.2 - Wednesday, 12/07/2017
- Improved check to allow top-level function component entry points.

### v4.5.1 - Monday, 10/07/2017
- Updated `browserify` to v14
- Updated `fs-extra` to v3
- Added `klaw` (functionality removed from `fs-extra v1`)

### v4.5.0 - Monday, 10/07/2017
**Warning** : This version changes step function signature, so your build scripts will need to be updated

- `libs`, `jsx` and `less` steps (and associated `*Watch` steps) now take a generic `opts` argument, instead of various arguments. This will allow me to add more features and expand functionality in the future without changing step function signature
- `jsx` and `less` steps now resolve file paths instead of constructing them.
- Added option to `libs`, `jsx` and `less` steps to change filename of resulting bundle
- Added option to change the babel presets on the `jsx` step
- Added option to use a project's `.babelrc` file
- Added option to disable the global transform on `babelify` (not recommended)
- Updated examples and readme to reflect the above changes

### v4.4.1
- Fixed err.toString in render.js #21
